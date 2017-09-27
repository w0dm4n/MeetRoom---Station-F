import Processor from "../class/processor.js"
import Room from "../models/room.js"
import DatabaseManager from "../database/databaseManager"

const fs = require('fs');
const parser = require('parse-json');

export default class ReservationManager
{
    static getAllReservations(route, router)
    {
        router.get(route.fullRoute, (request, response) => {
            Processor.logRequest(route, request);
            DatabaseManager.buildReservations((reservations) => {
                if (reservations) {
                    response.send({error: false, data: reservations});
                } else { response.send({error: true, data: "Cant get reservations !"}); }
            });
        });
    }

    static reserveRoom(route, router)
    {
        router.get(route.fullRoute, (request, response) => {
            Processor.logRequest(route, request);
            let id = request.params.id;
            let date = request.params.date;
            if (id && date) {
                DatabaseManager.buildRooms((rooms) => {
                    let room = DatabaseManager.getRoomById(id, rooms);
                    if (room) {
                        DatabaseManager.checkReservation(room, date, (result) => {
                            if (result) {
                                DatabaseManager.reserveRoom(room, date);
                                response.json({error: false, data:"Room reserved !"});
                            } else {
                                response.json({error: true, data:"Room already reserved at this date !"});
                                console.log("Reservation for room " + room.name + " refused cause there is already a reservation at the same date !");
                            }
                        });
                    }
                });
            }
        });
    }
}