<script lang="ts">
    import { Zone, ExplorationStatus } from "../zone";
    import { Player } from "../player";
    import { createEventDispatcher, onMount } from "svelte";
    import { enemyCount, wavesPerZone } from "../constants/zoneScaling";
    import { generateEnemy } from "../enemy";
    import { Crown } from 'lucide-svelte';
    import { popup } from '@skeletonlabs/skeleton';
    import { type Damage } from "../damage";
    import EntityCard from "./EntityCard.svelte";

    const dispatch = createEventDispatcher();

    export let zone: Zone;
    export let activeCharacters: Player[];

    const zoneLevel = zone.level;

    let waves = generateWaves(enemyCount(zoneLevel), wavesPerZone);
    let curWave = 0;

    let activeEnemies = [];

    let isFinished = false;
    let isFailed = false;

    let timer = null;

    const tickRate = 10;

    let isTraveling = false;
    let travelTimer = null;
    let travelTime = 0;
    let totalTravelTime = 0;

    function spawnWave() {
        activeEnemies = waves[curWave++].enemies
    }

    function generateWaves(count: number, waveCount: number) {
        let tempWaves = [];
        for (let i = 0; i < waveCount - 1; i++) {
            tempWaves.push({
                id: i,
                enemies: Array.from({length: count / waveCount}, (_, j) => generateEnemy(zone.level, j)),
                isBoss: false,
            })
        }
        
        tempWaves.push({
            id: waveCount - 1,
            enemies: [generateEnemy(zone.level + 2, 0)], // Boss
            isBoss: true
        })
        return tempWaves
    }

    onMount(() => {
        totalTravelTime = Math.min(...activeCharacters.map(character => character.movementSpeed)) * 3000;

        for (let i = 0; i < activeCharacters.length; i++) {
            activeCharacters[i].position = i;
        }

        timer = setInterval(() => {
            if (activeCharacters.filter(character => !character.isDowned).length === 0) {
                isFailed = true;
                clearInterval(timer);
                return;
            }
            
            activeCharacters.forEach(character => {
                if (character.isDowned) return;
                character.tick(tickRate);
            });

            activeEnemies.forEach(enemy => {
                if (enemy.isDowned) return;
                enemy.tick(tickRate);
            });

            if (activeEnemies.length === 0) {
                activeCharacters = activeCharacters;
                return;
            }

            // Characters attack
            for (let i = 0; i < activeCharacters.length; i++) {
                if (activeCharacters[i].isDowned) continue;
                const target = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
                if (activeCharacters[i].timeSinceLastAttack > activeCharacters[i].getAttackSpeed()) {
                    const damage: Damage[] = activeCharacters[i].attack(target, activeEnemies, activeCharacters);
                    if (damage != null) {
                        damage.forEach(d => {
                            d.target.mostRecentDamage = d;
                            d.target.eventDisplayQueue.push({
                                message: d.getPrettyString(),
                                color: "red"
                            })
                        });
                    } else {
                        activeCharacters[i].eventDisplayQueue.push({
                            message: "Miss",
                            color: "white"
                        });
                    }
                    activeCharacters[i].timeSinceLastAttack = 0;
                }
            }

            // Enemies attack
            const aliveIndices = activeCharacters.filter(character => !character.isDowned).map(character => activeCharacters.indexOf(character));
            for (let i = 0; i < activeEnemies.length; i++) {
                const targetIndex = Math.floor(Math.random() * aliveIndices.length);
                const target = activeCharacters[aliveIndices[targetIndex]];
                // console.log(target);
                if (activeEnemies[i].timeSinceLastAttack > activeEnemies[i].getAttackSpeed()) {
                    const damage = activeEnemies[i].attack(target, activeCharacters, activeEnemies);
                    if (damage != null) {
                        damage.forEach(d => {
                            d.target.mostRecentDamage = d;
                            d.target.eventDisplayQueue.push({
                                message: d.getPrettyString(),
                                color: "red"
                            })
                        });
                    } else {
                        activeEnemies[i].eventDisplayQueue.push({
                            message: "Miss",
                            color: "white"
                        });
                    }

                    activeEnemies[i].timeSinceLastAttack = 0;
                }

                //Apply energy shield regen
                if(activeEnemies[i].maxEnergyShield > 0 && activeEnemies[i].timeSinceLastDamage > activeEnemies[i].energyShieldRegenCooldown) {
                    const effectiveRegen = tickRate / 1000 * activeEnemies[i].energyShieldRegen;
                    activeEnemies[i].energyShield = Math.min(activeEnemies[i].energyShield + effectiveRegen, activeEnemies[i].maxEnergyShield);
                }
            }

            // Remove dead enemies
            for (let i = activeEnemies.length - 1; i >= 0; i--) {
                if (activeEnemies[i].isDowned) {
                    activeEnemies.splice(i, 1);
                }
            }

            activeEnemies = activeEnemies;
            activeCharacters = activeCharacters;
        }, tickRate);

        return () => {
            clearInterval(timer);
        }
    });

    $: if (activeEnemies.length === 0 && curWave < waves.length && !isTraveling) {
        isTraveling = true;
        if (travelTimer != null) {
            clearInterval(travelTimer);
        }
        travelTimer = setInterval(() => {
            travelTime += tickRate;
            if (travelTime >= totalTravelTime) {
                isTraveling = false;
                travelTime = 0;
                spawnWave();
                clearInterval(travelTimer);
            }
        }, tickRate);
    }

    $: if (curWave >= waves.length && activeEnemies.length === 0 && !isFinished && !isFailed && !isTraveling) {
        console.log("Finished");
        zone.exploration_status = ExplorationStatus.FULLY_EXPLORED;
        isFinished = true;
        clearInterval(timer);

        dispatch('explored', zone);
    }
