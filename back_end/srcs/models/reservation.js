export default class Reservation
{
    constructor(raw)
    {
        this.room = raw.room;   
        this.date = raw.date;
        this.unique_id = raw.unique_id;
    }
}