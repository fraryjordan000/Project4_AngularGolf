import { Component, OnInit } from '@angular/core';
import { ApiFetcherService } from '../api-fetcher.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {

  public cardStats: AngularFireObject<any>;
  public cardData: AngularFireObject<any>;

  constructor(private fetch: ApiFetcherService, private db: AngularFireDatabase) {
    this.cardStats = db.object<any>('/cardStats/json');
    this.cardData = this.db.object<any>('/cardData/json');
  }

  course: any;

  players: any = [1, 2, 3, 4];

  ngOnInit() {
  }

  async getCourseById(id: number, cb?: Function) {
    let promise = new Promise((resolve, reject) => {
      this.fetch.getCourseById(id, (res:any) => resolve(res.data));
    });

    this.course = await promise;

    if(cb != undefined) {
      cb();
    }
  }

}
