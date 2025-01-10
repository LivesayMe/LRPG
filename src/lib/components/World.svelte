<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { ExplorationStatus, Zone } from "../zone";
    import ZoneView from "./ZoneView.svelte";
    import { zoneRadius, worldPadding } from "../constants/rendering";

    const dispatch = createEventDispatcher();

    export let zones = [];
    export let edges = [];

    let canvas: HTMLCanvasElement;

    let zonePopupLocation: number[] = [0, 0];
    let zoneHighlight: Zone = null;

    function drawZone(zone: Zone, ctx: CanvasRenderingContext2D) {
        //Draw circle (filled)
        ctx.beginPath();
        ctx.arc(zone.worldPosition[0], zone.worldPosition[1], zoneRadius, 0, 2 * Math.PI);
        
        const baseZoneColor = zone.exploration_status == ExplorationStatus.UNDISCOVERED ? "black" : "white";
        ctx.fillStyle = zone.hover ? "green" : baseZoneColor;
        ctx.fill();

        if (zone.isLastZone) {
            //Draw an additional square
            ctx.beginPath();
            ctx.rect(zone.worldPosition[0] - zoneRadius + 3, zone.worldPosition[1] - zoneRadius + 3, zoneRadius * 2 - 6, zoneRadius * 2 - 6);
            // ctx.fillStyle = "red";
            ctx.fill();
        }
    }

    function drawPath(from: Zone, to: Zone, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();

        ctx.moveTo(from.worldPosition[0], from.worldPosition[1]);
        ctx.lineTo(to.worldPosition[0], to.worldPosition[1]);

        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    $: if (zones && edges && canvas) {
        rerender();
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

    function hoverZone(zone: Zone, mousePosition: number[]) {
        zone.hover = true;
        zonePopupLocation = mousePosition;
        zoneHighlight = zone;
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
        let isHovering = false;
        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i];
            const distance = Math.sqrt(Math.pow(canvasX - zone.worldPosition[0], 2) + Math.pow(canvasY - zone.worldPosition[1], 2));

            if (distance < zoneRadius) {
                //Convert zone coordinates to world coordinates
                const zoneX = zone.worldPosition[0] / canvas.width * canvasWidth + zoneRadius + rect.left;
                const zoneY = zone.worldPosition[1] / canvas.height * canvasHeight - 75;

                hoverZone(zone, [zoneX, zoneY]);
                isHovering = true;
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
        if (!isHovering) {
            zonePopupLocation = [0, 0];
        }
        rerender();
    }


</script>

<div class="w-full h-full flex justify-center relative">
    <img src="/maps/zone1.avif" alt="Zone Map" class="w-full h-full object-fit top-0 left-0 absolute -z-10"/>
    <canvas bind:this={canvas} class="h-full" width="1000" height="1000" on:mousemove={canvasHover}></canvas>

    {#if zonePopupLocation[0] > 0 && zonePopupLocation[1] > 0}
        <div class="absolute card p-2" style="left: {zonePopupLocation[0]}px; top: {zonePopupLocation[1] + 82}px">
            <ZoneView zone={zoneHighlight} on:zoneSelected={(e) => dispatch("zoneSelected", e.detail)}/>
        </div>
    {/if}
</div>