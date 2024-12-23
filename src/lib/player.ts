import type { Item } from "./item";
class Player {
    name: string;

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

export { Player };