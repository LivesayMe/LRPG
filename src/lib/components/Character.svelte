<script lang="ts">
    import Item from "./Item.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import { type Player } from "../player";
    import { DamageType } from "../damage";
    import { meleeSkills } from "../constants/skillList";
    import { isWeapon, Item as ItemClass, ItemType } from "../item";
    export let character: Player;
    export let selectedItem: ItemClass;

    const dispatch = createEventDispatcher();

    function truncateName(name: string): string {
        return name.length > 10 ? name.slice(0, 10) + "..." : name;
    }

    const testSkills = [
        { name: "Fireball", level: 1 },
        { name: "Cleave", level: 1 },
        { name: "Lightning Bolt", level: 1 },
    ]

    onMount(() => {
        // console.log(character);
    })

    function handleItemSelection(targetItem, itemType) {
        if (selectedItem) {
            //Replace the target item with the selected item
            if (targetItem != null) {
                replaceItem(targetItem, itemType);
            } else {
                //Add the selected item to the inventory
                if (isWeapon(itemType)) {
                    if(character.weapon1 == null) {
                        character.weapon1 = selectedItem;
                    } else {
                        character.weapon2 = selectedItem;
                    }
                } else if (itemType == ItemType.Amulet) {
                    character.amulet = selectedItem;
                } else if (itemType == ItemType.Ring) {
                    if (character.ring1 == null) {
                        character.ring1 = selectedItem;
                    } else {
                        character.ring2 = selectedItem;
                    }
                } else if (itemType == ItemType.Belt) {
                    character.belt = selectedItem;
                } else if (itemType == ItemType.Helmet) {
                    character.helmet = selectedItem;
                } else if (itemType == ItemType.BodyArmor) {
                    character.body_armor = selectedItem;
                } else if (itemType == ItemType.Boots) {
                    character.boots = selectedItem;
                } else if (itemType == ItemType.Gloves) {
                    character.gloves = selectedItem;
                } else {
                    console.error("Attempted inserting an item into an invalid slot")
                }
            }
            selectedItem = null;
            dispatch("itemSelected", null);
        } else {
            dispatch("itemSelected", targetItem);
        }
    }

    /**
     * Replaces the target item with selectedItem
     * @param item
     */
    function replaceItem(item: ItemClass, itemType: ItemType) {
        switch(itemType) {
            case ItemType.Amulet:
                character.amulet = selectedItem;
                break;
            case ItemType.Ring:
                if (character.ring1 == null) {
                    character.ring1 = selectedItem;
                } else {
                    character.ring2 = selectedItem;
                }
                break;
            case ItemType.Belt:
                character.belt = selectedItem;
                break;
            case ItemType.Helmet:
                character.helmet = selectedItem;
                break;
            case ItemType.BodyArmor:
                character.body_armor = selectedItem;
                break;
            case ItemType.Boots:
                character.boots = selectedItem;
                break;
            case ItemType.Gloves:
                character.gloves = selectedItem;
                break;
        }

        dispatch("addItemToInventory", item);
        dispatch("removeItemFromInventory", selectedItem);

        character.applyItems();
    }
</script>

