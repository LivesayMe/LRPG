<script lang="ts">
    import { onMount } from "svelte";
    import { Zone } from "../zone";

    let zones = [];
    let edges = [];

    let canvas: HTMLCanvasElement;

    const zoneRadius = 20;

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

    function drawZone(zone: Zone, ctx: CanvasRenderingContext2D) {
        //Draw circle (filled)
        ctx.beginPath();
        ctx.arc(zone.worldPosition[0], zone.worldPosition[1], zoneRadius, 0, 2 * Math.PI);
        ctx.fillStyle = zone.hover ? "green" : "black";
        ctx.fill();
    }

    function drawPath(from: Zone, to: Zone, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.moveTo(from.worldPosition[0], from.worldPosition[1]);
        ctx.lineTo(to.worldPosition[0], to.worldPosition[1]);

        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    function generateWorld() {
        const ctx = canvas.getContext("2d");

        for (let i = 0; i < 10; i++) {
            const location = [Math.floor(Math.random() * (1000-zoneRadius * 2)) + zoneRadius, 
                              Math.floor(Math.random() * (1000-zoneRadius * 2)) + zoneRadius];
            zones.push(new Zone("Zone " + i, location));
            drawZone(zones[i], ctx);
        }

        //Construct minimum spanning tree of nodes
        edges = mst(zones)

        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];

            const from = zones.find(zone => zone.id === edge[0]);
            const to = zones.find(zone => zone.id === edge[1]);
            from.addAdjacentZone(to.id);
            to.addAdjacentZone(from.id);

            drawPath(from, to, ctx);
        }

        zones = zones
    }

    function rerender() {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < zones.length; i++) {
            drawZone(zones[i], ctx);
        }

        for (let i = 0; i < edges.length; i++) {            
            const edge = edges[i];

            const from = zones.find(zone => zone.id === edge[0]);
            const to = zones.find(zone => zone.id === edge[1]);

            drawPath(from, to, ctx);
        }
    }

    function canvasHover(e: MouseEvent) {

        //Get dimensions of canvas
        const rect = canvas.getBoundingClientRect();
        const canvasWidth = rect.width;
        const canvasHeight = rect.height;

        //Convert mouse position to canvas coordinates
        const canvasX = e.offsetX / canvasWidth * canvas.width;
        const canvasY = e.offsetY / canvasHeight * canvas.height;

        //Check if we are within a zone
        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i];
            const distance = Math.sqrt(Math.pow(canvasX - zone.worldPosition[0], 2) + Math.pow(canvasY - zone.worldPosition[1], 2));

            if (distance < zoneRadius) {
                zone.hover = true;
                rerender();

                //Un-hover the remaining zones
                for (let j = i+1; j < zones.length; j++) {
                    zones[j].hover = false;
                }
                break;
            } else {
                zone.hover = false;
            }
        }
        rerender();
    }

    onMount(generateWorld);
</script>

<div class="w-full h-full flex justify-center">
    <canvas bind:this={canvas} class="w-full h-full" width="1000" height="1000" on:mousemove={canvasHover}></canvas>
</div>