import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewGameComponent } from './new-game/new-game.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: "new-game" , component: NewGameComponent },
  { path: "game", component: GameComponent},
  { path: "", redirectTo: "/new-game", pathMatch: "full"},
  { path: "**", component: NewGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
