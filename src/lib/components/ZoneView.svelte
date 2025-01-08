<script lang="ts">
    import { Zone, ExplorationStatus } from "../zone";
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();
    
    export let zone: Zone;
</script>

<div class="flex flex-col gap-2">
    {#if zone.exploration_status != ExplorationStatus.UNDISCOVERED}
        <button class="btn variant-filled" on:click={() => dispatch("zoneSelected", zone)}>Start Exploring</button>
    {/if}
    {#if zone.exploration_status == ExplorationStatus.FULLY_EXPLORED}
        <button class="btn variant-filled" on:click={() => dispatch("zoneSelected", zone)}>Farm Zone</button>
    {/if}
    <div>{zone.name}</div>
    <div>Level {zone.level}</div>
</div>