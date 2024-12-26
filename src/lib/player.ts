import type { Item } from "./item";
import {v4 as uuidv4} from 'uuid';
import { baseClasses, BaseClass } from "./constants/classes";
import { generateItem } from "./itemGenerator";
class Player {
    id: string = uuidv4();

    name: string;
    class: BaseClass;

    level: number;
    experience: number;

    //Stats
    dexterity: number;
    strength: number;
    intelligence: number;

    maxHealth: number;
    health: number;

    maxMana: number;
    mana: number;

    maxEnergyShield: number;
    energyShield: number;

    movementSpeed: number;

    //Gear
    helmet: Item;
    body_armor: Item;
    boots: Item;
    ring1: Item;
    ring2: Item;
    amulet: Item;
    belt: Item;
    weapon1: Item;
    weapon2: Item;

}

function generateRandomPlayer(): Player {
    let player = new Player();
    player.name = "Player";
    player.class = baseClasses[Math.floor(Math.random() * baseClasses.length)];

    player.level = 1;
    player.experience = 0;

    return player;
}

export { Player, generateRandomPlayer };