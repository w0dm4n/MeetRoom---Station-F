export default class Room
{
    constructor(raw)
    {
        this.id = raw.id;   
        this.name = raw.name;
        this.description = raw.description;
        this.capacity = raw.capacity;
        this.equipements = raw.equipements;
        this.createdAt = raw.createdAt;
        this.updatedAt = raw.updatedAt;
    }
}