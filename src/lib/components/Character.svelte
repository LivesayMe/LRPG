<script>
    export let character;
    $: console.log(character);
</script>

{#if !character}    
    Loading
{:else}
    <div class="flex flex-col w-full">
        <div class="flex flex-col">
            <div>{character.name}</div>
            <div>{character.level}</div>
            <div>{character.class.name}</div>
        </div>

        <!-- Gear -->

    </div>
{/if}