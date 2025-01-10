import type { Item } from "./item";
import {v4 as uuidv4} from 'uuid';
import { baseClasses, BaseClass } from "./constants/classes";
import { generateItem } from "./itemGenerator";
import { Rarity, ItemType, isWeapon } from "./item";
import { Entity } from "./entity";
import { meleeSkills } from "./constants/skillList";
import { Damage, DamageType } from "./damage";

class Player extends Entity {

    class: BaseClass;
    experience: number = 0;


    //Stats
    dexterity: number = 5;
    strength: number = 5;
    intelligence: number = 5;

    maxMana: number = 50;
    mana: number = 50;

    movementSpeed: number = 1.0;

    esFromIntelligence = 1;
    evasionFromDexterity = 1;
    lifeFromStrength = 1;

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
        this.maxMana = 50;
        this.mana = 50;
        this.movementSpeed = 1.0;

        this.esFromIntelligence = 1;
        this.evasionFromDexterity = 1;
        this.lifeFromStrength = 1;

        super.resetStats();
    }

    applyItems() {
        this.resetStats();

        this.evasion = this.getEvasion();
        this.armor = this.getArmor();        
        this.maxEnergyShield = this.getMaxEnergyShield();
        

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

        this.energyShield = this.maxEnergyShield;
        this.energyShieldRegen = this.maxEnergyShield / 10;
        this.health = this.maxHealth;
    }

    getEvasion() {
        return (this.helmet?.evasion ?? 0) + (this.body_armor?.evasion ?? 0) + (this.boots?.evasion ?? 0) +
               (this.ring1?.evasion ?? 0) + (this.ring2?.evasion ?? 0) + (this.amulet?.evasion ?? 0) + 
               (this.belt?.evasion ?? 0) + this.evasionFromDexterity * this.dexterity;
    }

    getArmor() {
        return (this.helmet?.armor ?? 0) + (this.body_armor?.armor ?? 0) + (this.boots?.armor ?? 0) +
               (this.ring1?.armor ?? 0) + (this.ring2?.armor ?? 0) + (this.amulet?.armor ?? 0) + 
               (this.belt?.armor ?? 0);
    }

    getMaxEnergyShield() {
        return (this.helmet?.energyShield ?? 0) + (this.body_armor?.energyShield ?? 0) + (this.boots?.energyShield ?? 0) +
               (this.ring1?.energyShield ?? 0) + (this.ring2?.energyShield ?? 0) + (this.amulet?.energyShield ?? 0) + 
               (this.belt?.energyShield ?? 0) + this.intelligence * this.esFromIntelligence;
    }

    getMaxLife() {
        return this.strength * this.lifeFromStrength + this.maxHealth;
    }

    /**
     * Returns the time in ms between attacks
     */
    getAttackSpeed() {
        if (!this.weapon1)
            return 1000 * this.actionSpeed;

        if (this.weapon2 != null && isWeapon(this.weapon2.type)) { //Is our second weapon not a shield or quiver
            // Dual wielding
            return Math.min(this.weapon1.attackSpeed, this.weapon2.attackSpeed) * 1.35  * this.actionSpeed;
        }
        return this.weapon1.attackSpeed * this.actionSpeed;
    }

    getAttackDamage(): Damage {
        if (!this.weapon1)
            return new Damage({ type: DamageType.PHYSICAL, amount: 5 }); // Punch!

        const damage = this.weapon1.damage.copy();

        //Check for critical strike
        if (Math.random() < this.weapon1.criticalHitChance * this.incCriticalHitChance) {
            //Multiple each damage by this.criticalHitMultiplier
            damage.dealt.forEach((d) => d.amount *= this.criticalHitMultiplier);
        }

        return damage;
    }
}


const randomPlayerNames = [
    "Naruto", "Sasuke", "Kakashi", "Sakura", "Itachi", "Kisame", "Sakura", "Kakashi", "Kakashi", "Sasuke",
]

function generateRandomPlayer(): Player {
    let player = new Player({});
    player.name = randomPlayerNames[Math.floor(Math.random() * randomPlayerNames.length)];
    player.class = baseClasses[Math.floor(Math.random() * baseClasses.length)];

    player.level = 1;
    player.experience = 0;

    player.helmet = generateItem(.5, 1, ItemType.Helmet);
    player.body_armor = generateItem(.5, 1, ItemType.BodyArmor);
    player.boots = generateItem(.5, 1, ItemType.Boots);
    player.ring1 = generateItem(.5, 1, ItemType.Ring);
    player.ring2 = generateItem(.5, 1, ItemType.Ring);
    player.amulet = generateItem(.5, 1, ItemType.Amulet);
    player.belt = generateItem(.5, 1, ItemType.Belt);
    player.weapon1 = generateItem(.5, 1, ItemType.Sword);
    player.gloves = generateItem(.5, 1, ItemType.Gloves);

    player.applyItems();

    player.mainSkill = meleeSkills[Math.floor(Math.random() * meleeSkills.length)];

    return player;
}

export { Player, generateRandomPlayer };