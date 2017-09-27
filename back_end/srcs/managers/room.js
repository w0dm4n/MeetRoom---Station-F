import Processor from "../class/processor.js"
import Room from "../models/room.js"
import DatabaseManager from "../database/databaseManager"

const fs = require('fs');
const parser = require('parse-json');

export default class RoomManager
{
    static getAllRooms(route, router)
    {
        router.get(route.fullRoute, (request, response) => {
            Processor.logRequest(route, request);
                fs.readFile("./rooms.json", "utf8", (err, content) => {
                    if (err) {
                     response.json({error: true, data:"The server cant reach the rooms data !"});
                    } else {
                        console.log("All rooms sent to " + request.headers.host);
                        response.json({error: false, data: parser(content)});
                    }
                  });
        });
    }
}