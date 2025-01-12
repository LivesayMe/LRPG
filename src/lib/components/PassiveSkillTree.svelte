<script lang="ts">
    import { PassiveTree } from "../passiveTree";
    import { createEventDispatcher } from "svelte";
    import { popup } from '@skeletonlabs/skeleton';

    const dispatch = createEventDispatcher();

    export let passiveTree: PassiveTree;

    console.log(passiveTree)
</script>

<div class="w-full h-full bg-surface-100 relative">
    <button on:click={() => dispatch("close")} class="absolute top-2 right-2 btn variant-filled-primary">Close</button>

    {#each passiveTree.nodes as passiveNode}
        <div class="card p-2 absolute" style={`left: ${passiveNode.position[0] * 10}px; top: ${passiveNode.position[1] * 10}px;`} use:popup={{
            event: 'hover',
            target: 'passiveTooltip' + passiveNode.passive.id,
            placement: 'top',
        }}>
            {passiveNode.passive.name}
        </div>

        <div data-popup={"passiveTooltip" + passiveNode.passive.id}>
            <div class="card p-2">
                {passiveNode.passive.description}
            </div>
        </div>
    {/each}
</div>