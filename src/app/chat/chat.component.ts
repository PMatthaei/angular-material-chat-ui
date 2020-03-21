import { Component, OnInit, HostListener, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  tap,
  map,
  debounceTime,
  throttleTime,
  filter,
  switchMap
} from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AttachmentService } from '../services/attachment.service';

export interface User {
  uid: string;
  companyId: string;
  email: string;
  name: string;
  realName: string;
  photoUrl: string;
}

export interface Message {
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
  @Input() height: string;
  @Input() width: string;

  chat$: Observable<any>;

  messages: Message[] = [];

  constructor(
    public chatService: ChatService,
    public attachmentService: AttachmentService,
    private route: ActivatedRoute,
    public auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    const source = this.chatService.get(chatId);
    this.chat$ = this.chatService.buildChat(source).pipe(
      tap(() => this.scrollBottom()),
      tap(res => this.integrateNewMessages(res))
    );
  }

  integrateNewMessages(chat) {
    const newMessages = chat.messages.filter(
      (newMessage: Message) =>
        !this.messages.some((message: Message) =>
          this.isSameMessage(message, newMessage)
        )
    );
    newMessages.forEach(msg => this.messages.push(msg));
  }

  private isSameMessage(message: Message, newMessage: Message): unknown {
    return (
      message.content === newMessage.content &&
      message.uid === newMessage.uid &&
      message.createdAt === newMessage.createdAt
    );
  }

  getUserName(user) {
    if (!user) {
      return null;
    }
    return user.realName ? user.realName : user.displayName;
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  private scrollBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }

  getUploadPercentage(index) {
    return this.attachmentService
      .getUploadPercentages()
      [index].pipe(tap(res => console.log('Upload', res)));
  }
}
