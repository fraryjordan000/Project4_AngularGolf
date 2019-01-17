import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewGameComponent } from './new-game/new-game.component';
import { GameComponent } from './game/game.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule
} from '@angular/material';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { NameCheckPipe } from './name-check.pipe';
import { NotifierModule } from 'angular-notifier';

@NgModule({
  declarations: [
    AppComponent,
    NewGameComponent,
    GameComponent,
    NameCheckPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'left',
          distance: 12
        },
        vertical: {
          position: 'top',

          distance: 12
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }