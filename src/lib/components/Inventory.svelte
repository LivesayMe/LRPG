<script>
    import { inventory } from "$lib/stores/inventory";
    import Item from "$lib/components/Item.svelte";
    import { Rarity, ItemType } from "$lib/item";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let filterText = "";
    let filteredItems = $inventory.items;

    function filterItems(filter) {
        
        let lowerFilter = filter.toLowerCase();
        console.log(filter)
        if (["normal", "magic", "rare", "unique"].includes(lowerFilter)) {
            const rarityFilter = lowerFilter === "magic" ? Rarity.Magic : lowerFilter === "rare" ? Rarity.Rare : lowerFilter === "unique" ? Rarity.Unique : Rarity.Normal;
            filteredItems = $inventory.items.filter(i => i.rarity === rarityFilter);
        } else {
            filteredItems = $inventory.items.filter(i => 
                i.name.toLowerCase().includes(lowerFilter) ||
                i.affixes.some(a => a.friendlyName().toLowerCase().includes(lowerFilter)) ||
                ItemType[i.type].toLowerCase().includes(lowerFilter)
            );
        }

        
    }
</script>

<div class="w-full h-full flex flex-col">
    <div class="flex flex-row justify-between gap-10 p-2">
        <div class="flex flex-row gap-2 w-full">
            <input type="text" class="input pl-4" bind:value={filterText} on:input={(e) => filterItems(e.target.value)} placeholder="Filter ..." on:keydown={(e) => e.key === "Enter" && filterItems(filterText)}>
            <button class="btn variant-filled-primary" on:click={() => filterItems(filterText)}>Filter</button>
        </div>
        <button on:click={() => dispatch("close")} class="btn variant-filled-primary">Close</button>
    </div>
    <div class="flex flex-wrap justify-center gap-10 mt-5">
        {#each filteredItems as item}
            <Item {item} />
        {/each}
    </div>
</div>