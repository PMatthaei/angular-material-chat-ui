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


  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.char != '') {
      this.messageControl.patchValue(this.messageControl.value + event.char);
    }
  }

  constructor(
    public cs: ChatService,
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

  getCreatedDate(msg) {
    if (!msg.createdAt) {
      return null
    }
    return new Date(msg.createdAt)
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

  submit(event, chatId) {
    const files = !event.files ? [] : event.files.map((file) => {
      return {
        url: file.src,
        type: file.type,
        icon: 'file-text-outline',
      };
    });

    if (!event.message) {
      return alert('Please enter a message.');
    }
    this.cs.sendMessage(chatId, event.message);
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  private scrollBottom() {
    //setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }
}
