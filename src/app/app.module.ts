import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewGameComponent } from './new-game/new-game.component';
import { GameComponent } from './game/game.component';

const myRoutes: Routes = [
  { path: "new-game" , component: NewGameComponent },
  { path: "game", component: GameComponent},
  { path: "", component: NewGameComponent},
  { path: "**", component: NewGameComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(
      myRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }