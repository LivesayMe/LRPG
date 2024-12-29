import { generateName } from "./constants/itemNames";
import {type Player} from "./player";

let itemCount = 0;
class Item {
    name: string;
    id: number;
    rarity: Rarity;
    description: string;

    affixes: Array<Affix>;
    implicit: Affix;

    /**
     * The type of the item, which determines its category such as weapon, armor, etc.
     */
    type: ItemType;

    energyShield: number;
    evasion: number;
    armor: number;

    physicalAttack: Roll = {min: 0, max: 0};
    fireAttack: Roll = {min: 0, max: 0};
    coldAttack: Roll = {min: 0, max: 0};
    lightningAttack: Roll = {min: 0, max: 0};
    chaosAttack: Roll = {min: 0, max: 0};

    baseAttackTime: number;
    attackSpeed: number;

    criticalHitChance: number;

    /**
     * Effects to be applied to the player when the item is equipped
     */
    playerEffect: Array<(Player) => void> = [];

    //Requirements
    strengthRequirement: number;
    dexterityRequirement: number;
    intelligenceRequirement: number;

    levelRequirement: number;

    applyAffixes() {
        for (const affix of this.affixes) {
            affix.effect(this, affix.tier);
        }
    }

    constructor(args: {
        name?: string;
        rarity?: Rarity;
        description?: string;
        affixes?: Array<Affix>;
        implicit?: Affix;
        type: ItemType;
        energyShield?: number;
        evasion?: number;
        armor?: number;
        physicalAttack?: Roll;
        fireAttack?: Roll;
        coldAttack?: Roll;
        lightningAttack?: Roll;
        chaosAttack?: Roll;
        criticalHitChance?: number;
        strengthRequirement?: number;
        dexterityRequirement?: number;
        intelligenceRequirement?: number;
        levelRequirement?: number,
        baseAttackTime?: number,
        attackSpeed?: number
    }) {
        this.name = args.name ?? generateName();
        this.id = itemCount++;
        this.rarity = args.rarity ?? Rarity.Normal;
        this.description = args.description ?? "";

        this.affixes = args.affixes ?? [];
        this.implicit = args.implicit ?? new Affix({
            maxTiers: 1,
            priority: 0,
            effect: () => {},
            friendlyName: () => "",
            itemRestriction: [],
            modWeight: 0
        });

        this.implicit.effect(this, 0);

        this.type = args.type;

        this.energyShield = args.energyShield ?? 0;
        this.evasion = args.evasion ?? 0;
        this.armor = args.armor ?? 0;

        this.physicalAttack = args.physicalAttack ?? {min: 0, max: 0};
        this.fireAttack = args.fireAttack ?? {min: 0, max: 0};
        this.coldAttack = args.coldAttack ?? {min: 0, max: 0};
        this.lightningAttack = args.lightningAttack ?? {min: 0, max: 0};
        this.chaosAttack = args.chaosAttack ?? {min: 0, max: 0};

        this.criticalHitChance = args.criticalHitChance ?? 0;

        this.strengthRequirement = args.strengthRequirement ?? 0;
        this.dexterityRequirement = args.dexterityRequirement ?? 0;
        this.intelligenceRequirement = args.intelligenceRequirement ?? 0;
        this.levelRequirement = args.levelRequirement ?? 0;

        this.baseAttackTime = args.baseAttackTime ?? 0;
        this.attackSpeed = args.attackSpeed ?? 1;
    }
}

class Roll {
    min: number;
    max: number;
}

let affixCount = 0;
class Affix {
    maxTiers: number;
    priority: number;
    effect: (item: Item, tier: number) => void;
    friendlyName: (tier: number) => string;
    itemRestriction: Array<ItemType>;
    modWeight: number;
    id: number;
    tier: number;

    constructor(args: { maxTiers: number; 
                        priority: number; 
                        effect: (item: Item, tier: number) => void;
                        friendlyName: (tier: number) => string;
                        itemRestriction: Array<ItemType>;
                        modWeight: number; }) {
        this.maxTiers = args.maxTiers;
        this.priority = args.priority;
        this.effect = args.effect;
        this.friendlyName = args.friendlyName;
        this.itemRestriction = args.itemRestriction;
        this.modWeight = args.modWeight;
        this.id = affixCount++;
    }
}

enum Rarity {
    Normal,
    Magic,
    Rare,
    Unique
}

enum ItemType {
    BodyArmor,
    Helmet,
    Boots,
    Belt,
    Gloves,
    Ring,
    Amulet,
    Weapon
}

export { Item, Affix, Rarity, ItemType, Roll };