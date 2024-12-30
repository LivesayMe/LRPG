<script lang="ts">
    import { Zone } from "../zone";
    export let zone: Zone;
</script>

<div class="flex flex-col gap-2">
    <div>{zone.name}</div>
    <div>Level {zone.level}</div>
    <div>{zone.exploration_status}</div>
</div>