<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { type Item, Rarity, ItemType, isWeapon } from '../item';
    import { Affix } from '../affix';
    import { autoModeWatcher, popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { DamageType } from '../damage';

    export let item: Item;

    export let height: string = "h-fit";
    export let width: string = "w-40";

    const dispatch = createEventDispatcher();

    const rarityColor = (item: Item) => {
        if (!item) return "";
        const rarity = item.rarity;
        switch (rarity) {
            case Rarity.Normal:
                return "!bg-surface-200";
            case Rarity.Magic:
                return "!bg-blue-300";
            case Rarity.Rare:
                return "!bg-yellow-400";
            case Rarity.Unique:
                return "!bg-orange-500";
        }
    }

    let isSelected = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={rarityColor(item) + " card " + " " + height + " " + width +
            (item ? " cursor-pointer" : "") + (isSelected ? " border-2 border-green-500 shadow-green-500 shadow-inner" : "")} 
    use:popup={{
    event: 'hover',
    target: "popup" + (item?.id ?? -1),
    placement: 'left',
}} on:click={() => {
    dispatch("itemSelected", item);
    isSelected = !isSelected;
}}>
    {#if item}
        <div class="flex flex-col w-full h-full">
            <img src={item.image_path} alt={item.name} class="w-full h-full object-contain"/>
        </div>
    {:else}
        <div></div>
    {/if}
</div>

<div data-popup={"popup" + (item?.id ?? 0)}>
    <div class="card p-4 w-72 bg-surface-200 z-20">
        {#if item}
            <div class={"flex flex-col " + (item.affixes.length > 0 ? "mb-2 border-b-2 pb-2" : "")}>
                <div>{item.name}</div>
                <div>Item Level {item.level}</div>
                {#if item.implicit}
                    <div>{item.implicit.friendlyName(0)}</div>
                {/if}
                {#if item.evasion > 0}
                    <div>Evasion: {Math.round(item.evasion * 100) / 100} ({Math.round(item.baseEvasion * 100) / 100})</div>
                {/if}

                {#if item.armor > 0}
                    <div>Armor: {Math.round(item.armor * 100) / 100} ({Math.round(item.baseArmor * 100) / 100})</div>
                {/if}

                {#if item.energyShield > 0}
                    <div>Energy Shield: {Math.round(item.energyShield * 100) / 100} ({Math.round(item.baseEnergyShield * 100) / 100})</div>
                {/if}

                {#if isWeapon(item.type)}
                    {#if item.damage.getDamage(DamageType.PHYSICAL) > 0}
                        <div>Physical Attack: {Math.round(item.damage.getDamage(DamageType.PHYSICAL) * 10)/10}</div>
                    {/if}
                    {#if item.damage.getDamage(DamageType.FIRE) > 0}
                        <div>Fire Attack: {Math.round(item.damage.getDamage(DamageType.FIRE) * 10)/10}</div>
                    {/if}
                    {#if item.damage.getDamage(DamageType.COLD) > 0}
                        <div>Cold Attack: {Math.round(item.damage.getDamage(DamageType.COLD) * 10)/10}</div>
                    {/if}
                    {#if item.damage.getDamage(DamageType.LIGHTNING) > 0}
                        <div>Lightning Attack: {Math.round(item.damage.getDamage(DamageType.LIGHTNING) * 10)/10}</div>
                    {/if}
                    {#if item.damage.getDamage(DamageType.CHAOS) > 0}
                        <div>Chaos Attack: {Math.round(item.damage.getDamage(DamageType.CHAOS) * 10)/10}</div>
                    {/if}

                    <div>Attacks per second {Math.round(10000 / item.attackSpeed) / 10}</div>

                    <div>Critical Hit Chance {Math.round(item.criticalHitChance * 1000)/10}%</div>
                {/if}
            </div>
            

            <div class="flex flex-col">
                {#each item.affixes as affix}
                    <div>{affix.friendlyName(affix.tier)} | {affix.tier}</div>
                {/each}
            </div>
        {/if}
    </div>
</div>
