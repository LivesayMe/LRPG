let zoneCount = 0;
class Zone {
    name: string;
    worldPosition: number[] = [0, 0];
    id: number;
    connectedZones: number[] = [];
    exploration_status: ExplorationStatus = ExplorationStatus.UNEXPLORED;
    level: number = 1;

    hover: boolean = false;
    isLastZone: boolean = false;

    constructor(name: string, worldPosition: number[], level: number) {
        this.name = name;
        this.worldPosition = worldPosition;
        this.level = level
        this.id = zoneCount++;
    }

    addAdjacentZone(zoneId: number) {
        if (this.connectedZones.includes(zoneId)) return;
        this.connectedZones.push(zoneId);
    }
}

enum ExplorationStatus {
    UNDISCOVERED,
    UNEXPLORED,
    PARTIALLY_EXPLORED,
    FULLY_EXPLORED
}

export { Zone, ExplorationStatus };