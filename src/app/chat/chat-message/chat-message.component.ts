import { Component, Input, OnInit } from '@angular/core';
import { Message, User } from '../chat.component';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() msg: Message;
  @Input() predecessor: Message;
  @Input() user: User;

  constructor() {}

  ngOnInit() {}

  getDateDivider(msg) {
    if (!msg.createdAt) {
      return null;
    }
    const date = new Date(msg.createdAt);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getUserName(user) {
    if (!user) {
      return null;
    }
    return user.realName ? user.realName : user.displayName;
  }

  getCreatedDate(msg) {
    if (!msg.createdAt) {
      return null;
    }
    return new Date(msg.createdAt).toLocaleString();
  }

  isPreviousMessageFromSameAuthor() {
    return this.predecessor && this.predecessor.uid !== this.msg.uid;
  }

  isPreviousMessageFromOtherDay() {
    if (!this.predecessor) {
      return true;
    }
    const prevDate = new Date(this.predecessor.createdAt).getDay();
    const date = new Date(this.msg.createdAt).getDay();
    return prevDate !== date;
  }
}
