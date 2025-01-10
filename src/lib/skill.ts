import { Entity } from "./entity";
import { Damage, DamageType } from "./damage";
import { ItemType } from "./item";

class Skill {
    name: string;
    level: number;
    description: string;
    weaponRequirement: ItemType[] = [];
    attack: (initiator: Entity, target: Entity, allEnemies?: Entity[], allAllies?: Entity[]) => Damage[] | null;
    attackSpeed: (initiator: Entity) => number;
    dps: (initiator: Entity) => number;

    constructor({name, description, attack, attackSpeed, dps = () => 0, weaponRequirement = []}: {
        name: string;
        description: string;
        attack: (initiator: Entity, target: Entity, allEnemies?: Entity[], allAllies?: Entity[]) => Damage[] | null;
        attackSpeed: (initiator: Entity) => number;
        dps?: (initiator: Entity, attackSpeed: number) => number;
        weaponRequirement?: ItemType[];
    }) {
        this.name = name;
        this.level = 1;
        this.description = description;
        this.attack = (initiator, target, allEnemies, allAllies) => {
            if (isHit(initiator, target)) {
                return attack(initiator, target, allEnemies, allAllies);
            } else {
                return null;
            }
        }
        this.attackSpeed = attackSpeed;
        this.dps = (initiator: Entity) => dps(initiator, this.attackSpeed(initiator));
        this.weaponRequirement = weaponRequirement;
    }
}

const isHit = (initiator: Entity, target: Entity) => {
    return Math.random() < target.getEvasionChance(initiator.accuracyRating);
}

export { Skill };