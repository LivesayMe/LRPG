<script lang="ts">
    import { onMount } from 'svelte';
    import { type Item, Rarity, ItemType, Affix } from '../item';
    import { autoModeWatcher, popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';

    export let item: Item;

    export let height: string = "h-fit";
    export let width: string = "w-40";

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
                <div>{item.id}</div>
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

                    <div>Attacks per second {1000 / item.attackSpeed}</div>
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
