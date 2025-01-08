import { Entity } from "./entity";
import { meleeSkills, Skill } from "./skill";
import { Damage, DamageType } from "./damage";

class Enemy extends Entity {
    constructor(args: {
        name?: string;
        maxHealth?: number;
        maxEnergyShield?: number;
        armor?: number;
        evasion?: number;
        fireResistance?: number;
        coldResistance?: number;
        lightningResistance?: number;
        chaosResistance?: number;
        level?: number;
        mainSkill?: Skill;
        accuracyRating?: number;
    }) {
        super(args);
    }

    getAttackDamage() {
        return new Damage({
            type: DamageType.PHYSICAL,
            amount: 5 * this.level,
        })
    }
}


const enemyNames = ["Monkey", "Sanji", "Roronoa", "Shanks", "Nami", "Brook"];
function generateEnemy(level: number): Enemy {
    const randomName = enemyNames[Math.floor(Math.random() * enemyNames.length)];
    return new Enemy({
        name: randomName, 
        level: level,
        maxHealth: 100 + level * 10,
        mainSkill: meleeSkills[Math.floor(Math.random() * meleeSkills.length)]
    });
}

export { generateEnemy, Enemy };