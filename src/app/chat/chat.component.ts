import { Component, OnInit, HostListener } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap, map, debounceTime, throttleTime, filter, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { AttachmentService } from '../services/attachment.service';

interface User {
  uid: string;
  companyId: string;
  email: string;
  name: string;
  realName: string;
  photoUrl: string;
}

interface Message {
  content: string;
  uid: string;
  createdAt: number;
  user: User;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$: Observable<any>;

  messageControl: FormControl;
  chatForm: FormGroup;

  messages: Message[] = [];

  dateOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

  constructor(
    public cs: ChatService,
    public as: AttachmentService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.messageControl = new FormControl();
    this.chatForm = this.fb.group({ message: this.messageControl });
  }

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    const source = this.cs.get(chatId);
    this.chat$ = this.cs.buildChat(source).pipe(tap(() => this.scrollBottom()), tap((res) => this.integrateNewMessages(res)));
    this.scrollBottom();

    this.messageControl.valueChanges.pipe(filter(data => data != ''), throttleTime(1400)).subscribe((data) => {
      this.cs.sendIsTyping(chatId)
    });

    this.messageControl.valueChanges.pipe(filter(data => data != ''), debounceTime(1500)).subscribe((data) => {
      this.cs.deleteIsTyping(chatId)
    });
  }

  integrateNewMessages(chat) {
    const newMessages = chat.messages.filter((newMessage: Message) => !this.messages.some((message: Message) => this.isSameMessage(message, newMessage)));
    newMessages.forEach((msg) => this.messages.push(msg))
  }

  private isSameMessage(message: Message, newMessage: Message): unknown {
    return message.content === newMessage.content && message.uid === newMessage.uid && message.createdAt === newMessage.createdAt;
  }

  getUserById(typerId) {
    return this.getUserName(this.cs.getUserById(typerId))
  }

  getTypingUserById(typerId) {
    return this.getUserName(this.cs.getUserById(typerId)) + ' is typing ...'
  }

  showTyping(typing, userId) {
    return typing.some(typerId => typerId !== userId)
  }

  getTypingUsersById(typing, userId) {
    const otherUserIds = typing.filter(typerId => typerId !== userId);
    let names: string = otherUserIds.map(typerId => this.getUserName(this.cs.getUserById(typerId))).join(', ')
    otherUserIds.length > 1 ? names = names + ' are typing...' : names = names + ' is typing...'
    return names;
  }

  isPreviousMessageFromSameAuthor(currentIndex){
    return currentIndex == 0 || (currentIndex > 0 && this.messages[currentIndex-1].uid !==  this.messages[currentIndex].uid)
  }

  isPreviousMessageFromOtherDay(currentIndex){
    const prevMsg = this.messages[currentIndex - 1];
    if(!prevMsg){
      return true;
    }
    const prevDate = new Date(prevMsg.createdAt).getDay();
    const date = new Date(this.messages[currentIndex].createdAt).getDay();
    return currentIndex == 0 || (currentIndex > 0 && prevDate !== date)
  }

  getDateDivider(msg){
    if (!msg.createdAt) {
      return null
    }
    const date = new Date(msg.createdAt);
    return date.toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  getCreatedDate(msg) {
    if (!msg.createdAt) {
      return null
    }
    return new Date(msg.createdAt).toLocaleString()
  }

  getUserName(user) {
    if (!user) {
      return null
    }
    return user.realName ? user.realName : user.name;
  }

  getNow() {
    return new Date();
  }

  submit(chatId) {
    const msg = this.messageControl.value;
    if (!msg) {
      return alert('Please enter a message.');
    }
    this.cs.sendMessage(chatId, msg);
    this.as.uploadAttachments().subscribe(res => console.log(res), err => console.log(err))
    this.messageControl.reset();
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  private scrollBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }

  setSelectedFiles(event){
    this.as.setSelectedFiles(event)
  }

  deleteAttachment(file){
    return this.as.deleteFile(file)
  }

  getAttachments(){
    return this.as.getFiles()
  }

  hasAttachments(){
    return this.as.getFiles().length > 0
  }

  getUploadPercentage(index){
    return this.as.getUploadPercentages()[index].pipe(tap((res) => console.log("Upload", res)))
  }
}
