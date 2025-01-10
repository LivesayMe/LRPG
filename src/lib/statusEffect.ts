import { Entity } from "./entity";

let statusEffectCount = 0;
export class StatusEffect {
    id: number = statusEffectCount++;
    name: string;
    duration: number;

    durationRemaining: number;
    timeSinceLastEvent: number = 0;
    memory: any = {};

    effect: Array<(entity: Entity, deltaTime: number, memory?: any, showMessage?: boolean) => any> = [];

    /**
     * Functions to run when the status effect is removed, private. Should not be called directly, call onRemoved instead.
     */
    onRemove: Array<(entity: Entity, memory?: any) => void> = [];
    onEntityDeath: Array<(entity: Entity, memory?: any) => void> = [];

    constructor(args: { name: string; duration: number; effect?: Array<(entity: Entity, deltaTime: number, showMessage?: boolean) => void>, onRemove?: Array<(entity: Entity, memory?: any) => void>, onEntityDeath?: Array<(entity: Entity, memory?: any) => void>}) {
        this.name = args.name;
        this.duration = args.duration;
        this.durationRemaining = this.duration;
        this.effect = args.effect ?? [];
        this.onRemove = args.onRemove ?? [];
        this.onEntityDeath = args.onEntityDeath ?? [];
    }

    entityDied(entity: Entity) {
        this.onEntityDeath.forEach((effect) => effect(entity, this.memory));
    }

    tick(entity: Entity, deltaTime: number) {
        this.durationRemaining -= deltaTime;
        this.timeSinceLastEvent += deltaTime;
        const showMessage = this.timeSinceLastEvent > 1000;
        if (showMessage) {
            this.timeSinceLastEvent = 0;
        }
        if (this.durationRemaining < 0) {
            this.effect.forEach((effect) => {
                const newMemory = effect(entity, deltaTime + this.durationRemaining, this.memory, showMessage);
                if (newMemory == null) return;
                this.memory = {
                    ...this.memory,
                    ...newMemory
                }
            }); // Run the effect for the remaining duration
            this.onRemove.forEach((effect) => effect(entity, this.memory));
        } else {
            this.effect.forEach((effect) => {
                const newMemory = effect(entity, deltaTime, this.memory, showMessage)
                if (newMemory == null) return;
                this.memory = {
                    ...this.memory,
                    ...newMemory
                }
            });
        }
    }

    onRemoved(entity: Entity) {
        this.onRemove.forEach((effect) => effect(entity, this.memory));
    }
}