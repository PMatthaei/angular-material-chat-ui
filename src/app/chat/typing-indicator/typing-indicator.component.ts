import { Component, Input, OnInit } from '@angular/core';
import { FirebaseChatService } from '../../services/firebase/firebase-chat.service';
import { User } from '../../model/User';

@Component({
  selector: 'app-typing-indicator',
  templateUrl: './typing-indicator.component.html',
  styleUrls: ['./typing-indicator.component.scss']
})
export class TypingIndicatorComponent implements OnInit {
  @Input() user: User;
  @Input() typing: string[];

  constructor(private chatService: FirebaseChatService) {}

  ngOnInit() {}

  showTyping(typing, userId) {
    return typing.some(typerId => typerId !== userId);
  }

  getTypingUsersById(typing, userId) {
    const otherUserIds = typing.filter(typerId => typerId !== userId);
    let names: string = otherUserIds
      .map(typerId => this.getUserName(this.chatService.getUserById(typerId)))
      .join(', ');
    otherUserIds.length > 1
      ? (names = names + ' are typing...')
      : (names = names + ' is typing...');
    return names;
  }
  getUserName(user) {
    if (!user) {
      return null;
    }
    return user.realName ? user.realName : user.displayName;
  }
}
