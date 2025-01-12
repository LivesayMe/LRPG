<script lang="ts">
    import { Entity } from "../entity";
    import { Damage } from "../damage";
    import { ConicGradient } from '@skeletonlabs/skeleton';
    import { fade, fly } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    export let entity: Entity;

    let attackTimerGradient = [{
        color: 'white',
        start: 0,
        end: (entity.timeSinceLastAttack / entity.getAttackSpeed()) * 100
    }]

    $: if (entity) {
        const timeRatio = entity.timeSinceLastAttack / entity.getAttackSpeed() * 100;
        attackTimerGradient = [{
            color: 'white',
            start: 0,
            end: timeRatio
        }, {
            color: 'rgb(var(--color-surface-500))',
            start: timeRatio,
            end: 100
        }]
    }

    let messageElements = [];
    let nextId = 0;
    let container: HTMLDivElement;
    let mostRecentId: number = 0;
    function showMessages(messages: { message: string; color: string }[]) {
        if (messages.length === 0) return;
        messages.forEach(message => {
            const rect = container.getBoundingClientRect();
            const x = rect.width / 2 + Math.random() * rect.width - rect.width / 2;
            const y = -1 * rect.height / 2
            messageElements = [...messageElements, 
            {
                id: nextId++, 
                x, 
                y, 
                ...message
            }];

            setTimeout(() => {
                if (nextId - 1 >= mostRecentId) {
                    mostRecentId = nextId - 1;
                    messageElements = messageElements.filter(m => m.id > mostRecentId);
                }
            }, 1500);
        });
        //Clear queue
        entity.eventDisplayQueue = [];
    }

    $: showMessages(entity.eventDisplayQueue);

    let attackTimeTooltip: HTMLDivElement;
    function popup(id: string) {
        console.log(id)
        if (attackTimeTooltip) {
            attackTimeTooltip.style.opacity = "1";
            attackTimeTooltip.style.display = "block";
        }
    }

    function closePopup() {
        if (attackTimeTooltip) {
            attackTimeTooltip.style.opacity = "0";
            attackTimeTooltip.style.display = "none";
        }
    }
</script>

<style>
    .damage-number {
        position: absolute;
        font-size: 24px;
        font-weight: bold;
        animation: flyFall 1.5s cubic-bezier(0.25, 1, 0.5, 1);
        pointer-events: none;
    }

    @keyframes flyFall {
        0% {
        transform: translateY(0);
        opacity: 1;
        }
        20% {
        transform: translateY(-50px); /* Fly up */
        }
        100% {
        transform: translateY(50px); /* Fall down */
        opacity: 0;
        }
    }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={"card p-2 w-52 gap-1 flex flex-col relative" + (entity.isDowned ? " !bg-surface-500" : "")} on:click={() => {console.log(entity);}} bind:this={container}>
    {#each messageElements as message}
        <div class="damage-number" style="left: {message.x}px; top: {message.y}px;">
            <div class="card p-2" style="background-color: {message.color}; color: {message.color === 'rgb(var(--color-surface-500))' ? 'white' : 'black'}">
                {message.message}
            </div>
        </div>
    {/each}

    <div class="flex flex-row justify-between">
        <span>
            {entity.name}
        </span>
        <div class="relative">
            <span class="flex flex-row gap-2 cursor-default z-20" on:mouseenter={() => popup("attackTimeTooltip" + (entity.id))} on:mouseleave={closePopup}>
                {entity.mainSkill.name}
                <ConicGradient stops={attackTimerGradient} width="w-6" height="h-6"/>
            </span>

            <div class="absolute opacity-0 -top-14 z-30 hidden w-32 " id="attackTimeTooltip{entity.id}" bind:this={attackTimeTooltip}>
                <div class="card p-2 w-full flex justify-center">
                    {Math.round(entity.getAttackSpeed() / 100) / 10}s / attack
                </div>
            </div>
        </div>
    </div>
    

    <div class="bg-red-500 justify-center flex" style="width: {entity.health / entity.maxHealth * 100}%">
        {Math.round(entity.health)}
    </div> 
    {#if entity.energyShield > 0}
        <div class="bg-blue-500 justify-center flex" style="width: {entity.energyShield / entity.maxEnergyShield * 100}%">
            {Math.round(entity.energyShield)}
        </div>
    {/if}

    <div class="flex flex-row gap-1">
        {#each entity.statusEffects as statusEffect}
            <div>{statusEffect.name}</div>
        {/each}
    </div>
</div>

