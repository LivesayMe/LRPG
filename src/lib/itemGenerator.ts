import { Item, Rarity, ItemType, isArmor, isWeapon, isJewellery } from "./item";
import { affixes, maxTier } from "./constants/affixList";
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
    //Shuffle the bases
    filteredBases.sort(() => Math.random() - 0.5);
    const top3Bases = filteredBases.slice(0, 3);
    const randomBase = top3Bases[Math.floor(Math.random() * top3Bases.length)];
    //Create deep copy of base
    const baseCopy = randomBase.copy();
    baseCopy.level = areaLevel;

    return baseCopy;
}

function addAffix(item: Item) {
    //List all affixes which match the base type and aren't already on the base
    let filteredAffixes = affixes.filter(affix => 
        affix.itemRestriction.includes(item.type)
    ).filter(affix => !item.affixes.includes(affix));

    if (isArmor(item.type)) {
        filteredAffixes = filteredAffixes.filter(affix => 
            affix.armorRestriction.includes(item.armorType) || affix.armorRestriction.length === 0
        );
    }

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

    selectedAffix.tier = Math.floor(Math.random() * maxTier(item.level, selectedAffix)) + 1;
    item.affixes.push(selectedAffix);
}

/**
 * Generates an item
 * @param itemRarity (Reasonable range is 0-1, beyond 4 common items become the least common type)
 * @param areaLevel Determines the which bases can drop and their item level
 * @param type An optional parameter to only generate items of a certain type
 * @returns 
 */
function generateItem(itemRarity: number, areaLevel: number, type?: ItemType | ItemType[] | null): Item {
    
    const generatedRarity: Rarity = generateRarity(itemRarity);
    if (generatedRarity === Rarity.Unique) {
        return new Item({type: ItemType.BodyArmor, rarity: Rarity.Unique}); // TODO: Generate unique item
    } else {
        let pool: Item[] = [];
        if (type != null) {
            const selectedItemTypes: ItemType[] = Array.isArray(type) ? type : [type];
            selectedItemTypes.forEach(t => {
                if (isArmor(t)) pool = pool.concat(armorBases.filter(b => b.type === t));
                if (isWeapon(t)) pool = pool.concat(weaponBases.filter(b => b.type === t));
                if (isJewellery(t)) pool = pool.concat(jewelleryBases.filter(b => b.type === t));
            })
        } else {
            pool = armorBases.concat(jewelleryBases).concat(weaponBases); //Can be anything
        }
        if (pool.length === 0) {
            if (Array.isArray(type)) throw "Item pool is empty for types " + type.join(", ") + ", either the item base list is corrupted or the item types are invalid";
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