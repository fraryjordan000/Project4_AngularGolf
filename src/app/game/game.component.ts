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

  statsFetched: boolean = false;
  dataFetched: boolean = false;

  holes: any;
  playerCount: any;

  ngOnInit() {
    this.cardStats.valueChanges().subscribe(res => {
      let tmp1 = JSON.parse(res);
      this.courseId = tmp1.course;
      this.getCourseById(tmp1.course, ()=>{
        this.holes = this.course.holes;
      });
      this.tee = tmp1.tee;
      this.players = tmp1.players;

      let tmp2 = [];
      for(let i=0; i<this.players.length; i++) {
        tmp2.push(i);
      }
      this.playerCount = tmp2;

      this.statsFetched = true;
      this.cardData.valueChanges().subscribe(res => {
        if(!this.dataFetched) {
          if(res == "") {
            this.saveData();
          } else {
            this.loadData(JSON.parse(res));
          }
          this.dataFetched = true;
        }
      });
    });
  }

  saveData() {
    let tmp = [];
    for(let h in this.holes) {
      for(let p of this.playerCount) {
        tmp.push((<HTMLInputElement>document.getElementById(`h${this.holes[h].hole}p${p}`)).value);
      }
    }
    this.cardData.set(JSON.stringify(tmp));
  }

  loadData(d: any) {
    let p=0;
    let h=1;
    for(let i in d) {
      if(p < (this.playerCount.length-1)) {
        // (<HTMLInputElement>document.getElementById(`h${this.holes[h].hole}p${p}`)).setAttribute('value', d[i]);
        p++;
        continue;
      }
      p = 0;
      h++;
    }
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
