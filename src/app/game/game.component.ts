import { Component, OnInit } from '@angular/core';
import { ApiFetcherService } from '../api-fetcher.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {

  public cardStats: AngularFireObject<any>;
  public cardData: AngularFireObject<any>;
  public cardPlayers: AngularFireObject<any>;

  private readonly notifier: NotifierService;

  constructor(private fetch: ApiFetcherService, private db: AngularFireDatabase, notifierService: NotifierService) {
    this.cardStats = this.db.object<any>('/cardStats');
    this.cardData = this.db.object<any>('/cardData');
    this.cardPlayers = this.db.object<any>('/cardStats/players');
    this.notifier = notifierService;
  }

  course: any;
  courseId: number;
  tee: string;
  players: any;

  statsFetched: boolean = false;
  dataFetched: boolean = false;
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
  parScores: any = [];

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
          if (res.length < 10) {
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
    if(loadPlayers || loadPlayers != undefined) {
      this.loadPlayers();
    } else {
      this.updatePlayers();
    }
  }

  updatePlayers() {
    this.players = [];
    for(let p in this.playerCount) {
      this.players.push(this.tmpPlayers['p'+p]);
    }
    this.cardPlayers.set(this.players);
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
          this.inputs[`h${this.holes[h].hole}p${p}`] = (d[index] == null) ? "" : d[index];
          index++;
        }
      }
      if(this.inputs[`h1p0`] != null) {
        clearInterval(loop);
        this.calcNumbers(0);
        this.calcNumbers(1);
        this.calcNumbers(2);
        this.calcNumbers(3);
      }
    }, 10);
  }

  calcNumbers(player: any, hole?: any) {
    this.totals[player] = 0;
    this.ins[player] = 0;
    this.outs[player] = 0;
    for(let h=1; h <= this.holes.length; h++) {
      let currentNum = parseInt(typeof(this.inputs[`h${h}p${player}`]) == "number" ? this.inputs[`h${h}p${player}`] : 0);
      if(h <= 9) {
        this.ins[player] += currentNum;
      } else {
        this.outs[player] += currentNum;
      }
      this.totals[player] += currentNum;
    }
    this.parScores[player] = this.totals[player] - this.totalPar;
    if(hole == 18) {
      let msg = `${this.players[player]} has a par score of ${this.parScores[player]}, `;
      if(this.parScores[player] < 0) {
        msg += "on to the PGA!";
        this.notifier.notify('info', msg);
      } else {
        msg += "better luck next time!";
        this.notifier.notify('warning', msg);
      }
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
