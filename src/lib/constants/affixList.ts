import { ArmorType, ItemType, type Item} from "../item";
import { Affix } from "../affix";
import { type Player } from "../player";
import { DamageType, Damage } from "../damage";

const armors = [ItemType.BodyArmor, ItemType.Helmet, ItemType.Boots, ItemType.Gloves];
const jewellery = [ItemType.Ring, ItemType.Amulet, ItemType.Belt];
const weapons = [ItemType.Axe, ItemType.Bow, ItemType.Claw, ItemType.Dagger, ItemType.Mace, ItemType.Sceptre, ItemType.Stave, ItemType.Sword, ItemType.Wand];

const everything = [...armors, ...jewellery, ...weapons];

const statAffixes = [
    new Affix({ //Flat evasion
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.evasion += 10 + tier * 20;
        },
        friendlyName: (tier: number) => `+${10 + tier * 20} Evasion Rating`,
        itemRestriction: armors,
        modWeight: 1000,
        armorRestriction: [ArmorType.DEXTERITY, ArmorType.DEXTERITY_AND_INTELLIGENCE, ArmorType.DEXTERITY_AND_STRENGTH]
    }),
    new Affix({ //Percent evasion
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.evasion *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Evasion Rating`,
        itemRestriction: armors,
        modWeight: 1000,
        armorRestriction: [ArmorType.DEXTERITY, ArmorType.DEXTERITY_AND_INTELLIGENCE, ArmorType.DEXTERITY_AND_STRENGTH]
    }),
    new Affix({ //Flat energy shield
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.energyShield += 10 + tier * 20;
        },
        friendlyName: (tier: number) => `+${10 + tier * 20} Energy Shield`,
        itemRestriction: armors,
        modWeight: 1000,
        armorRestriction: [ArmorType.INTELLIGENCE, ArmorType.DEXTERITY_AND_INTELLIGENCE, ArmorType.STRENGTH_AND_INTELLIGENCE]
    }),
    new Affix({ //Percent energy shield
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.energyShield *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Local Energy Shield`,
        itemRestriction: armors,
        modWeight: 1000,
        armorRestriction: [ArmorType.INTELLIGENCE, ArmorType.DEXTERITY_AND_INTELLIGENCE, ArmorType.STRENGTH_AND_INTELLIGENCE]
    }),
    new Affix({ //Global energy shield
        maxTiers: 4,
        priority: 3, //Happens after percent modifiers
        effect: (item: Item, tier: number) => {
            item.playerEffect.push({effect: (player: Player) => {
                player.maxEnergyShield *= 1.05 + (tier * 0.10);
            }, priority: 0})
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Global Energy Shield`,
        itemRestriction: jewellery,
        modWeight: 1000
    }),
    new Affix({ //Flat armor
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.armor += 10 + tier * 20;
        },
        friendlyName: (tier: number) => `+${10 + tier * 20} Armor`,
        itemRestriction: armors,
        modWeight: 1000,
        armorRestriction: [ArmorType.STRENGTH, ArmorType.DEXTERITY_AND_STRENGTH, ArmorType.STRENGTH_AND_INTELLIGENCE]
    }),
    new Affix({ //Percent armor
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.armor *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Armor`,
        itemRestriction: armors,
        modWeight: 1000,
        armorRestriction: [ArmorType.STRENGTH, ArmorType.DEXTERITY_AND_STRENGTH, ArmorType.STRENGTH_AND_INTELLIGENCE]
    })
]

const weaponAffixes = [
    new Affix({ //Flat attack
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.addDamage(5 + tier * 5, DamageType.PHYSICAL);
        },
        friendlyName: (tier: number) => `+${5 + tier * 5} Physical Attack`,
        itemRestriction: weapons,
        modWeight: 1000
    }),
    new Affix({ //Percent attack
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.addIncreasedDamage(1.05 + tier * 0.1, DamageType.PHYSICAL);
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Physical Attack`,
        itemRestriction: weapons,
        modWeight: 1000
    }),
    new Affix({ //Flat critical hit chance
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.criticalHitChance += .01 + tier * .005;
        },
        friendlyName: (tier: number) => `+${1 + tier * .5}% Critical Hit Chance`,
        itemRestriction: weapons,
        modWeight: 1000
    }),
    new Affix({ //Percent critical hit chance
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.criticalHitChance *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Critical Hit Chance`,
        itemRestriction: weapons,
        modWeight: 1000
    }),
    new Affix({ //Increased attack speed
        maxTiers: 7,
        priority: 3, //Happens after percent modifiers
        effect: (item: Item, tier: number) => {
            item.attackSpeed *= .95 - (tier * 0.05);
        },
        friendlyName: (tier: number) => `+${(5 + tier * 5)}% Attack Speed`,
        itemRestriction: weapons,
        modWeight: 1000
    }),

    //Generic affixes
    // RESISTANCES
    ...[[DamageType.FIRE, "Fire"], [DamageType.COLD, "Cold"], [DamageType.LIGHTNING, "Lightning"], [DamageType.CHAOS, "Chaos"]].map(([type, name]) => new Affix({
        maxTiers: 5,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.playerEffect.push({effect: (player: Player) => {player.resistance[type] += 5 + tier * 5}, priority: 0})
        },
        friendlyName: (tier: number) => `+${5 + tier * 5}% ${name} Resistance`,
        itemRestriction: everything,
        modWeight: 1000
    }))

]

function maxTier(itemLevel: number, affix: Affix) {
    const levelsPerTier = 100 / affix.maxTiers;
    return Math.floor(itemLevel / levelsPerTier);
}

const affixes = [...statAffixes, ...weaponAffixes];
export { affixes, maxTier };