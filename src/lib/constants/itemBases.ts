import { Affix, Item, ItemType } from "../item";
import { type Player } from "../player";

const generateArmors = (level) => {
    return [
        new Item({
            name: "Plate Vest",
            armor: 20 + level * 50,
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
            levelRequirement: level,
            strengthRequirement: 12 + level * 2,
            type: ItemType.BodyArmor
        }),
        new Item({
            name: "Shabby Jerkin",
            evasion: 10 + level * 20,
            levelRequirement: level,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.BodyArmor
        }),
        new Item({
            name: "Simple Robe",
            energyShield: 10 + level * 5,
            levelRequirement: level,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.BodyArmor
        }),

        //Hybrid bases
        new Item({
            name: "Scale vest",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            levelRequirement: level,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.BodyArmor
        }),
        new Item({
            name: "Chainmail Vest",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            levelRequirement: level,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.BodyArmor
        }),
        new Item({
            name: "Padded Vest",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            levelRequirement: level,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.BodyArmor
        }),
    ];

}

const generateBoots = (level) => {
    return [
        new Item({
            name: "Iron Greaves",
            armor: 20 + level * 50,
            strengthRequirement: 12 + level * 2,
            type: ItemType.Boots
        }),
        new Item({
            name: "Leather Boots",
            evasion: 10 + level * 20,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.Boots
        }),
        new Item({
            name: "Chain Boots",
            energyShield: 10 + level * 5,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.Boots
        }),
        //Hybrid bases
        new Item({
            name: "Leatherscale Boots",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.Boots
        }),
        new Item({
            name: "Chainmail Boots",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Boots
        }),
        new Item({
            name: "Padded Boots",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Boots
        }),
    ]
}

const generateGloves = (level) => {
    return [
        new Item({
            name: "Iron Gauntlets",
            armor: 20 + level * 50,
            strengthRequirement: 12 + level * 2,
            type: ItemType.Gloves
        }),
        new Item({
            name: "Leather Gloves",
            evasion: 10 + level * 20,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.Gloves
        }),
        new Item({
            name: "Chain Gloves",
            energyShield: 10 + level * 5,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.Gloves
        }),
        //Hybrid bases
        new Item({
            name: "Leatherscale Gloves",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.Gloves
        }),
        new Item({
            name: "Chainmail Gloves",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Gloves
        }),
        new Item({
            name: "Padded Gloves",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Gloves
        }),
    ]
}

const generateHelmets = (level) => {
    return [
        new Item({
            name: "Iron Helm",
            armor: 20 + level * 50,
            strengthRequirement: 12 + level * 2,
            type: ItemType.Helmet
        }),
        new Item({
            name: "Leather Helm",
            evasion: 10 + level * 20,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.Helmet
        }),
        new Item({
            name: "Chain Helm",
            energyShield: 10 + level * 5,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.Helmet
        }),
        //Hybrid bases
        new Item({
            name: "Leatherscale Helm",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.Helmet
        }),
        new Item({
            name: "Chainmail Helm",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Helmet
        }),
        new Item({
            name: "Padded Helm",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Helmet
        }),
    ]
}

const armorBases = [
    ...generateArmors(1),
    ...generateArmors(6),
    ...generateArmors(17),
    ...generateArmors(21),
    ...generateArmors(26),
    ...generateArmors(31),
    ...generateArmors(36),
    ...generateArmors(41),
    ...generateArmors(46),
    ...generateArmors(51),
    ...generateArmors(56),
    ...generateArmors(61),
    ...generateArmors(66),

    ...generateBoots(1),
    ...generateBoots(6),
    ...generateBoots(17),
    ...generateBoots(21),
    ...generateBoots(26),
    ...generateBoots(31),
    ...generateBoots(36),
    ...generateBoots(41),
    ...generateBoots(46),
    ...generateBoots(51),
    ...generateBoots(56),
    ...generateBoots(61),
    ...generateBoots(66),

    ...generateHelmets(1),
    ...generateHelmets(6),
    ...generateHelmets(17),
    ...generateHelmets(21),
    ...generateHelmets(26),
    ...generateHelmets(31),
    ...generateHelmets(36),
    ...generateHelmets(41),
    ...generateHelmets(46),
    ...generateHelmets(51),
    ...generateHelmets(56),
    ...generateHelmets(61),
    ...generateHelmets(66),

    ...generateGloves(1),
    ...generateGloves(6),
    ...generateGloves(17),
    ...generateGloves(21),
    ...generateGloves(26),
    ...generateGloves(31),
    ...generateGloves(36),
    ...generateGloves(41),
    ...generateGloves(46),
    ...generateGloves(51),
    ...generateGloves(56),
    ...generateGloves(61),
    ...generateGloves(66),
]

const ringBases = [
    new Item({
        name: "Saphire Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.coldResistance += 30})
            },
            friendlyName: () => "+30 Cold Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring
    }),
    new Item({
        name: "Topaz Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.lightningResistance += 30})
            },
            friendlyName: () => "+30 Lightning Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring
    }),
    new Item({
        name: "Ruby Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.fireResistance += 30})
            },
            friendlyName: () => "+30 Fire Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring
    }),
    new Item({
        name: "Amethyst Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.chaosResistance += 30})
            },
            friendlyName: () => "+30 Chaos Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 21,
        type: ItemType.Ring
    }), 
    new Item({
        name: "Coral Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.maxHealth += 30})
            },
            friendlyName: () => "+30 Maximum Health",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring
    }),
    new Item({
        name: "Iron Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.physicalAttack.min += 1
                item.physicalAttack.max += 4
            },
            friendlyName: () => "+1-4 Physical Attack",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring
    }),
    new Item({
        name: "Paua Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.maxMana += 30})
            },
            friendlyName: () => "+30 Maximum Mana",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring
    })
]

const amuletBases = [
    new Item({
        name:"Jade Amulet",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.dexterity += 30})
            },
            friendlyName: () => "+30 Dexterity",
            itemRestriction: [ItemType.Amulet],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Amulet
    })
]

const beltBases = [
    new Item({
        name: "Leather Belt",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push((player: Player) => {player.maxHealth += 30})
            },
            friendlyName: () => "+30 Maximum Health",
            itemRestriction: [ItemType.Belt],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Belt
    })
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
const jewelleryBases = [
    ...ringBases,
    ...amuletBases,
    ...beltBases
]
export { armorBases, jewelleryBases, weaponBases }