<script lang="ts">
    import { TabGroup, Tab, getToastStore } from "@skeletonlabs/skeleton";
    import Character from "$lib/components/Character.svelte";
    import ZoneExploration from "$lib/components/ZoneExploration.svelte";
    import World from "$lib/components/World.svelte";
    import { generateRandomPlayer } from "$lib/player";
    import { Zone, ExplorationStatus } from "$lib/zone";
    import { onMount } from "svelte";
    import { zoneRadius, worldPadding } from "$lib/constants/rendering";
    import Inventory from "../../lib/components/Inventory.svelte";
    import {inventory} from "$lib/stores/inventory";
    import { generateItem } from "../../lib/itemGenerator";

    const toastStore = getToastStore();
    
    function hasCycle(edges: number[][]): boolean {
        // Helper function to find the root of a node using path compression
        function find(parent: number[], node: number): number {
            if (parent[node] !== node) {
                parent[node] = find(parent, parent[node]); // Path compression
            }
            return parent[node];
        }

        // Helper function to union two sets 
        function union(parent: number[], rank: number[], node1: number, node2: number): boolean {
            const root1 = find(parent, node1);
            const root2 = find(parent, node2);

            if (root1 === root2) {
                return false; // Cycle detected
            }

            // Union by rank
            if (rank[root1] > rank[root2]) {
                parent[root2] = root1;
            } else if (rank[root1] < rank[root2]) {
                parent[root1] = root2;
            } else {
                parent[root2] = root1;
                rank[root1]++;
            }
            return true;
        }

        // Extract the number of nodes from the edges
        const nodes = new Set<number>();
        for (const [start, end] of edges) {
            nodes.add(start);
            nodes.add(end);
        }

        // Initialize Union-Find structures
        const parent: number[] = [];
        const rank: number[] = [];
        for (const node of nodes) {
            parent[node] = node;
            rank[node] = 0;
        }

        // Process each edge
        for (const [start, end] of edges) {
            if (!union(parent, rank, start, end)) {
                return true; // Cycle detected
            }
        }

        return false; // No cycle found
    }

    //Kruskal's algorithm
    function mst(nodes: Zone[]): number[][] {
        const distance = (a: number[], b: number[]) => {
            return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
        }


        const edges: number[][] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (i === j) continue;
                edges.push([nodes[i].id, nodes[j].id, distance(nodes[i].worldPosition, nodes[j].worldPosition)]);
            }
        }

        edges.sort((a: any, b: any) => {
            return a[2] - b[2];
        });

        const mst: number[][] = [];

        while (mst.length < nodes.length - 1) {
            const edge = edges.shift();
            if (!edge) break;
            if (!hasCycle([...mst, edge])) {
                mst.push(edge);
            }
        }

        return mst;
    }

    function generateWorld() {
        const zones = [];
        for (let i = 0; i < 10; i++) {
            const location = [Math.floor(Math.random() * (1000-zoneRadius * 2 - worldPadding)) + zoneRadius + worldPadding / 2, 
                              Math.floor(Math.random() * (1000-zoneRadius * 2 - worldPadding)) + zoneRadius + worldPadding / 2];

            // Make sure the location is far enough from other zones
            let distances = Array.from({length: zones.length}, (_, i) => Math.sqrt(Math.pow(location[0] - zones[i].worldPosition[0], 2) + Math.pow(location[1] - zones[i].worldPosition[1], 2)));
            while (Math.min(...distances) < zoneRadius * 2) {
                location[0] = Math.floor(Math.random() * (1000-zoneRadius * 2 - worldPadding)) + zoneRadius + worldPadding / 2;
                location[1] = Math.floor(Math.random() * (1000-zoneRadius * 2 - worldPadding)) + zoneRadius + worldPadding / 2;
                distances = Array.from({length: zones.length}, (_, i) => Math.sqrt(Math.pow(location[0] - zones[i].worldPosition[0], 2) + Math.pow(location[1] - zones[i].worldPosition[1], 2)));
            }

            zones.push(new Zone("Zone " + i, location, 0));
            zones[i].exploration_status = ExplorationStatus.UNDISCOVERED;
        }

        //Construct minimum spanning tree of nodes
        let edges = mst(zones)

        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];

            const from = zones.find(zone => zone.id === edge[0]);
            const to = zones.find(zone => zone.id === edge[1]);
            from.addAdjacentZone(to.id);
            to.addAdjacentZone(from.id);
        }

        //Pick a leaf node as the starting zone
        const startingZone = zones.find(zone => zone.connectedZones.length === 1);
        startingZone.level = 1;
        startingZone.exploration_status = ExplorationStatus.UNEXPLORED;

        //Walk the tree starting from the starting zone, assigning level to be the distance from the starting zone
        const queue = [startingZone];
        while (queue.length > 0) {
            const zone = queue.shift();
            for (let i = 0; i < zone.connectedZones.length; i++) {
                const adjacentZone = zones.find(z => z.id === zone.connectedZones[i]);
                if (adjacentZone.level === 0) {
                    adjacentZone.level = zone.level + 1;
                    queue.push(adjacentZone);
                }
            }
        }

        //The zone with the highest level is the last zone
        const lastZone = zones.find(zone => zone.level === Math.max(...zones.map(zone => zone.level)));
        lastZone.isLastZone = true;

        return [zones, edges];
    }

    function updateZoneStatuses(e: { detail: Zone; }) {
        const zone: Zone = e.detail;
        console.log(zone);
        zone.exploration_status = ExplorationStatus.FULLY_EXPLORED;
        //All zones adjacent to a fullly explored zone should be discovered
        zone.connectedZones.forEach(zoneId => {
            const adjacentZone = worldZones.find(zone => zone.id === zoneId);
            if (adjacentZone.exploration_status == ExplorationStatus.UNDISCOVERED) {
                adjacentZone.exploration_status = ExplorationStatus.UNEXPLORED;
                console.log(adjacentZone.name, " discovered");
            }
        })
    }

    function addItemToInventory(item, triggerToast = true) {
        $inventory.items.push(item);
        if (triggerToast) {
            toastStore.trigger({
                message: "Item added to inventory",
                background: "variant-filled-success",
            })
        }
    }
    
    let characters = [generateRandomPlayer(), 
                        // generateRandomPlayer(),
                        // generateRandomPlayer()
                    ];
    let selectedCharacterId = characters[0].id

    let isExploringZone = false;
    let selectedZone = null;
    let isInventoryOpen = false;


    $: if (isExploringZone) {
        //Do something??
    }

    let worldZones = [];
    let worldEdges = [];


    onMount(() => {
        const [zones, edges] = generateWorld();
        worldZones = zones;
        worldEdges = edges;
        $inventory.items = [];
        $inventory.items.push(generateItem(.5, 1));
        $inventory.items.push(generateItem(.5, 1));
        $inventory.items.push(generateItem(.5, 1));
        $inventory.items.push(generateItem(.5, 1));

        console.log($inventory.items)
    })

    let selectedItem = null;

    function selectItem(item) {
        selectedItem = item;
    }

