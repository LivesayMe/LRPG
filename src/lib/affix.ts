import { Item, ItemType, ArmorType } from "./item";

let affixCount = 0;
export class Affix {
    maxTiers: number;
    priority: number;
    effect: (item: Item, tier: number) => void;
    friendlyName: (tier: number) => string;
    itemRestriction: Array<ItemType>;
    armorRestriction: Array<ArmorType>;
    modWeight: number;
    id: number;
    tier: number;


    constructor(args: { maxTiers: number; 
                        priority: number; 
                        effect: (item: Item, tier: number) => void;
                        friendlyName: (tier: number) => string;
                        itemRestriction: Array<ItemType>;
                        modWeight: number; 
                        armorRestriction?: Array<ArmorType>;
                    }) {
        this.maxTiers = args.maxTiers;
        this.priority = args.priority;
        this.effect = args.effect;
        this.friendlyName = args.friendlyName;
        this.itemRestriction = args.itemRestriction;
        this.modWeight = args.modWeight;
        this.id = affixCount++;
        
        this.armorRestriction = args.armorRestriction ?? [];
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