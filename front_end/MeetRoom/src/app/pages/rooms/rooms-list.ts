import { Component } from '@angular/core';
import { MeetRoomProvider } from "../../providers/meetRoom"

@Component({
  selector: 'page-rooms-list',
  templateUrl: "views/pages/rooms-list.html",
})
export class RoomsListComponent  {
    rooms: any;
    reservationDate: any;
    successMessage: any;
    errorMessage: any;

    searchRooms: any;
    searchType: any;
    searchContent: any;
    constructor(private meetRoomProvider: MeetRoomProvider)
    {
      this.searchType = "Search by";
      this.searchRooms = [];

        this.meetRoomProvider.getRooms().then((result) => {
          if (result && !result["error"]) {
            this.rooms = result["data"]["rooms"];
          }
        });
    }

    onSearchChange(event: any)
    {
      this.searchRooms = [];
      let toFind = event.toLowerCase();
      if (toFind.length < 2)
        return;
      for (var room of this.rooms)
      {
        if (this.searchType == "Name" && room.name.toLowerCase().indexOf(toFind) > -1) {
          this.searchRooms.push(room);
        } else if (this.searchType == "Capacity" && parseInt(room.capacity) >= parseInt(toFind)) {
          this.searchRooms.push(room);
        } else if (this.searchType == "Equipements")
        {
          for (var equipement of room.equipements)
          {
            let name = equipement.name.toLowerCase();
            if (name.indexOf(toFind) > -1) {
              this.searchRooms.push(room);
            }
          }
        }
      }
    }

    reserveRoom(roomId: any)
    {
      if (this.reservationDate && roomId > 0) {
        let date = new Date(this.reservationDate);
        if (date.getDay() && date.getMonth()) {
          this.meetRoomProvider.reserveRoom(roomId, this.reservationDate).then((result) =>
          {
            if (!result["error"]) {
              this.successMessage = result["data"];
            } else { 
              this.errorMessage = result["data"];
            }
          });
        } else { 
          this.errorMessage = "Invalid date format ! Please fill the entire form";
        }
      } else { 
        this.errorMessage = "Invalid data on form, please verify the informations set";
      }
    }

    clearSuccessMessage()
    {
      this.successMessage = null;
    }

    clearErrorMessage()
    {
      this.errorMessage = null;
    }
}
