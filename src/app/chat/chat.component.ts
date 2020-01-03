import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap, debounceTime, throttleTime, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$: Observable<any>;
  newMsg: string;

  isTyping: Subject<string> = new Subject<string>();

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) { }

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    const source = this.cs.get(chatId);
    this.chat$ = this.cs.joinUsers(source).pipe(tap(v => this.scrollBottom()));
    this.scrollBottom();

    this.isTyping.asObservable().pipe(filter(data => data != ''), throttleTime(1400)).subscribe((data) => {
      this.cs.sendIsTyping(chatId)
    });

    this.isTyping.asObservable().pipe(filter(data => data != ''), debounceTime(1500)).subscribe((data) => {
      this.cs.deleteIsTyping(chatId)
    });
  }

  getCreatedDate(msg) {
    return new Date(msg.createdAt)
  }

  getUserName(user) {
    return user.realName ? user.realName : user.name;
  }

  setTypingActive(value) {
    this.isTyping.next(value)
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
