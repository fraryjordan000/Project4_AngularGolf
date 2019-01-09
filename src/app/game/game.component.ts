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
  courseId: number;
  tee: string;
  players: any;

  fireFetched: boolean = false;

  holes: any = (()=>{
    let tmp = [];
    for(let i=1; i <= 18; i++) {
      tmp.push(i);
    }
    return tmp;
  })();

  ngOnInit() {
    this.cardStats.valueChanges().subscribe(res => {
      let tmp = JSON.parse(res);
      this.courseId = tmp.course;
      this.tee = tmp.tee;
      this.players = tmp.players;
      this.fireFetched = true;
    });
  }

  genCardData() {
    
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
