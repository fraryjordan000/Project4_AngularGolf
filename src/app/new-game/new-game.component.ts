import { Component, OnInit } from '@angular/core';
import { ApiFetcherService } from '../api-fetcher.service';
import { promise } from 'protractor';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.sass'],
})
export class NewGameComponent implements OnInit {

  constructor(private fetch: ApiFetcherService) { }

  courses: any;
  course: any;

  ngOnInit() {
    this.getCourses();
    //this.getCourseById(this.courses[0].id);
  }

  async getCourses() {
    let promise = new Promise((resolve, reject) => {
      this.fetch.getCourses((res: any) => resolve(res.courses));
    });

    this.courses = await promise;

    console.log(this.courses);
  }

  async getCourseById(id: number) {
    let promise = new Promise((resolve, reject) => {
      this.fetch.getCourseById(id, (res:any) => resolve(res));
    });

    this.course = await promise;

    console.log(this.course);
  }

}