{#if !character}    
    Loading
{:else}
    <div class="flex flex-col w-full p-2 gap-4">
        <!-- Stats -->
        <div class="flex flex-col card w-1/2 p-2">
            <div>{truncateName(character.name)}</div>
            <div>Level {character.level} {character.class.name}</div>
        </div>

        <span class="font-bold -mb-2">Stats</span>
        <div class="flex flex-row gap-2 card">
            <div class="flex flex-col w-1/2 p-2 border-r-2 border-white -mr-2 gap-2">
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Health</div>
                    <div>{Math.round(character.health*10)/10}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Energy Shield</div>
                    <div>{Math.round(character.maxEnergyShield * 10) / 10}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Armor</div>
                    <div>{Math.round(character.armor * 10) / 10}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Evasion Rating</div>
                    <div>{Math.round(character.evasion * 10) / 10}</div>
                </div>
            </div>
            <div class="flex flex-col w-1/2 p-2 gap-2">
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Mana</div>
                    <div>{character.maxMana}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Lightning Resist</div>
                    <div>{character.resistance[DamageType.LIGHTNING]}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Cold Resist</div>
                    <div>{character.resistance[DamageType.COLD]}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Fire Resist</div>
                    <div>{character.resistance[DamageType.FIRE]}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Chaos Resist</div>
                    <div>{character.resistance[DamageType.CHAOS]}</div>
                </div>
            </div>
        </div>

        <!-- Gear-->
        <span class="font-bold -mb-2">Gear</span>
        <div class="flex flex-row gap-2 w-full">
            <div class="flex flex-col gap-4 w-1/3">
                <Item item={character.weapon1} width="w-full" height="h-[305px]" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Sword)} highlight={selectedItem && (isWeapon(selectedItem.type) || selectedItem.id == (character.weapon1?.id ?? -1))}/>
                <Item item={character.gloves} width="w-full" height="h-32" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Gloves)} highlight={selectedItem && (selectedItem.type == ItemType.Gloves || selectedItem.id == (character.gloves?.id ?? -1))}/>
            </div>
            <div class="flex flex-col gap-2 w-1/3">
                <Item item={character.helmet} width="w-full" height="h-32" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Helmet)} highlight={selectedItem && (selectedItem.type == ItemType.Helmet || selectedItem.id == (character.helmet?.id ?? -1))}/>
                <Item item={character.body_armor} width="w-full" height="h-56" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.BodyArmor)} highlight={selectedItem && (selectedItem.type == ItemType.BodyArmor || selectedItem.id == (character.body_armor?.id ?? -1))}/>
                <Item item={character.belt} width="w-full" height="h-20" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Belt)} highlight={selectedItem && (selectedItem.type == ItemType.Belt || selectedItem.id == (character.belt?.id ?? -1))}/>
            </div>
            <div class="flex flex-col gap-4 w-1/3">
                <Item item={character.weapon2} width="w-full" height="h-[305px]" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Sword)} highlight={selectedItem && (isWeapon(selectedItem.type) || selectedItem.id == (character.weapon2?.id ?? -1))}/>
                <Item item={character.boots} width="w-full" height="h-32" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Boots)} highlight={selectedItem && (selectedItem.type == ItemType.Boots || selectedItem.id == (character.boots?.id ?? -1))}/>
            </div>
        </div>
        <div class="flex flex-row w-full justify-center gap-10 -mt-2">
            <Item item={character.ring1} width="w-20" height="h-20" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Ring)} highlight={selectedItem && (selectedItem.type == ItemType.Ring || selectedItem.id == (character.ring1?.id ?? -1))}/>
            <Item item={character.amulet} width="w-20" height="h-20" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Belt)} highlight={selectedItem && (selectedItem.type == ItemType.Amulet || selectedItem.id == (character.amulet?.id ?? -1))}/>
            <Item item={character.ring2} width="w-20" height="h-20" on:itemSelected={(e) => handleItemSelection(e.detail, e.detail?.type ?? ItemType.Ring)} highlight={selectedItem && (selectedItem.type == ItemType.Ring || selectedItem.id == (character.ring2?.id ?? -1))}/>
        </div>

        <!-- Skill Tree Button -->
        <button class="btn variant-filled" disabled>Skill Tree</button>

        <!-- Skills -->
        <span class="font-bold -mb-2">Skills</span>
        <select bind:value={character.mainSkill} class="select">
            {#each meleeSkills as skill}
                <option value={skill}>{skill.name}</option>
            {/each}
        </select>
        <div class="flex flex-col w-full gap-4 card p-2">
            <div class="flex flex-row justify-between w-full ">
                <div>{character.mainSkill.name}</div>
                <div>Level {character.mainSkill.level}</div>
            </div>
            <div>
                {character.mainSkill.description}
            </div>
            <div>
                Estimated dps: {Math.round(character.mainSkill.dps(character) * 10) / 10}
            </div>
        </div>
    </div>
{/if}