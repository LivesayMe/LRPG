import { Entity } from "./entity";
import { Damage, DamageType } from "./damage";

class Skill {
    name: string;
    level: number;
    description: string;
    attack: (initiator: Entity, target: Entity) => Damage | null;
    attackSpeed: (initiator: Entity) => number;

    constructor(name: string, description: string, attack: (initiator: Entity, target: Entity) => Damage, attackSpeed: (initiator: Entity) => number) {
        this.name = name;
        this.level = 1;
        this.description = description;
        this.attack = (initiator, target) => {
            if (isHit(initiator, target)) {
                return attack(initiator, target);
            } else {
                return null;
            }
        }
        this.attackSpeed = attackSpeed;
    }
}

const isHit = (initiator: Entity, target: Entity) => {
    return Math.random() < target.getEvasionChance(initiator.accuracyRating);
}

const meleeSkills = [
    new Skill(
        "Basic Attack",
        "A basic melee attack.",
        (initiator, target) => {
            return new Damage({
                type: DamageType.PHYSICAL,
                amount: initiator.level * 5,
                initiator: initiator,
                target: target,
            });
        },
        (initiator) => {
            return initiator.getAttackSpeed() * 1.35;
        }
    )
]

export { Skill, meleeSkills };