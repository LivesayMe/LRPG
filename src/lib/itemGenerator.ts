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

function selectBase(areaLevel: number): Item {
    const random = Math.random();
    let bases: Item[] = [];
    if (random < .33) bases = armorBases;
    else if (random < .66) bases = jewelleryBases;
    else bases = weaponBases;

    //Select the top 3 bases with the highest level requirement 
    //not greater than the area level by 2
    const filteredBases = bases.filter(base => base.levelRequirement <= areaLevel + 2);
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

function generateItem(itemRarity: Rarity, areaLevel: number): Item {
    const generatedRarity: Rarity = generateRarity(itemRarity);
    console.log(generatedRarity)

    if (generatedRarity === Rarity.Unique) {
        return new Item({type: ItemType.BodyArmor}); // TODO: Generate unique item
    } else {
        let item = selectBase(areaLevel);
        let numAffixes;
        switch (generatedRarity) {
            case Rarity.Normal:
                break;
            case Rarity.Magic:
                //1-2
                numAffixes = Math.floor(Math.random() * 2) + 1;
                for (let i = 0; i < numAffixes; i++) {
                    addAffix(item);
                }
                break;
            case Rarity.Rare:
                //4-6
                numAffixes = Math.floor(Math.random() * 3) + 4;
                for (let i = 0; i < numAffixes; i++) {
                    addAffix(item);
                }
                item.name = generateName();
                break;
            default:
                break;
        }
        return item;
    }
}

export { generateItem };