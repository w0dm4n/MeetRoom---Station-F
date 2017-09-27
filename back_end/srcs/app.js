import Server from "./network/server.js"
var server = new Server(8080);

try {
    server.initServer();
} catch (error)
{
    console.log("An error occured while trying to init the server: " + error);
}