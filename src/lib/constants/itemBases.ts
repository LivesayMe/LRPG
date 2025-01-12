import { ArmorType, Item, ItemType } from "../item";
import { Affix } from "../affix";
import { type Player } from "../player";
import { Damage, DamageType } from "../damage";

const generateArmors = (level) => {
    return [
        new Item({
            name: "Plate Vest",
            armor: 20 + level * 50,
            implicit: new Affix({
                maxTiers: 1,
                priority: 0,
                effect: (item: Item) => {
                    item.playerEffect.push({effect: (player: Player) => {player.movementSpeed -= 0.03}, priority: 0})
                },
                friendlyName: () => "-3% Movement Speed",
                itemRestriction: [ItemType.BodyArmor],
                modWeight: 1000
            }),
            levelRequirement: level,
            strengthRequirement: 12 + level * 2,
            type: ItemType.BodyArmor,
            armorType: ArmorType.STRENGTH,
            image_path: "/items/body_armor/plate_vest.avif"
        }),
        new Item({
            name: "Shabby Jerkin",
            evasion: 10 + level * 20,
            levelRequirement: level,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.BodyArmor,
            armorType: ArmorType.DEXTERITY,
            image_path: "/items/body_armor/shabby_jerkin.avif"
        }),
        new Item({
            name: "Simple Robe",
            energyShield: 10 + level * 5,
            levelRequirement: level,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.BodyArmor,
            armorType: ArmorType.INTELLIGENCE,
            image_path: "/items/body_armor/simple_robe.avif"
        }),

        //Hybrid bases
        new Item({
            name: "Scale vest",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            levelRequirement: level,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.BodyArmor,
            armorType: ArmorType.DEXTERITY_AND_STRENGTH,
            image_path: "/items/body_armor/scale_vest.avif"
        }),
        new Item({
            name: "Chainmail Vest",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            levelRequirement: level,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.BodyArmor,
            armorType: ArmorType.STRENGTH_AND_INTELLIGENCE,
            image_path: "/items/body_armor/chainmail_vest.avif"
        }),
        new Item({
            name: "Padded Vest",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            levelRequirement: level,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.BodyArmor,
            armorType: ArmorType.DEXTERITY_AND_INTELLIGENCE,
            image_path: "/items/body_armor/padded_vest.avif"
        }),
    ];

}

const generateBoots = (level) => {
    return [
        new Item({
            name: "Iron Greaves",
            armor: 20 + level * 50,
            strengthRequirement: 12 + level * 2,
            type: ItemType.Boots,
            armorType: ArmorType.STRENGTH,
            image_path: "/items/boots/iron_greaves.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Leather Boots",
            evasion: 10 + level * 20,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.Boots,
            armorType: ArmorType.DEXTERITY,
            image_path: "/items/boots/leather_boots.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Chain Boots",
            energyShield: 10 + level * 5,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.Boots,
            armorType: ArmorType.INTELLIGENCE,
            image_path: "/items/boots/chain_boots.avif",
            levelRequirement: level
        }),
        //Hybrid bases
        new Item({
            name: "Leatherscale Boots",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.Boots,
            armorType: ArmorType.DEXTERITY_AND_STRENGTH,
            image_path: "/items/boots/leatherscale_boots.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Chainmail Boots",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Boots,
            armorType: ArmorType.STRENGTH_AND_INTELLIGENCE,
            image_path: "/items/boots/chainmail_boots.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Padded Boots",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Boots,
            armorType: ArmorType.DEXTERITY_AND_INTELLIGENCE,
            image_path: "/items/boots/padded_boots.avif",
            levelRequirement: level
        }),
    ]
}

const generateGloves = (level) => {
    return [
        new Item({
            name: "Iron Gauntlets",
            armor: 20 + level * 50,
            strengthRequirement: 12 + level * 2,
            type: ItemType.Gloves,
            armorType: ArmorType.STRENGTH,
            levelRequirement: level,
            image_path: "/items/gloves/iron_gauntlets.avif"
        }),
        new Item({
            name: "Leather Gloves",
            evasion: 10 + level * 20,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.Gloves,
            armorType: ArmorType.DEXTERITY,
            levelRequirement: level,
            image_path: "/items/gloves/leather_gloves.avif"
        }),
        new Item({
            name: "Chain Gloves",
            energyShield: 10 + level * 5,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.Gloves,
            armorType: ArmorType.INTELLIGENCE,
            levelRequirement: level,
            image_path: "/items/gloves/chain_gloves.avif"
        }),
        //Hybrid bases
        new Item({
            name: "Leatherscale Gloves",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.Gloves,
            armorType: ArmorType.DEXTERITY_AND_STRENGTH,
            levelRequirement: level,
            image_path: "/items/gloves/leatherscale_gloves.avif"
        }),
        new Item({
            name: "Chainmail Gloves",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Gloves,
            armorType: ArmorType.STRENGTH_AND_INTELLIGENCE,
            levelRequirement: level,
            image_path: "/items/gloves/chainmail_gloves.avif"
        }),
        new Item({
            name: "Padded Gloves",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Gloves,
            armorType: ArmorType.DEXTERITY_AND_INTELLIGENCE,
            levelRequirement: level,
            image_path: "/items/gloves/padded_gloves.avif"
        }),
    ]
}

