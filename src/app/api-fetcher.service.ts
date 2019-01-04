import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ApiFetcherService {

  result: any;

  constructor(private http: HttpClient) {}
  private golfUrl = 'https://golf-courses-api.herokuapp.com/courses/';

  getCourses(callback: Function) {
    let parent = this;
    this.http.get(this.golfUrl).subscribe(
      function(res) {
        parent.setResult(res);
        callback(res);
      }
    );
    return this.result;
  }

  getCourseById(id: number, callback: Function) {
    let parent = this;
    this.http.get(this.golfUrl + id).subscribe(
      function(res) {
        parent.setResult(res);
        callback(res);
      }
    );
    return this.result;
  }

  setResult(res: any) {
    this.result = res;
  }
}
