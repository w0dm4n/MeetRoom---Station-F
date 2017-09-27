import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MeetRoomProvider {
  public host = "http://localhost:8080"; // back-end server host

  constructor(public http: Http)
  {
   
  }

  reserveRoom(roomId:any, date:any)
  {
    return new Promise((resolve, reject) => {
    let datas = roomId + "/" + encodeURI(date);
    this.http.get(this.host + "/room/reserve/" + datas).subscribe((data =>
      {
        if (data && data["ok"] == true) {
          resolve(JSON.parse(data["_body"]));
        } else { reject(null); }
      }));
    });
  }
  
  getRooms()
  {
    return new Promise((resolve, reject) => {
      this.http.get(this.host + "/room/all").subscribe((data =>
      {
        if (data && data["ok"] == true) {
          resolve(JSON.parse(data["_body"]));
        } else { reject(null); }
      }));
    });
  }

  getReservations()
  {
    return new Promise((resolve, reject) => {
      this.http.get(this.host + "/reservation/all").subscribe((data =>
      {
        if (data && data["ok"] == true) {
          resolve(JSON.parse(data["_body"]));
        } else { reject(null); }
      }));
    });
  }
}