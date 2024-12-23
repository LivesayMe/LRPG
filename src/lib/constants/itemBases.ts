import { Affix, Item, ItemType } from "../item";
import { type Player } from "../player";

const armorBases = [
    new Item({
        name: "Plate Vest",
        armor: 20,
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.movementSpeed -= 0.03})
            },
            friendlyName: () => "-3% Movement Speed",
            itemRestriction: [ItemType.BodyArmor],
            modWeight: 1000
        }),
        levelRequirement: 1,
        strengthRequirement: 12,
        type: ItemType.BodyArmor
    }),
    new Item({
        name: "Plate Vest",
        armor: 80,
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.movementSpeed -= 0.05})
            },
            friendlyName: () => "-5% Movement Speed",
            itemRestriction: [ItemType.BodyArmor],
            modWeight: 1000
        }),
        levelRequirement: 6,
        strengthRequirement: 25,
        type: ItemType.BodyArmor
    }),
]

const jewelleryBases = [
    new Item({
        name: "Saphire Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.coldResistance += 30
            },
            friendlyName: () => "+30 Cold Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        strengthRequirement: 12,
        type: ItemType.Ring
    }),
    new Item({
        name: "Topaz Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.lightningResistance += 30
            },
            friendlyName: () => "+30 Lightning Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 6,
        strengthRequirement: 25,
        type: ItemType.Ring
    }),
    new Item({
        name: "Ruby Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.fireResistance += 30
            },
            friendlyName: () => "+30 Fire Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 11,
        strengthRequirement: 38,
        type: ItemType.Ring
    }),
]

const weaponBases = [
    new Item({
        name: "Short Sword",
        physicalAttack: {min: 5, max: 10},
        levelRequirement: 1,
        strengthRequirement: 12,
        type: ItemType.Weapon,
        baseAttackTime: 1.0,
    })
]

export { armorBases, jewelleryBases, weaponBases }