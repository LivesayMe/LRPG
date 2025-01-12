import { Passive } from "./passive";

export class PassiveNode {
    passive: Passive;
    adjacentNodes: number[];
    position: number[];
    isTaken: boolean = false;

    constructor(passive: Passive, adjacentNodes: number[], position: number[]) {
        this.passive = passive;
        this.adjacentNodes = adjacentNodes;
        this.position = position;
    }
}