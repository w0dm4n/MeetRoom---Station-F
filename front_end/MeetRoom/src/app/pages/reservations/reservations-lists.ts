import { Component } from '@angular/core';
import { MeetRoomProvider } from "../../providers/meetRoom"

@Component({
  selector: 'page-reservations-lists',
  templateUrl: "views/pages/reservations-lists.html",
})
export class ReservationsListComponent  {
    reservations: any;
    constructor(private meetRoomProvider: MeetRoomProvider)
    {
      this.meetRoomProvider.getReservations().then((content) => {
          if (content["error"] == false) {
              let datas = content["data"];
              for (var data of datas)
                  data.date = new Date(data.date);
                this.reservations = datas;
            }
      });
    }
}
