import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap, debounceTime, throttleTime, filter, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$: Observable<any>;
  newMsg: string;

  messageControl: FormControl;
  chatForm: FormGroup;

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
    this.chat$ = this.cs.buildChat(source).pipe(tap(v => this.scrollBottom()));
    this.scrollBottom();

    this.messageControl.valueChanges.pipe(filter(data => data != ''), throttleTime(1400)).subscribe((data) => {
      this.cs.sendIsTyping(chatId)
    });

    this.messageControl.valueChanges.pipe(filter(data => data != ''), debounceTime(1500)).subscribe((data) => {
      this.cs.deleteIsTyping(chatId)
    });
  }

  getUserById(typerId) {
    return this.getUserName(this.cs.getUserById(typerId))
  }

  getCreatedDate(msg) {
    return new Date(msg.createdAt)
  }

  getUserName(user) {
    return user.realName ? user.realName : user.name;
  }

  submit(chatId) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  private scrollBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }
}
