import { Entity } from "./entity";
import { Skill } from "./skill";
import { Damage, DamageType } from "./damage";
import { meleeSkills } from "./constants/skillList";

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
function generateEnemy(level: number, position?: number): Enemy {
    const randomName = enemyNames[Math.floor(Math.random() * enemyNames.length)];
    const enemy = new Enemy({
        name: randomName, 
        level: level,
        maxHealth: 60 + level * 10,
        mainSkill: meleeSkills[Math.floor(Math.random() * meleeSkills.length)]
    });
    enemy.position = position ?? 0;
    return enemy;
}

export { generateEnemy, Enemy };