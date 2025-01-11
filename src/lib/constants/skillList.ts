import { Skill } from "../skill";
import { Damage, DamageType } from "../damage";
import { ItemType, meleeWeapons } from "../item";
import { StatusEffect } from "../statusEffect";
import { ignite, chill } from "./statusEffectList";
import { Entity } from "../entity";





const meleeSkills = [
    new Skill({
        name: "Basic Attack",
        description: "Swings your weapon at the target. Attacks 35% faster than base.",
        attack: (initiator, target) => {
            const baseDamage = initiator.getAttackDamage();
            return [new Damage({
                dealt: baseDamage.dealt,
                initiator: initiator,
                target: target,
            })];
        },
        attackSpeed: (initiator) => {
            return initiator.getAttackSpeed() * .75;
        },
        dps: (initiator, attackSpeed) => {
            return initiator.getAttackDamage().dealt.reduce((total, damage) => total + damage.amount, 0) * (1000 / attackSpeed);
        },
        weaponRequirement: meleeWeapons
    }),
    new Skill({
        name: "Cleave",
        description: "Swings your weapon at the target. Adjacent enemies take 50% damage. Attacks 85% of base speed.",
        attack: (initiator, target, allEnemies) => {
            const baseDamage = initiator.getAttackDamage();

            allEnemies?.sort((a, b) => a.position - b.position)
            const targetIndex = allEnemies?.findIndex(e => e.id == target.id)


            if (targetIndex == null || allEnemies == null) {
                return [new Damage({
                    dealt: baseDamage.dealt,
                    initiator: initiator,
                    target: target,
                })] 
            } else if(targetIndex != null && allEnemies != null) { //Not necessary, but it keeps typescript happy

                const adjacentDamageLeft = targetIndex == 0 ? null : new Damage({
                    dealt: baseDamage.dealt.map(d => ({ type: d.type, amount: d.amount / 2 })),
                    initiator: initiator,
                    target: allEnemies[targetIndex - 1]
                })

                const adjacentDamageRight = targetIndex == allEnemies.length - 1 ? null : new Damage({
                    dealt: baseDamage.dealt.map(d => ({ type: d.type, amount: d.amount / 2 })),
                    initiator: initiator,
                    target: allEnemies[targetIndex + 1]
                })

                return [new Damage({
                    dealt: baseDamage.dealt,
                    initiator: initiator,
                    target: target,
                }), adjacentDamageLeft, adjacentDamageRight].filter(d => d != null)
            }
            return null;
        },
        attackSpeed: (initiator) => {
            return initiator.getAttackSpeed() * 1.25;
        },
        dps: (initiator, attackSpeed) => {
            return initiator.getAttackDamage().dealt.reduce((total, damage) => total + damage.amount, 0) * (1000 / attackSpeed);
        },
        weaponRequirement: meleeWeapons
    }),
    new Skill({
        name: "Fire Strike",
        description: "Swings your weapon at the target, imbuing your weapon with fire and igniting the enemy. 50% of non fire damage is converted to fire. 20% increased fire damage.",
        attack: (initiator, target) => {
            const baseDamage = initiator.getAttackDamage();
            //Convert to fire
            let nonFirePool = 0;
            for (let i = 0; i < baseDamage.dealt.length; i++) {
                if (baseDamage.dealt[i].type != DamageType.FIRE) {
                    nonFirePool += baseDamage.dealt[i].amount * 0.5;
                    baseDamage.dealt[i].amount *= 0.5;
                }
            }

            let addedFireDamage = false;
            for (let i = 0; i < baseDamage.penetration.length; i++) {
                if (baseDamage.dealt[i].type == DamageType.FIRE) {
                    baseDamage.dealt[i].amount += nonFirePool;
                    baseDamage.dealt[i].amount *= 1.2;
                    addedFireDamage = true;
                    break;
                }
            }
            if (!addedFireDamage) {
                baseDamage.dealt.push({ type: DamageType.FIRE, amount: nonFirePool * 1.2 });
            }

            //If the target already has an ignite then replace it
            for (let i = 0; i < target.statusEffects.length; i++) {
                if (target.statusEffects[i].name == "Ignite") {
                    target.statusEffects.splice(i, 1);
                    break;
                }
            }

            target.statusEffects.push(ignite(baseDamage));

            return [new Damage({
                dealt: baseDamage.dealt,
                initiator: initiator,
                target: target,
            })];
        },
        attackSpeed: (initiator) => {
            return initiator.getAttackSpeed();
        },
        dps: (initiator, attackSpeed) => {
            const baseDamage = initiator.getAttackDamage();
            //Convert to fire
            let nonFirePool = 0;
            for (let i = 0; i < baseDamage.dealt.length; i++) {
                if (baseDamage.dealt[i].type != DamageType.FIRE) {
                    nonFirePool += baseDamage.dealt[i].amount * 0.5;
                    baseDamage.dealt[i].amount *= 0.5;
                }
            }

            let fireDamage = 0;
            let addedFireDamage = false;
            for (let i = 0; i < baseDamage.penetration.length; i++) {
                if (baseDamage.dealt[i].type == DamageType.FIRE) {
                    baseDamage.dealt[i].amount += nonFirePool;
                    baseDamage.dealt[i].amount *= 1.2;
                    fireDamage = baseDamage.dealt[i].amount;
                    addedFireDamage = true;
                    break;
                }
            }
            if (!addedFireDamage) {
                baseDamage.dealt.push({ type: DamageType.FIRE, amount: nonFirePool * 1.2 });
                fireDamage = nonFirePool * 1.2;
            }

            const igniteDamagePerSecond = fireDamage;
            const nonIgniteDamagePerSecond = baseDamage.dealt.reduce((total, damage) => total + damage.amount, 0) * (1000 / attackSpeed);
            return igniteDamagePerSecond + nonIgniteDamagePerSecond;
        },
        weaponRequirement: [ItemType.Sword]
    }),
    new Skill({
        name: "Chilling Strike",
        description: "Swings your weapon at the target, imbuing your weapon with cold and chilling the enemy. 50% of non cold damage is converted to cold. 20% increased cold damage. If the target dies while under the effect of the chill they will shatter dealing 100% of attack damage to adjacent enemies and chilling them. Attacks 85% of base speed.",
        attack: (initiator, target, allEnemies) => {
            const baseDamage = initiator.getAttackDamage();
            //Convert to ice
            let nonIcePool = 0;
            for (let i = 0; i < baseDamage.dealt.length; i++) {
                if (baseDamage.dealt[i].type != DamageType.COLD) {
                    nonIcePool += baseDamage.dealt[i].amount * 0.5;
                    baseDamage.dealt[i].amount *= 0.5;
                }
            }

            let addedIceDamage = false;
            for (let i = 0; i < baseDamage.penetration.length; i++) {
                if (baseDamage.dealt[i].type == DamageType.COLD) {
                    baseDamage.dealt[i].amount += nonIcePool;
                    baseDamage.dealt[i].amount *= 1.2;
                    addedIceDamage = true;
                    break;
                }
            }
            if (!addedIceDamage) {
                baseDamage.dealt.push({ type: DamageType.COLD, amount: nonIcePool * 1.2 });
            }

            //If the target already has a chill then replace it
            for (let i = 0; i < target.statusEffects.length; i++) {
                if (target.statusEffects[i].name == "Chill") {
                    target.statusEffects[i].onRemoved(target);
                    target.statusEffects.splice(i, 1);
                    break;
                }
            }

            target.statusEffects.push(chill(baseDamage));

            if (allEnemies != null) {
                allEnemies.sort((a, b) => a.position - b.position)
                const targetIndex = allEnemies.findIndex(e => e.id == target.id)
                const enemyLeft = targetIndex == 0 ? null : allEnemies[targetIndex - 1]
                const enemyRight = targetIndex == allEnemies.length - 1 ? null : allEnemies[targetIndex + 1]

                let hasShatterEffect = false;
                for (let i = 0; i < target.statusEffects.length; i++) {
                    if (target.statusEffects[i].name == "Shatter") {
                        hasShatterEffect = true;
                        break;
                    }
                }
                const adjacentEnemies = [enemyLeft, enemyRight].filter(e => e != null);
                if (!hasShatterEffect) {
                    target.statusEffects.push(new StatusEffect({
                            name: "Shatter",
                            duration: 5000,
                            onEntityDeath: [(entity: Entity, memory: any) => {
                                adjacentEnemies.forEach(e => {
                                    if (e == null || e.isDowned) return;
                                    e.damage(new Damage({
                                        dealt: baseDamage.dealt,
                                        initiator: initiator,
                                        target: e,
                                    }));
                                    //If the enemy is already chilled then replace it
                                    for (let i = 0; i < e.statusEffects.length; i++) {
                                        if (e.statusEffects[i].name == "Chill") {
                                            e.statusEffects[i].onRemoved(e);
                                            e.statusEffects.splice(i, 1);
                                            break;
                                        }
                                    }
                                    e.statusEffects.push(chill(baseDamage));
                                })
                            }],
                    }));
                } else {
                    //Refresh duration
                    target.statusEffects[target.statusEffects.findIndex(e => e.name == "Shatter")].durationRemaining = 5000
                }
            }

            return [new Damage({
                dealt: baseDamage.dealt,
                initiator: initiator,
                target: target,
            })];
        },
        attackSpeed: (initiator) => {
            return initiator.getAttackSpeed() * 1.25;
        },
        dps: (initiator, attackSpeed) => {
            const baseDamage = initiator.getAttackDamage();
            //Convert to ice
            let nonIcePool = 0;
            for (let i = 0; i < baseDamage.dealt.length; i++) {
                if (baseDamage.dealt[i].type != DamageType.COLD) {
                    nonIcePool += baseDamage.dealt[i].amount * 0.5;
                    baseDamage.dealt[i].amount *= 0.5;
                }
            }

            let addedIceDamage = false;
            for (let i = 0; i < baseDamage.penetration.length; i++) {
                if (baseDamage.dealt[i].type == DamageType.COLD) {
                    baseDamage.dealt[i].amount += nonIcePool;
                    baseDamage.dealt[i].amount *= 1.2;
                    addedIceDamage = true;
                    break;
                }
            }
            if (!addedIceDamage) {
                baseDamage.dealt.push({ type: DamageType.COLD, amount: nonIcePool * 1.2 });
            }

            return baseDamage.dealt.reduce((total, damage) => total + damage.amount, 0) * (1000 / attackSpeed);
        },
        weaponRequirement: [ItemType.Sword]
    })
]


export { meleeSkills }