</script>

<div class="w-full h-full relative flex flex-col justify-between">
    <img src="/zone_backgrounds/mountains.avif" alt="Zone Map" class="w-full h-full top-0 left-0 absolute -z-10 object-cover"/>
    <div class="flex flex-row justify-around flex-1">
        <button on:click={() => dispatch("close")} class="absolute top-2 right-2 btn variant-filled-primary">Retreat</button>

        <div class="flex flex-col gap-2 justify-center">
            {#each activeCharacters as character}
                <EntityCard entity={character}/>
            {/each}
        </div>

        <div class="flex flex-col gap-2 justify-center">
            {#if isTraveling}
                <div class="w-40 card p-2 flex flex-col items-center">
                    <span class="text-center font-bold h3 mb-2">Traveling</span>
                    <div class="text-2xl font-bold bg-white text-primary-500 rounded text-center h-4" style="width: {travelTime / totalTravelTime * 100}%"/>
                    <span class="text-center w-full">{Math.round((totalTravelTime - travelTime) / 100) / 10}s left</span>
                </div>
            {/if}
            {#each activeEnemies as enemy}
                <EntityCard entity={enemy}/>
            {/each}
        </div>

        {#if isFailed}
            <div class="w-40 h-40 card flex flex-col items-center justify-center absolute top-1/2 left-1/2">
                <span class="text-center font-bold h3 mb-2">Failed</span>
                <button on:click={() => dispatch("close")} class="btn variant-filled-primary">Retreat For Now</button>
            </div>
        {/if}
    </div>
    <div class="card w-3/4 mx-auto h-10 mb-10 flex flex-row justify-around items-center">
        <div class="font-bold">Start</div>
        {#each waves as wave}
            <div class={"min-w-4 min-h-4 p-1 rounded-lg " + ((curWave - 1 > wave.id) ? " bg-red-500" : " bg-gray-500")}>
                {#if wave.isBoss}
                    <div class="[&>*]:pointer-events-none" use:popup={{
                        event: 'hover',
                        target: 'bossTooltip' + wave.id,
                        placement: 'top',
                    }}>
                        <Crown/>
                    </div>
                    <div data-popup={"bossTooltip" + wave.id}>
                        <div class="card p-2">
                            Boss
                            {#if curWave - 1 === wave.id}
                                You are here
                            {/if}
                        </div>
                    </div>
                {:else if curWave - 1 === wave.id}
                    <div class="w-2 h-2 rounded-full bg-white" use:popup={{
                        event: 'hover',
                        target: 'curLocation' + wave.id,
                        placement: 'top',
                    }}>

                    </div>
                    <div data-popup={"curLocation" + wave.id}>
                        <div class="card p-2">
                            You are here
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    {#if isFinished}
        <div class="w-40 h-40 card flex flex-col items-center justify-center absolute top-1/2 left-1/2">
            <span class="text-center font-bold h3 mb-2">Finished</span>
            <button on:click={() => dispatch("close")} class="btn variant-filled-primary">Return to Map</button>
        </div>
    {/if}

</div>