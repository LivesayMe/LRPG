<script lang="ts">
    import { generateItem } from "$lib/itemGenerator";
    import Item from "$lib/components/Item.svelte";
    import { onMount } from "svelte";

    let items = [];

    const loadItems = () => {
        items = [];
        for (let i = 0; i < 10; i++) {
            items.push(generateItem(.5, 1));
        }
    }

    onMount(loadItems);
</script>

<div class="w-full flex flex-wrap justify-center gap-10 mt-5">
    {#each items as item}
        <Item {item} />
    {/each}
</div>