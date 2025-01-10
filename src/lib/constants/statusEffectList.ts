import { Damage, DamageType } from "../damage";
import { Entity } from "../entity";
import { StatusEffect } from "../statusEffect";

const ignite = (magnitude: Damage) => new StatusEffect({
    name: "Ignite",
    duration: 5000,
    effect: [(entity: Entity, deltaTime: number, memory?: any, showMessage?: boolean) => {
        const damageAmount = magnitude.dealt.find(d => d.type == DamageType.FIRE)?.amount ?? 0;
        const scaledAmount = damageAmount * (deltaTime / 1000);
        entity.damage(
            new Damage({
                type: DamageType.FIRE, 
                amount: scaledAmount
            })
        )

        if (showMessage) {
            entity.eventDisplayQueue.push({
                message: "Ignite " + damageAmount,
                color: "red"
            })
        }

        return {"magnitude": scaledAmount};
    }],
})

const chill = (magnitude: Damage) => new StatusEffect({
    name: "Chill",
    duration: 5000,
    effect: [(entity: Entity, deltaTime: number, memory: any, showMessage?: boolean) => {
        if (memory && memory.applied) return;
        const amplitude = magnitude.dealt.find(d => d.type == DamageType.COLD)?.amount ?? 0;
        const relativeAmplitude = Math.min(1, amplitude / entity.maxHealth);
        const reduction = .8 * (1-Math.exp(-5*relativeAmplitude));
        entity.actionSpeed += reduction; 
        return {"chillAmount": reduction, "applied": true, "magnitude": amplitude};
    }],
    onRemove: [(entity: Entity, memory: any) => {
        entity.actionSpeed -= memory.chillAmount;
    }]
})

export { ignite, chill };