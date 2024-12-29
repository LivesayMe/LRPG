<script lang="ts">
    import { onMount } from 'svelte';
    import { type Item, Rarity, ItemType } from '../item';
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';

    export let item: Item;

    export let height: string = "h-fit";
    export let width: string = "w-40";

    const rarityColor = (item: Item) => {
        if (!item) return "";
        const rarity = item.rarity;
        switch (rarity) {
            case Rarity.Normal:
                return "bg-surface-200";
            case Rarity.Magic:
                return "bg-surface-300";
            case Rarity.Rare:
                return "bg-surface-400";
            case Rarity.Unique:
                return "bg-surface-500";
        }
    }
</script>

<div class={rarityColor(item) + " card p-2" + " " + height + " " + width +
            (item ? " cursor-pointer" : "")} use:popup={{
    event: 'hover',
    target: "popup" + (item?.id ?? -1),
    placement: 'left',
}}>
    {#if item}
        <div class="flex flex-col">
            {item.name}
            {ItemType[item.type]}
        </div>
    {:else}
        <div></div>
    {/if}
</div>

<div data-popup={"popup" + (item?.id ?? 0)}>
    <div class="card p-4 w-72">
        {#if item}
            <div class="flex flex-col">
                {#if item.implicit}
                    <div>{item.implicit.friendlyName(0)}</div>
                {/if}
                {#if item.evasion > 0}
                    <div>Evasion: {item.evasion}</div>
                {/if}

                {#if item.armor > 0}
                    <div>Armor: {item.armor}</div>
                {/if}

                {#if item.energyShield > 0}
                    <div>Energy Shield: {item.energyShield}</div>
                {/if}

                {#if item.type == ItemType.Weapon}
                    {#if item.physicalAttack.max > 0}
                        <div>Physical Attack: {item.physicalAttack.min}-{item.physicalAttack.max}</div>
                    {/if}
                    {#if item.fireAttack.max > 0}
                        <div>Fire Attack: {item.fireAttack.min}-{item.fireAttack.max}</div>
                    {/if}
                    {#if item.coldAttack.max > 0}
                        <div>Cold Attack: {item.coldAttack.min}-{item.coldAttack.max}</div>
                    {/if}
                    {#if item.lightningAttack.max > 0}
                        <div>Lightning Attack: {item.lightningAttack.min}-{item.lightningAttack.max}</div>
                    {/if}
                    {#if item.chaosAttack.max > 0}
                        <div>Chaos Attack: {item.chaosAttack.min}-{item.chaosAttack.max}</div>
                    {/if}

                    <div>Attacks per second {item.baseAttackTime / item.attackSpeed}</div>
                {/if}
            </div>
            

            <div class="flex flex-col">
                {#each item.affixes as affix}
                    <div>{affix.friendlyName(affix.tier)}</div>
                {/each}
            </div>
        {/if}
    </div>
</div>
