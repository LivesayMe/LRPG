let zoneCount = 0;
class Zone {
    name: string;
    worldPosition: number[] = [0, 0];
    id: number;
    connectedZones: number[] = [];

    constructor(name: string, worldPosition: number[]) {
        this.name = name;
        this.worldPosition = worldPosition;
        this.id = zoneCount++;
    }

    addAdjacentZone(zoneId: number) {
        this.connectedZones.push(zoneId);
    }
}