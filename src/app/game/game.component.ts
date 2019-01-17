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
  public cardPlayers: AngularFireObject<any>;

  constructor(private fetch: ApiFetcherService, private db: AngularFireDatabase) {
    this.cardStats = this.db.object<any>('/cardStats');
    this.cardData = this.db.object<any>('/cardData');
    this.cardPlayers = this.db.object<any>('/cardStats/players');
  }

  course: any;
  courseId: number;
  tee: string;
  players: any;

  statsFetched: boolean = false;
  dataFetched: boolean = false;
  updated: boolean = true;
  holeTeesLoaded: boolean = false;

  holes: any;
  holeTees: any = [];
  playerCount: any;

  inputs: any = {};
  tmpPlayers: any = {};

  totals: any = [];
  ins: any = [];
  outs: any = [];
  totalPar: number;

  ngOnInit() {
    this.cardStats.valueChanges().subscribe(res => {
      this.courseId = res.course;
      this.tee = res.tee;
      this.players = res.players;
      this.getCourseById(res.course, () => {
        this.holes = this.course.holes;
        for(let h in this.holes) {
          for(let t in this.holes[h].teeBoxes) {
            if(this.holes[h].teeBoxes[t].teeType == this.tee) {
              this.holeTees.push(this.holes[h].teeBoxes[t]);
            }
          }
        }
        this.totalPar = 0;
    for(let t of this.holeTees) {
      this.totalPar += t.par;
    }
        this.holeTeesLoaded = true;
      });

      let tmp = [];
      for (let i = 0; i < this.players.length; i++) {
        tmp.push(i);
      }
      this.playerCount = tmp;

      this.statsFetched = true;

      this.cardData.valueChanges().subscribe(res => {
        if (!this.dataFetched) {
          if (res == "") {
            this.saveData(true);
          } else {
            this.loadData(JSON.parse(res));
            this.loadPlayers();
          }
          this.dataFetched = true;
        }
      });
    });
  }

  saveData(loadPlayers?: boolean) {
    let tmp = [];
    for (let h in this.holes) {
      for (let p of this.playerCount) {
        tmp.push(this.inputs[`h${this.holes[h].hole}p${p}`] == null ? "" : this.inputs[`h${this.holes[h].hole}p${p}`]);
      }
    }
    this.cardData.set(JSON.stringify(tmp));
    if(!loadPlayers && loadPlayers != undefined) {
      this.updatePlayers();
    } else {
      this.loadPlayers();
    }
  }

  updatePlayers() {
    this.updated = false;
    this.cardStats.valueChanges().subscribe((res)=>{
      if(!this.updated) {
        let tmp1 = res;
        let tmp2 = [];
        for(let p in this.playerCount) {
          tmp2.push(this.tmpPlayers['p'+p]);
          console.log(this.tmpPlayers['p'+p]);
        }
        tmp1.players = tmp2;
        this.cardPlayers.set(tmp1);
        this.updated = true
      }
    });
  }

  loadPlayers() {
    let loop = setInterval(()=>{
      for(let p in this.players) {
        this.tmpPlayers['p'+p] = this.players[p];
      }
      if(this.tmpPlayers['p0'] != null) {
        clearInterval(loop);
      }
    }, 10);
  }

  loadData(d: any) {
    let loop = setInterval(()=>{
      let index = 0;
      for (let h in this.holes) {
        for (let p of this.playerCount) {
          this.inputs[`h${this.holes[h].hole}p${p}`] = d[index];
          index++;
        }
      }
      if(this.inputs[`h1p0`] != null) {
        clearInterval(loop);
        this.calcNumbers(0);
        this.calcNumbers(1);
        this.calcNumbers(2);
      }
    }, 10);
  }

  calcNumbers(player: any) {
    this.totals[player] = 0;
    this.ins[player] = 0;
    this.outs[player] = 0;
    for(let h in this.holes) {
      let currentNum = parseInt(typeof(this.inputs[`h${h}p${player}`]) == "number" ? this.inputs[`h${h}p${player}`] : 0);
      if(parseInt(h) <= 9) {
        this.ins[player] += currentNum;
      } else {
        this.outs[player] += currentNum;
      }
      this.totals[player] += currentNum;
    }
  }

  async getCourseById(id: number, cb?: Function) {
    let promise = new Promise((resolve, reject) => {
      this.fetch.getCourseById(id, (res: any) => resolve(res.data));
    });

    this.course = await promise;

    if (cb != undefined) {
      cb();
    }
  }

}
