import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userChats$;
  constructor(public auth: AuthService, public cs: ChatService) {}

  ngOnInit() {
    this.userChats$ = this.cs.getUserChats();
  }

  getUserName(user) {
    return user.realName ? user.realName : user.name;
  }
}
