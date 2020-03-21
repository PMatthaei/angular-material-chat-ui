import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../model/message';
import { User } from '../../model/User';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() msg: Message;
  @Input() predecessor: Message;
  @Input() user: User;
  @Input() allowsReply = false;

  constructor() {}

  ngOnInit() {}

  getDateDivider(msg): string {
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

  getUserName(user): string {
    if (!user) {
      return null;
    }
    return user.realName ? user.realName : user.displayName;
  }

  getCreatedDate(msg): string {
    if (!msg.createdAt) {
      return null;
    }
    return new Date(msg.createdAt).toLocaleString();
  }

  isNotTemporalClose() {
    if (!this.predecessor) {
      return false;
    }
    const duration = moment.duration(
      moment(this.msg.createdAt).diff(moment(this.predecessor.createdAt))
    );
    return duration.asMinutes() > 1;
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
