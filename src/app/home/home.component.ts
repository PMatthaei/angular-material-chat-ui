import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase/firebase-auth.service';
import { FirebaseChatService } from '../services/firebase/firebase-chat.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userChats$;
  constructor(public auth: FirebaseAuthService, public cs: FirebaseChatService) {}

  ngOnInit() {
    this.userChats$ = this.cs.getParticipatingChats();
  }

  getUserName(user) {
    return user.realName ? user.realName : user.displayName;
  }
}
