import RoomManager from "../managers/room.js"
import ReservationManager from "../managers/reservation.js"
import Route from "./route.js"
export default class Processor
{
    static logRequest(route, request)
    {
        console.log("New request from " + request.headers.host + " on route " + route.fullRoute);
    }

    static routeHandler(router)
    {
        let routes = [
            new Route("/room/all", [], RoomManager.getAllRooms),
            new Route("/room/reserve", ["id", "date"], ReservationManager.reserveRoom),
            new Route("/reservation/all", [], ReservationManager.getAllReservations),
        ];
        for (var route of routes)
            route.handler(route, router);
    }
}