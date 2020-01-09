import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';
import {NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArrayFilterUidPipe } from './array-filter-uid.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbChatModule, NbCardModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons'
@NgModule({
  declarations: [AppComponent, ChatComponent, HomeComponent, ArrayFilterUidPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbChatModule,NbCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
