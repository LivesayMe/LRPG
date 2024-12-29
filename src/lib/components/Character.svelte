<script lang="ts">
    import Item from "./Item.svelte";
    import { onMount } from "svelte";
    import { type Player } from "../player";
    export let character: Player;

    function truncateName(name: string): string {
        return name.length > 10 ? name.slice(0, 10) + "..." : name;
    }

    const testSkills = [
        { name: "Fireball", level: 1 },
        { name: "Cleave", level: 1 },
        { name: "Lightning Bolt", level: 1 },
    ]

    onMount(() => {
        console.log(character);
    })
</script>

{#if !character}    
    Loading
{:else}
    <div class="flex flex-col w-full p-2 gap-4">
        <!-- Stats -->
        <div class="flex flex-col card w-1/2 p-2">
            <div>{truncateName(character.name)}</div>
            <div>Level {character.level} {character.class.name}</div>
        </div>

        <span class="font-bold -mb-2">Stats</span>
        <div class="flex flex-row gap-2 card">
            <div class="flex flex-col w-1/2 p-2 border-r-2 border-white -mr-2 gap-2">
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Health</div>
                    <div>{character.health}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Energy Shield</div>
                    <div>{character.getMaxEnergyShield()}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Armor</div>
                    <div>{character.getArmor()}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Evasion Rating</div>
                    <div>{character.getEvasion()}</div>
                </div>
            </div>
            <div class="flex flex-col w-1/2 p-2 gap-2">
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Mana</div>
                    <div>{character.maxMana}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Lightning Resist</div>
                    <div>{character.lightningResistance}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Cold Resist</div>
                    <div>{character.coldResistance}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Fire Resist</div>
                    <div>{character.fireResistance}</div>
                </div>
                <div class="flex flex-row justify-between">
                    <div class="font-bold">Chaos Resist</div>
                    <div>{character.chaosResistance}</div>
                </div>
            </div>
        </div>

        <!-- Gear-->
        <span class="font-bold -mb-2">Gear</span>
        <div class="flex flex-row gap-2 w-full">
            <div class="flex flex-col gap-4 w-1/3">
                <Item item={character.weapon1} width="w-full" height="h-60"/>
                <Item item={character.gloves} width="w-full" height="h-24"/>
            </div>
            <div class="flex flex-col gap-2 w-1/3">
                <Item item={character.helmet} width="w-full" height="h-24"/>
                <Item item={character.body_armor} width="w-full" height="h-48"/>
                <Item item={character.belt} width="w-full" height="h-12"/>
            </div>
            <div class="flex flex-col gap-4 w-1/3">
                <Item item={character.weapon2} width="w-full" height="h-60"/>
                <Item item={character.boots} width="w-full" height="h-24"/>
            </div>
        </div>
        <div class="flex flex-row w-full justify-center gap-2 -mt-2">
            <Item item={character.ring1} width="w-16" height="h-16"/>
            <Item item={character.amulet} width="w-16" height="h-16"/>
            <Item item={character.ring2} width="w-16" height="h-16"/>
        </div>

        <!-- Skill Tree Button -->
        <button class="btn variant-filled">Skill Tree</button>

        <!-- Skills -->
        <span class="font-bold -mb-2">Skills</span>
        <div class="flex flex-col w-full gap-2">
            {#each testSkills as skill}
                <div class="card flex flex-row justify-between w-full p-2">
                    <div>{skill.name}</div>
                    <div>Level {skill.level}</div>
                </div>
            {/each}
        </div>
    </div>
{/if}