</script>

<div class="w-screen h-[calc(100vh-82px)] flex flex-row relative">
    
    {#if !isInventoryOpen}
        <button class="absolute bottom-2 left-2 btn variant-filled-primary z-30" on:click={() => {
            isInventoryOpen = !isInventoryOpen
        }}>
            Inventory
        </button>
    {/if}
    {#if isInventoryOpen}
        <div class="absolute top-0 left-0 w-[calc(100vw-520px)] h-full z-20 bg-black/50">
            <Inventory on:close={() => isInventoryOpen = false} on:itemSelected={(e) => selectItem(e.detail)} selectedItem={selectedItem}/>
        </div>
    {/if}

    <div class="h-full flex-1">
        {#if isExploringZone && selectedZone}
            <ZoneExploration zone={selectedZone} activeCharacters={characters} on:close={() => {
                isExploringZone = false;
                characters.forEach(character => character.fullHeal());
            }} on:explored={(e) => {
                updateZoneStatuses(e)
            }} on:addItem={(e) => addItemToInventory(e.detail)}/>
        {:else}
            <World bind:zones={worldZones} bind:edges={worldEdges} on:zoneSelected={(e) => {selectedZone = e.detail; isExploringZone = true}}/>
        {/if}
    </div>
    


    <div class="flex flex-col w-[520px] h-full bg-surface-500 border-l-2 overflow-y-hidden">
        <TabGroup regionList="flex-wrap" regionPanel="overflow-y-auto h-[calc(100vh-140px)]">
            {#each characters as character}
                <Tab bind:group={selectedCharacterId} name={character.id} value={character.id}>{character.name}</Tab>
            {/each}
            <svelte:fragment slot="panel">
                <Character 
                    character={characters.find(c => c.id === selectedCharacterId)} 
                    on:itemSelected={(e) => selectItem(e.detail)} 
                    selectedItem={selectedItem} 
                    on:addItemToInventory={(e) => addItemToInventory(e.detail, false)} 
                    on:removeItemFromInventory={(e) => $inventory.items = $inventory.items.filter(item => item.id !== e.detail.id)}/>
            </svelte:fragment>
        </TabGroup>
    </div>
</div>