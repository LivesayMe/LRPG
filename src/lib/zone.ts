let zoneCount = 0;
class Zone {
    name: string;
    worldPosition: number[] = [0, 0];
    id: number;
    connectedZones: number[] = [];
    expolration_status: ExplorationStatus = ExplorationStatus.UNEXPLORED;

    hover: boolean = false;

    constructor(name: string, worldPosition: number[]) {
        this.name = name;
        this.worldPosition = worldPosition;
        this.id = zoneCount++;
    }

    addAdjacentZone(zoneId: number) {
        if (this.connectedZones.includes(zoneId)) return;
        this.connectedZones.push(zoneId);
    }
}

enum ExplorationStatus {
    UNEXPLORED,
    PARTIALLY_EXPLORED,
    FULLY_EXPLORED
}

export { Zone, ExplorationStatus };