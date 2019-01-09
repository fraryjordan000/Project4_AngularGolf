import { Component, OnInit } from '@angular/core';
import { ApiFetcherService } from '../api-fetcher.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.sass'],
})
export class NewGameComponent implements OnInit {

  public cardStats: AngularFireObject<any>;
  public cardData: AngularFireObject<any>;

  constructor(private fetch: ApiFetcherService, private db: AngularFireDatabase) {
    this.cardStats = db.object<any>('/cardStats/json');
    this.cardData = this.db.object<any>('/cardData/json');
  }
  
  courses: any;
  coursesRecieved: boolean = false;
  course: any;
  courseRecieved: boolean = false;
  courseTees: any;
  tee: any;
  playerNum: number;

  formComplete: boolean = false;

  ngOnInit() {
    this.getCourses();
    let parent = this;
    (function coursesRecieved() {
      if(parent.courses == undefined) {
        setTimeout(() => coursesRecieved(), 10);
      } else {
        parent.coursesRecieved = true;
      }
    })();
    this.cardStats.valueChanges().subscribe(res => console.log(JSON.parse(res)));
  }

  async getCourses() {
    let promise = new Promise((resolve, reject) => {
      this.fetch.getCourses((res: any) => resolve(res.courses));
    });

    this.courses = await promise;
  }

  async getCourseById(id: number, cb?: Function) {
    let promise = new Promise((resolve, reject) => {
      this.fetch.getCourseById(id, (res:any) => resolve(res.data));
    });

    this.course = await promise;

    this.courseTees = this.course.holes[0].teeBoxes;
    this.courseRecieved = true;

    if(cb != undefined) {
      cb();
    }
  }

  courseSelected(event): void {
    this.courseTees = undefined;
    this.tee = null;
    this.getCourseById(event.value, () => {this.isComplete()});
  }

  teeSelected(event): void {
    this.tee = event.value;
    this.isComplete();
  }

  playerNumSelected(event): void {
    this.playerNum = event.value;
    this.isComplete();
  }

  isComplete(): void {
    if(this.course != undefined && this.tee != undefined && this.playerNum != undefined) {
      this.formComplete = true;
    } else {
      this.formComplete = false;
    }
  }

  toGame() {
    let tmp = {
      course: this.course.id,
      tee: this.tee,
      playerNum: this.playerNum
    };
    this.cardStats.set(JSON.stringify(tmp));
    this.cardData.set("");
  }

}
