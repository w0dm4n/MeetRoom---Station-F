import Room from "../models/room.js"
import Reservation from "../models/reservation.js"

const fs = require('fs');
const parser = require('parse-json');

export default class DatabaseManager
{
    static buildRooms(callback)
    {
        let rooms = [];
        fs.readFile("./rooms.json", "utf8", (err, content) => {
            if (err) {
                callback(null);
                return;
            }
            content = parser(content);
            if (content.rooms) {
                for (var room of content.rooms) {
                    rooms.push(new Room(room));
                }
            }
            callback(rooms);
        });
    }

    static checkReservation(room, date, callback)
    {
        DatabaseManager.buildReservations((reservations) => {
            for (var reservation of reservations)
            {
                if (reservation.room.id == room.id && reservation.date == date) {
                    callback(false);
                    return;
                }
            }
            callback(true);
        });
    }

    static buildReservations(callback)
    {
        let reservations = [];
        let glob = require("glob");
        let index = 0;
        glob("./reservations/*.json", [], function (er, files) {
            if (files.length == 0) {
                callback([]);
            }
            for (var file of files)
            {
                fs.readFile(file, "utf8", (err, content) => {
                    index++;
                    if (!err) {
                        content = parser(content);
                        if (content.room && content.date && content.unique_id) {
                            reservations.push(new Reservation(content));
                        }
                    }
                    if (index == files.length) {
                        callback(reservations);
                        return;
                    }
                });
            }
          })
    }

    static getRoomById(id, rooms)
    {
        for (var room of rooms) {
            if (room.id == id) {
                return room;
            }
        }
        return null;
    }

    static reserveRoom(room, date) {
        let reservationId = require("randomstring").generate(64);
        let datas = {room: room, date: date, unique_id: reservationId};
        
        var stream = fs.createWriteStream("./reservations/" + reservationId + ".json");
        stream.once('open', function(fd) {
            if (fd) {
                stream.write(JSON.stringify(datas));
                stream.end();
                console.log("New reservation (" + reservationId + ") for room " + room.name);
            }
        });
    }
}