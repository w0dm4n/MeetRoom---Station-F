export default class Route
{
    constructor(base_route, params, handler) {
        this.base_route = base_route;
        this.params = params;
        this.handler = handler;

        this.fullRoute = this.getFullRoute();
    }

    getFullRoute()
    {
        let route = this.base_route;
        for (var param of this.params)
            route += "/:" + param;
        return route;
    }
}