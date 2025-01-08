<script lang="ts">
    import { Zone, ExplorationStatus } from "../zone";
    import { Player } from "../player";
    import { createEventDispatcher, onMount } from "svelte";
    import { enemyCount, wavesPerZone } from "../constants/zoneScaling";
    import { generateEnemy } from "../enemy";
    import EntityCard from "./EntityCard.svelte";

    const dispatch = createEventDispatcher();

    export let zone: Zone;
    export let activeCharacters: Player[];

    const zoneLevel = zone.level;

    let totalEnemies = enemyCount(zoneLevel);;
    let remainingWaves = Math.min(totalEnemies, wavesPerZone);
    let enemiesPerWave = Math.max(Math.floor(totalEnemies / remainingWaves), 1);

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
        const variance = .1 * enemiesPerWave
        const enemiesToSpawn = Math.random() * variance * 2 - variance + enemiesPerWave;
        for (let i = 0; i < enemiesToSpawn; i++) {
            activeEnemies.push(generateEnemy(zone.level));
        }

        activeEnemies = activeEnemies;
    }

    onMount(() => {
        

        console.log("Enemies per wave", enemiesPerWave, "Remaining waves", remainingWaves, "Total enemies", totalEnemies);

        totalTravelTime = Math.min(...activeCharacters.map(character => character.movementSpeed)) * 3000;

        timer = setInterval(() => {
            if (activeCharacters.filter(character => !character.isDowned).length === 0) {
                isFailed = true;
                clearInterval(timer);
                return;
            }
            
            activeCharacters.forEach(character => {
                if (character.isDowned) return;
                character.timeSinceLastAttack += tickRate;
                character.timeSinceLastDamage += tickRate;

                //Apply energy shield regen
                if (character.maxEnergyShield > 0 && character.timeSinceLastDamage > character.energyShieldRegenCooldown) {
                    const effectiveRegen = tickRate / 1000 * character.energyShieldRegen;
                    character.energyShield = Math.min(character.energyShield + effectiveRegen, character.maxEnergyShield);
                }
            });

            activeEnemies.forEach(enemy => {
                enemy.timeSinceLastAttack += tickRate;
                enemy.timeSinceLastDamage += tickRate;
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
                    const damage = activeCharacters[i].attack(target);
                    if (damage != null) {
                        target.mostRecentDamage = damage;
                        target.eventDisplayQueue.push({
                            message: damage.getPrettyString(),
                            color: "red"
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
                    const damage = activeEnemies[i].attack(target);
                    if (damage != null) {
                        target.mostRecentDamage = damage;
                        target.eventDisplayQueue.push({
                            message: damage.getPrettyString(),
                            color: "red"
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

    $: if (activeEnemies.length === 0 && remainingWaves > 0 && !isTraveling) {
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
                remainingWaves--;
                clearInterval(travelTimer);
            }
        }, tickRate);
    }

    $: if (remainingWaves === 0 && activeEnemies.length === 0 && !isFinished && !isFailed && !isTraveling) {
        console.log("Finished");
        zone.exploration_status = ExplorationStatus.FULLY_EXPLORED;
        isFinished = true;
        clearInterval(timer);

        dispatch('explored', zone);
    }
</script>

<div class="w-full h-full relative flex flex-row justify-around">
    <button on:click={() => dispatch("close")} class="absolute top-2 right-2 btn variant-filled-primary">Close</button>

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
            <button on:click={() => dispatch("close")} class="btn variant-filled-primary">Close</button>
        </div>
    {/if}

    {#if isFinished}
        <div class="w-40 h-40 card flex flex-col items-center justify-center absolute top-1/2 left-1/2">
            <span class="text-center font-bold h3 mb-2">Finished</span>
            <button on:click={() => dispatch("close")} class="btn variant-filled-primary">Close</button>
        </div>
    {/if}
</div>