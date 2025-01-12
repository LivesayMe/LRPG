import type { Item } from "./item";
import {v4 as uuidv4} from 'uuid';
import { baseClasses, BaseClass } from "./constants/classes";
import { generateItem } from "./itemGenerator";
import { Rarity, ItemType, isWeapon } from "./item";
import { Entity } from "./entity";
import { meleeSkills } from "./constants/skillList";
import { Damage, DamageType } from "./damage";
import { createPassiveTree, PassiveTree } from "./passiveTree";

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
    helmet?: Item | null;
    body_armor?: Item | null;
    boots?: Item | null;
    gloves?: Item | null;
    ring1?: Item | null;
    ring2?: Item | null;
    amulet?: Item | null;
    belt?: Item | null;
    weapon1?: Item | null;
    weapon2?: Item | null;

    playerEffects: Array<{effect: (player: Player) => void, id: number, priority: number}> = [];

    passiveTree: PassiveTree;

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
        

        //Sorted player effects
        this.playerEffects.sort((a, b) => a.priority - b.priority);
        for (let i = 0; i < this.playerEffects.length; i++) {
            this.playerEffects[i].effect(this);
        }

        this.energyShield = this.maxEnergyShield;
        this.energyShieldRegen = this.maxEnergyShield / 10;
        this.health = this.maxHealth;
    }

    getEvasion() {
        return (this.helmet?.evasion ?? 0) + (this.body_armor?.evasion ?? 0) + (this.boots?.evasion ?? 0) +
               (this.ring1?.evasion ?? 0) + (this.ring2?.evasion ?? 0) + (this.amulet?.evasion ?? 0) + 
               (this.belt?.evasion ?? 0) + (this.gloves?.evasion ?? 0) + this.evasionFromDexterity * this.dexterity;
    }

    getArmor() {
        return (this.helmet?.armor ?? 0) + (this.body_armor?.armor ?? 0) + (this.boots?.armor ?? 0) +
               (this.ring1?.armor ?? 0) + (this.ring2?.armor ?? 0) + (this.amulet?.armor ?? 0) + 
               (this.belt?.armor ?? 0) + (this.gloves?.armor ?? 0);
    }

    getMaxEnergyShield() {
        return (this.helmet?.energyShield ?? 0) + (this.body_armor?.energyShield ?? 0) + (this.boots?.energyShield ?? 0) +
               (this.ring1?.energyShield ?? 0) + (this.ring2?.energyShield ?? 0) + (this.amulet?.energyShield ?? 0) + 
               (this.belt?.energyShield ?? 0) + (this.gloves?.energyShield ?? 0) + this.intelligence * this.esFromIntelligence;
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

    addItem(item: Item, disambiguator?: number) {
        switch (item.type) {
            case ItemType.BodyArmor:
                this.body_armor = item;
                break;
            case ItemType.Helmet:
                this.helmet = item;
                break;
            case ItemType.Boots:
                this.boots = item;
                break;
            case ItemType.Gloves:
                this.gloves = item;
                break;
            case ItemType.Ring:
                if (disambiguator == 1) {
                    this.ring1 = item;
                } else {
                    this.ring2 = item;
                }
                break;
            case ItemType.Amulet:
                this.amulet = item;
                break;
            case ItemType.Belt:
                this.belt = item;
                break;
            default:
                if (isWeapon(item.type)) {
                    if (disambiguator == 1) {
                        this.weapon1 = item;
                    } else {
                        this.weapon2 = item;
                    }
                }
                break;
        }
        if (item.playerEffect != null) {
            const newEffects = item.playerEffect.map(e => ({effect: e.effect, id: item.id, priority: e.priority}));
            this.playerEffects.push(...newEffects);
        }

        this.applyItems();
    }

    removeItem(item: Item) {
        switch (item.type) {
            case ItemType.BodyArmor:
                this.body_armor = null;
                break;
            case ItemType.Helmet:
                this.helmet = null;
                break;
            case ItemType.Boots:
                this.boots = null;
                break;
            case ItemType.Gloves:
                this.gloves = null;
                break;
            case ItemType.Ring:
                if (item.id == this.ring1?.id) {
                    console.log(this.ring1.id);
                    this.ring1 = null;
                } else {
                    this.ring2 = null;
                }
                break;
            case ItemType.Amulet:
                this.amulet = null;
                break;
            case ItemType.Belt:
                this.belt = null;
                break;
            default:
                if (isWeapon(item.type)) {
                    if (item.id == this.weapon1?.id) {
                        this.weapon1 = null;
                    } else {
                        this.weapon2 = null;
                    }
                }
                break;
        }

        this.playerEffects = this.playerEffects.filter(e => e.id != item.id);

        this.applyItems();
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
    
    player.addItem(generateItem(.5, 1, ItemType.Helmet));
    player.addItem(generateItem(.5, 1, ItemType.BodyArmor));
    player.addItem(generateItem(.5, 1, ItemType.Boots));
    player.addItem(generateItem(.5, 1, ItemType.Gloves));
    player.addItem(generateItem(.5, 1, ItemType.Ring), 1);
    player.addItem(generateItem(.5, 1, ItemType.Ring), 2);
    player.addItem(generateItem(.5, 1, ItemType.Amulet));
    player.addItem(generateItem(.5, 1, ItemType.Belt));

    player.addItem(generateItem(.5, 1, ItemType.Sword), 1);

    player.mainSkill = meleeSkills[Math.floor(Math.random() * meleeSkills.length)];

    player.passiveTree = createPassiveTree();

    return player;
}

export { Player, generateRandomPlayer };