<script>
    import { TabGroup, Tab } from "@skeletonlabs/skeleton";
    import Character from "$lib/components/Character.svelte";
    import World from "$lib/components/World.svelte";
    import { generateRandomPlayer } from "$lib/player";
    

    
    let characters = [generateRandomPlayer(), 
                        generateRandomPlayer(),
                        generateRandomPlayer()
                    ];
    let selectedCharacterId = characters[0].id
</script>

<div class="w-screen h-[calc(100vh-82px)] flex flex-row">
    <div class="h-full flex-1">
        <World/>
    </div>

    <div class="flex flex-col w-96 h-full bg-surface-500 border-l-2 overflow-y-hidden">
        <TabGroup regionList="flex-wrap" regionPanel="overflow-y-auto h-[calc(100vh-140px)]">
            {#each characters as character}
                <Tab bind:group={selectedCharacterId} name={character.id} value={character.id}>{character.name}</Tab>
            {/each}
            <svelte:fragment slot="panel">
                <Character character={characters.find(c => c.id === selectedCharacterId)} />
            </svelte:fragment>
        </TabGroup>
    </div>
</div>