const generateHelmets = (level) => {
    return [
        new Item({
            name: "Iron Helm",
            armor: 20 + level * 50,
            strengthRequirement: 12 + level * 2,
            type: ItemType.Helmet,
            armorType: ArmorType.STRENGTH,
            image_path: "/items/helmets/iron_helm.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Leather Helm",
            evasion: 10 + level * 20,
            dexterityRequirement: 12 + level * 2,
            type: ItemType.Helmet,
            armorType: ArmorType.DEXTERITY,
            image_path: "/items/helmets/leather_helm.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Chain Helm",
            energyShield: 10 + level * 5,
            intelligenceRequirement: 12 + level * 2,
            type: ItemType.Helmet,
            armorType: ArmorType.INTELLIGENCE,
            image_path: "/items/helmets/chain_helm.avif",
            levelRequirement: level
        }),
        //Hybrid bases
        new Item({
            name: "Leatherscale Helm",
            armor: 20 + level * 50,
            evasion: 10 + level * 20,
            strengthRequirement: 7 + level * 1,
            dexterityRequirement: 7 + level * 1,
            type: ItemType.Helmet,
            armorType: ArmorType.DEXTERITY_AND_STRENGTH,
            image_path: "/items/helmets/leatherscale_helm.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Chainmail Helm",
            armor: 20 + level * 50,
            energyShield: 10 + level * 5,
            strengthRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Helmet,
            armorType: ArmorType.STRENGTH_AND_INTELLIGENCE,
            image_path: "/items/helmets/chainmail_helm.avif",
            levelRequirement: level
        }),
        new Item({
            name: "Padded Helm",
            evasion: 10 + level * 20,
            energyShield: 10 + level * 5,
            dexterityRequirement: 7 + level * 1,
            intelligenceRequirement: 7 + level * 1,
            type: ItemType.Helmet,
            armorType: ArmorType.DEXTERITY_AND_INTELLIGENCE,
            image_path: "/items/helmets/padded_helm.avif",
            levelRequirement: level
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
                item.playerEffect.push({effect: (player: Player) => {player.resistance[DamageType.COLD] += 30}, priority: 0})
            },
            friendlyName: () => "+30 Cold Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring,
        image_path: "/items/rings/saphire_ring.avif"
    }),
    new Item({
        name: "Topaz Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.resistance[DamageType.LIGHTNING] += 30}, priority: 0})
            },
            friendlyName: () => "+30 Lightning Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring,
        image_path: "/items/rings/topaz_ring.avif"
    }),
    new Item({
        name: "Ruby Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.resistance[DamageType.FIRE] += 30}, priority: 0})
            },
            friendlyName: () => "+30 Fire Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring,
        image_path: "/items/rings/ruby_ring.avif"
    }),
    new Item({
        name: "Amethyst Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.resistance[DamageType.CHAOS] += 30}, priority: 0})
            },
            friendlyName: () => "+30 Chaos Resistance",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 21,
        type: ItemType.Ring,
        image_path: "/items/rings/amethyst_ring.avif"
    }), 
    new Item({
        name: "Coral Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.maxHealth += 30}, priority: 0})
            },
            friendlyName: () => "+30 Maximum Health",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring,
        image_path: "/items/rings/coral_ring.avif"
    }),
    new Item({
        name: "Iron Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {
                    if (player.weapon1 != null) {
                        player.weapon1.addDamage(1, DamageType.PHYSICAL);
                    }
                }, priority: 0})
            },
            friendlyName: () => "+1-4 Physical Attack",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring,
        image_path: "/items/rings/iron_ring.avif"
    }),
    new Item({
        name: "Paua Ring",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.maxMana += 30}, priority: 0})
            },
            friendlyName: () => "+30 Maximum Mana",
            itemRestriction: [ItemType.Ring],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Ring,
        image_path: "/items/rings/paua_ring.avif"
    })
]

const amuletBases = [
    new Item({
        name:"Jade Amulet",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.dexterity += 30}, priority: 0})
            },
            friendlyName: () => "+30 Dexterity",
            itemRestriction: [ItemType.Amulet],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Amulet,
        image_path: "/items/amulets/jade_amulet.avif"
    })
]

const beltBases = [
    new Item({
        name: "Leather Belt",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.maxHealth += 30}, priority: 0})
            },
            friendlyName: () => "+30 Maximum Health",
            itemRestriction: [ItemType.Belt],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Belt,
        armorType: ArmorType.DEXTERITY,
        image_path: "/items/belts/leather_belt.avif"
    }),
    new Item({
        name: "Chain Belt",
        implicit: new Affix({
            maxTiers: 1,
            priority: 0,
            effect: (item: Item) => {
                item.playerEffect.push({effect: (player: Player) => {player.maxEnergyShield += 30}, priority: 0})
            },
            friendlyName: () => "+30 Maximum Energy Shield",
            itemRestriction: [ItemType.Belt],
            modWeight: 1000
        }),
        levelRequirement: 1,
        type: ItemType.Belt,
        armorType: ArmorType.INTELLIGENCE,
        image_path: "/items/belts/chain_belt.avif"
    })
]

const weaponBases = [
    new Item({
        name: "Short Sword",
        damage: new Damage({amount: 5, type: DamageType.PHYSICAL}),
        levelRequirement: 1,
        strengthRequirement: 12,
        type: ItemType.Sword,
        baseAttackTime: 1000,
        criticalHitChance: .05,
        image_path: "/items/swords/rusted_short_sword.avif"
    })
]
const jewelleryBases = [
    ...ringBases,
    ...amuletBases,
    ...beltBases
]
export { armorBases, jewelleryBases, weaponBases }