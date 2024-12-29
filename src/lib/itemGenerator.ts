import { Item, Rarity, ItemType } from "./item";
import { affixes } from "./constants/affixList";
import { weaponBases, armorBases, jewelleryBases } from "./constants/itemBases";
import { generateName } from "./constants/itemNames";

const baseOdds = {
    normal: .59,
    magic: .3,
    rare: .1,
    unique: .01
}


function generateRarity(itemRarity: number): Rarity {
    itemRarity = Math.max(.0001, itemRarity);
    const cumulativeRarity = [
        baseOdds.normal * Math.pow(itemRarity, 1),
        baseOdds.magic * Math.pow(itemRarity, 2),
        baseOdds.rare * Math.pow(itemRarity, 3),
        baseOdds.unique * Math.pow(itemRarity, 4)
    ].reduce((a, b) => a + b, 0);

    const adjustedNormalRarity = Math.pow(itemRarity, 1) * baseOdds.normal / cumulativeRarity;
    const adjustedMagicRarity = Math.pow(itemRarity, 2) * baseOdds.magic / cumulativeRarity;
    const adjustedRareRarity = Math.pow(itemRarity, 3) * baseOdds.rare / cumulativeRarity;
    const adjustedUniqueRarity = Math.pow(itemRarity, 4) * baseOdds.unique / cumulativeRarity;

    const random = Math.random();
    if (random < adjustedNormalRarity) return Rarity.Normal;
    if (random < adjustedMagicRarity + 
                 adjustedNormalRarity) return Rarity.Magic;
    if (random < adjustedRareRarity + 
                 adjustedMagicRarity + 
                 adjustedNormalRarity) return Rarity.Rare;
    return Rarity.Unique;
}

function selectBase(pool: Item[], areaLevel: number): Item {
    //Select the top 3 bases with the highest level requirement 
    //not greater than the area level by 2
    const filteredBases = pool.filter(base => base.levelRequirement <= areaLevel + 2);
    const top3Bases = filteredBases.slice(0, 3);
    const randomBase = top3Bases[Math.floor(Math.random() * top3Bases.length)];
    return randomBase;
    
}

function addAffix(item: Item) {
    //List all affixes which match the base type and aren't already on the base
    let filteredAffixes = affixes.filter(affix => 
        affix.itemRestriction.includes(item.type)
    ).filter(affix => !item.affixes.includes(affix));

    if (filteredAffixes.length === 0) return;
    const totalModWeight = filteredAffixes.reduce((a, b) => a + b.modWeight, 0);
    const random = Math.random() * totalModWeight;
    let currentModWeight = 0;
    let selectedAffix = filteredAffixes[0];
    for (let i = 0; i < filteredAffixes.length; i++) {
        currentModWeight += filteredAffixes[i].modWeight;
        if (random < currentModWeight) {
            selectedAffix = filteredAffixes[i];
            break;
        }
    }

    selectedAffix.tier = Math.floor(Math.random() * selectedAffix.maxTiers) + 1;
    item.affixes.push(selectedAffix);
}

/**
 * Generates an item
 * @param itemRarity (Reasonable range is 0-1, beyond 4 common items become the least common type)
 * @param areaLevel Determines the which bases can drop and their item level
 * @param type An optional parameter to only generate items of a certain type
 * @returns 
 */
function generateItem(itemRarity: number, areaLevel: number, type: ItemType | null): Item {
    const generatedRarity: Rarity = generateRarity(itemRarity);
    if (generatedRarity === Rarity.Unique) {
        return new Item({type: ItemType.BodyArmor, rarity: Rarity.Unique}); // TODO: Generate unique item
    } else {
        let pool: Item[] = [];
        if (type != null) {
            if (type === ItemType.BodyArmor || type === ItemType.Helmet || type === ItemType.Boots || type === ItemType.Gloves) {
                pool = armorBases.filter(base => base.type === type);
            } else if (type === ItemType.Ring || type === ItemType.Amulet || type === ItemType.Belt) {
                pool = jewelleryBases.filter(base => base.type === type);
            } else {
                pool = weaponBases;
            }
        } else {
            pool = armorBases.concat(jewelleryBases).concat(weaponBases);
        }
        if (pool.length === 0) {
            throw "Item pool is empty for type " + ItemType[type ?? 0] + ", either the item base list is corrupted or the item type is invalid";
        }
        let item = selectBase(pool, areaLevel);
        let numAffixes;
        switch (generatedRarity) {
            case Rarity.Normal:
                break;
            case Rarity.Magic:
                //1-2
                item.rarity = Rarity.Magic;
                numAffixes = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < numAffixes; i++) {
                    addAffix(item);
                }
                break;
            case Rarity.Rare:
                //4-6
                item.rarity = Rarity.Rare;
                numAffixes = Math.floor(Math.random() * 3) + 4;
                for (let i = 0; i < numAffixes; i++) {
                    addAffix(item);
                }
                item.name = generateName();
                break;
            default:
                break;
        }

        item.applyAffixes();
        return item;
    }
}

export { generateItem };