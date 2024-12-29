import type { Item } from "./item";
import {v4 as uuidv4} from 'uuid';
import { baseClasses, BaseClass } from "./constants/classes";
import { generateItem } from "./itemGenerator";
import { Rarity, ItemType } from "./item";

class Player {
    id: string = uuidv4();

    name: string;
    class: BaseClass;

    level: number = 1;
    experience: number = 0;

    //Stats
    dexterity: number = 5;
    strength: number = 5;
    intelligence: number = 5;

    maxHealth: number = 100;
    health: number = 100;

    maxMana: number = 50;
    mana: number = 50;

    maxEnergyShield: number = 0;
    energyShield: number = 0;

    movementSpeed: number = 1.0;

    coldResistance: number = 0;
    fireResistance: number = 0;
    lightningResistance: number = 0;
    chaosResistance: number = 0;

    //Gear
    helmet: Item;
    body_armor: Item;
    boots: Item;
    gloves: Item;
    ring1: Item;
    ring2: Item;
    amulet: Item;
    belt: Item;
    weapon1: Item;
    weapon2: Item;

    resetStats() {
        //Reset stats to base values
        this.dexterity = 5;
        this.strength = 5;
        this.intelligence = 5;
        this.maxHealth = 100;
        this.health = 100;
        this.maxMana = 50;
        this.mana = 50;
        this.maxEnergyShield = 0;
        this.energyShield = 0;
        this.movementSpeed = 1.0;
        this.coldResistance = 0;
        this.fireResistance = 0;
        this.lightningResistance = 0;
        this.chaosResistance = 0;
    }

    applyItems() {
        this.resetStats();

        if (this.helmet != null && this.helmet.playerEffect != null)
            this.helmet.playerEffect.forEach(effect => effect(this));

        if (this.body_armor != null && this.body_armor.playerEffect != null)
            this.body_armor.playerEffect.forEach(effect => effect(this));

        if (this.boots != null && this.boots.playerEffect != null)
            this.boots.playerEffect.forEach(effect => effect(this));
        
        if (this.gloves != null && this.gloves.playerEffect != null)
            this.gloves.playerEffect.forEach(effect => effect(this));
        
        if (this.ring1 != null && this.ring1.playerEffect != null)
            this.ring1.playerEffect.forEach(effect => effect(this));

        if (this.ring2 != null && this.ring2.playerEffect != null)    
            this.ring2.playerEffect.forEach(effect => effect(this));

        if (this.amulet != null && this.amulet.playerEffect != null)
            this.amulet.playerEffect.forEach(effect => effect(this));

        if (this.belt != null && this.belt.playerEffect != null)
            this.belt.playerEffect.forEach(effect => effect(this));

        if (this.weapon1 != null && this.weapon1.playerEffect != null)
            this.weapon1.playerEffect.forEach(effect => effect(this));

        if (this.weapon2 != null && this.weapon2.playerEffect != null)
            this.weapon2.playerEffect.forEach(effect => effect(this));
    }

    getEvasion() {
        return (this.helmet?.evasion ?? 0) + (this.body_armor?.evasion ?? 0) + (this.boots?.evasion ?? 0) +
               (this.ring1?.evasion ?? 0) + (this.ring2?.evasion ?? 0) + (this.amulet?.evasion ?? 0) + 
               (this.belt?.evasion ?? 0);
    }

    getArmor() {
        return (this.helmet?.armor ?? 0) + (this.body_armor?.armor ?? 0) + (this.boots?.armor ?? 0) +
               (this.ring1?.armor ?? 0) + (this.ring2?.armor ?? 0) + (this.amulet?.armor ?? 0) + 
               (this.belt?.armor ?? 0);
    }

    getMaxEnergyShield() {
        return (this.helmet?.energyShield ?? 0) + (this.body_armor?.energyShield ?? 0) + (this.boots?.energyShield ?? 0) +
               (this.ring1?.energyShield ?? 0) + (this.ring2?.energyShield ?? 0) + (this.amulet?.energyShield ?? 0) + 
               (this.belt?.energyShield ?? 0);
    }
}


const randomPlayerNames = [
    "Naruto", "Sasuke", "Kakashi", "Sakura", "Itachi", "Kisame", "Sakura", "Kakashi", "Kakashi", "Sasuke",
]

function generateRandomPlayer(): Player {
    let player = new Player();
    player.name = randomPlayerNames[Math.floor(Math.random() * randomPlayerNames.length)];
    player.class = baseClasses[Math.floor(Math.random() * baseClasses.length)];

    player.level = 1;
    player.experience = 0;

    player.helmet = generateItem(Rarity.Normal, 1, ItemType.Helmet);
    player.body_armor = generateItem(Rarity.Normal, 1, ItemType.BodyArmor);
    player.boots = generateItem(Rarity.Normal, 1, ItemType.Boots);
    player.ring1 = generateItem(Rarity.Normal, 1, ItemType.Ring);
    player.ring2 = generateItem(Rarity.Normal, 1, ItemType.Ring);
    player.amulet = generateItem(Rarity.Normal, 1, ItemType.Amulet);
    player.belt = generateItem(Rarity.Normal, 1, ItemType.Belt);
    player.weapon1 = generateItem(Rarity.Normal, 1, ItemType.Weapon);

    player.applyItems();

    return player;
}

export { Player, generateRandomPlayer };