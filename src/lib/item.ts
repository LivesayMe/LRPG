import { generateName } from "./constants/itemNames";
import { DamageType, Damage } from "./damage";
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

    baseEnergyShield: number = 0;
    energyShield: number;
    baseEvasion: number = 0;
    evasion: number;
    baseArmor: number = 0;
    armor: number;

    damage: Damage = new Damage({type: DamageType.PHYSICAL, amount: 0});

    baseAttackTime: number;
    attackSpeed: number;

    criticalHitChance: number;

    level: number;

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
        this.evasion = this.baseEvasion;
        this.armor = this.baseArmor;
        this.energyShield = this.baseEnergyShield;

        //Sort affixes by priority
        this.affixes.sort((a, b) => {
            return b.priority - a.priority;
        });

        for (let i = 0; i < this.affixes.length; i++) {
            this.affixes[i].effect(this, this.affixes[i].tier);
        }
    }

    addDamage(amount: number, type: DamageType) {
        if (this.damage.dealt == null) this.damage.dealt = [];
        //If damage type already exists, add the amount to it
        const damage = this.damage.dealt.find((d) => d.type == type);
        if (damage != null) damage.amount += amount;
        else this.damage.dealt.push({ type: type, amount: amount });
    }

    addIncreasedDamage(amount: number, type: DamageType) {
        if (this.damage.dealt == null) this.damage.dealt = [];
        //If damage type already exists, increase the amount
        const damage = this.damage.dealt.find((d) => d.type == type);
        if (damage != null) damage.amount *= amount;
        else this.damage.dealt.push({ type: type, amount: amount });
    }

    copy(): Item {
        const affixCopies = this.affixes.map((a) => a.copy());
        const newItem = new Item({
            name: this.name,
            rarity: this.rarity,
            description: this.description,
            affixes: affixCopies,
            implicit: this.implicit,
            type: this.type,
            energyShield: this.baseEnergyShield,
            evasion: this.baseEvasion,
            armor: this.baseArmor,
            damage: this.damage.copy(),
            criticalHitChance: this.criticalHitChance,
            strengthRequirement: this.strengthRequirement,
            dexterityRequirement: this.dexterityRequirement,
            intelligenceRequirement: this.intelligenceRequirement,
            levelRequirement: this.levelRequirement,
            baseAttackTime: this.baseAttackTime,
            level: this.level
        });
        newItem.applyAffixes();
        return newItem;
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
        damage?: Damage;
        criticalHitChance?: number;
        strengthRequirement?: number;
        dexterityRequirement?: number;
        intelligenceRequirement?: number;
        levelRequirement?: number,
        baseAttackTime?: number,
        level?: number
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

        this.baseEnergyShield = args.energyShield ?? 0;
        this.baseEvasion = args.evasion ?? 0;
        this.baseArmor = args.armor ?? 0;

        this.damage = args.damage ?? new Damage({type: DamageType.PHYSICAL, amount: 0});

        this.criticalHitChance = args.criticalHitChance ?? 0;

        this.strengthRequirement = args.strengthRequirement ?? 0;
        this.dexterityRequirement = args.dexterityRequirement ?? 0;
        this.intelligenceRequirement = args.intelligenceRequirement ?? 0;
        this.levelRequirement = args.levelRequirement ?? 0;

        this.baseAttackTime = args.baseAttackTime ?? 0;
        this.attackSpeed = this.baseAttackTime;

        this.level = args.level ?? 1;
    }
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

    copy(): Affix {
        return new Affix({
            maxTiers: this.maxTiers,
            priority: this.priority,
            effect: this.effect,
            friendlyName: this.friendlyName,
            itemRestriction: this.itemRestriction,
            modWeight: this.modWeight,
        });
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
    Gloves,
    Ring,
    Belt,
    Amulet,
    Axe,
    Bow,
    Claw,
    Dagger,
    Mace,
    Sceptre,
    Stave,
    Sword,
    Wand
}

function isWeapon(type: ItemType): boolean {
    return type >= ItemType.Axe && type <= ItemType.Wand;
}

function isArmor(type: ItemType): boolean {
    return type >= ItemType.BodyArmor && type <= ItemType.Gloves;
}

function isJewellery(type: ItemType): boolean {
    return type >= ItemType.Ring && type <= ItemType.Amulet;
}

export { Item, Affix, Rarity, ItemType, isWeapon, isArmor, isJewellery };