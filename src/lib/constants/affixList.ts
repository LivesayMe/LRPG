import { Affix, ItemType, type Item} from "../item"
import { type Player } from "../player";

const armors = [ItemType.BodyArmor, ItemType.Helmet, ItemType.Boots, ItemType.Gloves];
const jewellery = [ItemType.Ring, ItemType.Amulet, ItemType.Belt];

const statAffixes = [
    new Affix({ //Flat evasion
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.evasion += 10 + tier * 20;
        },
        friendlyName: (tier: number) => `+${10 + tier * 20} Evasion Rating`,
        itemRestriction: armors,
        modWeight: 1000
    }),
    new Affix({ //Percent evasion
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.evasion *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Evasion Rating`,
        itemRestriction: armors,
        modWeight: 1000
    }),
    new Affix({ //Flat energy shield
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.energyShield += 10 + tier * 20;
        },
        friendlyName: (tier: number) => `+${10 + tier * 20} Energy Shield`,
        itemRestriction: armors,
        modWeight: 1000
    }),
    new Affix({ //Percent energy shield
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.energyShield *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Local Energy Shield`,
        itemRestriction: armors,
        modWeight: 1000
    }),
    new Affix({ //Global energy shield
        maxTiers: 4,
        priority: 3, //Happens after percent modifiers
        effect: (item: Item, tier: number) => {
            item.playerEffect.push((player: Player) => {
                player.maxEnergyShield *= 1.05 + (tier * 0.10);
            })
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
        modWeight: 1000
    }),
    new Affix({ //Percent armor
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.armor *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Armor`,
        itemRestriction: armors,
        modWeight: 1000
    })
]

const weaponAffixes = [
    new Affix({ //Flat attack
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.physicalAttack.min += 10 + tier * 20;
            item.physicalAttack.max += 10 + tier * 20;
        },
        friendlyName: (tier: number) => `+${10 + tier * 20} Physical Attack`,
        itemRestriction: [ItemType.Weapon],
        modWeight: 1000
    }),
    new Affix({ //Percent attack
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.physicalAttack.min *= 1.05 + tier * 0.10;
            item.physicalAttack.max *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Physical Attack`,
        itemRestriction: [ItemType.Weapon],
        modWeight: 1000
    }),
    new Affix({ //Flat critical hit chance
        maxTiers: 7,
        priority: 1,
        effect: (item: Item, tier: number) => {
            item.criticalHitChance += 1 + tier * .05;
        },
        friendlyName: (tier: number) => `+${1 + tier * .05} Critical Hit Chance`,
        itemRestriction: [ItemType.Weapon],
        modWeight: 1000
    }),
    new Affix({ //Percent critical hit chance
        maxTiers: 7,
        priority: 2, //Happens after flat modifiers
        effect: (item: Item, tier: number) => {
            item.criticalHitChance *= 1.05 + tier * 0.10;
        },
        friendlyName: (tier: number) => `+${(5 + tier * 10)}% Critical Hit Chance`,
        itemRestriction: [ItemType.Weapon],
        modWeight: 1000
    })
]

const affixes = [...statAffixes, ...weaponAffixes];
export { affixes };