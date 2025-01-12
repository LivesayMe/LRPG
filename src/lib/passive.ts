import { type Player } from "./player";

let passiveCount = 0;
export class Passive {
    name: string;
    description: string;
    id: number;
    priority: number;
    effect: (player: Player) => void;
    constructor(name: string, description: string, effect: (player: Player) => void, priority: number) {
        this.name = name;
        this.description = description;
        this.id = -1 * passiveCount++;
        this.effect = effect;
        this.priority = priority;
    }
}