import { meleeSkills } from "./constants/skillList";
import { Damage, DamageType } from "./damage";
import { Skill } from "./skill";
import { StatusEffect } from "./statusEffect";
let entityCount = 0;

class Entity {
    id: number;
    name: string;
    
    maxHealth: number;
    health: number;

    energyShield: number;
    maxEnergyShield: number;

    energyShieldRegen: number = 0;
    energyShieldRegenCooldown: number = 2000; // MS

    armor: number;
    evasion: number;

    resistance: {[key in DamageType]: number} = {
        [DamageType.PHYSICAL]: 0,
        [DamageType.FIRE]: 0,
        [DamageType.COLD]: 0,
        [DamageType.LIGHTNING]: 0,
        [DamageType.CHAOS]: 0
    }

    accuracyRating: number;
    incCriticalHitChance: number = 1; //100% of base
    criticalHitMultiplier: number = 2;

    level: number = 1;

    mainSkill: Skill;

    statusEffects: StatusEffect[] = [];

    actionSpeed: number = 1.0;

    // Simulation stuff
    timeSinceLastAttack: number = 0;
    timeSinceLastDamage: number = 0;
    mostRecentDamage: Damage;
    eventDisplayQueue: { message: string; color: string }[] = [];
    isDowned: boolean = false;
    position: number = 0;

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
        accuracyRating?: number;
        mainSkill?: Skill;
    }) {
        this.name = args.name ?? "Entity";
        this.maxHealth = args.maxHealth ?? 100;
        this.health = this.maxHealth;
        
        this.maxEnergyShield = args.maxEnergyShield ?? 0;
        this.energyShield = this.maxEnergyShield;

        this.armor = args.armor ?? 0;
        this.evasion = args.evasion ?? 0;

        this.resistance[DamageType.FIRE] = args.fireResistance ?? 0;
        this.resistance[DamageType.COLD] = args.coldResistance ?? 0;
        this.resistance[DamageType.LIGHTNING] = args.lightningResistance ?? 0;
        this.resistance[DamageType.CHAOS] = args.chaosResistance ?? 0;

        this.level = args.level ?? 1;

        this.accuracyRating = args.accuracyRating ?? 100;
        this.mainSkill = args.mainSkill ?? meleeSkills[0];

        this.id = entityCount++;
        this.energyShieldRegen = this.maxEnergyShield / 10;
    }

    clearStatusEffects() {
        this.statusEffects.forEach((effect) => effect.onRemoved(this));
        this.statusEffects = [];
    }

    fullHeal() {
        this.clearStatusEffects();
        this.isDowned = false;
        this.energyShield = this.maxEnergyShield;
        this.health = this.maxHealth;
    }

    resetStats() {
        this.maxHealth = 100;
        this.health = this.maxHealth;

        this.maxEnergyShield = 0;
        this.energyShield = this.maxEnergyShield;

        this.armor = 0;
        this.evasion = 0;

        this.resistance = {
            [DamageType.PHYSICAL]: 0,
            [DamageType.FIRE]: 0,
            [DamageType.COLD]: 0,
            [DamageType.LIGHTNING]: 0,
            [DamageType.CHAOS]: 0
        }

        this.accuracyRating = 100;

        this.energyShieldRegen = this.maxEnergyShield / 10;
    }

    getArmorMitigation(hit: number) {
        return this.armor / (this.armor + hit * 5);
    }

    getEvasionChance(attackerAccuracy: number) {
        // console.log(this.name, attackerAccuracy, this.evasion, Math.max(0, Math.min(1, .5 + Math.log(attackerAccuracy / Math.max(.0001, this.evasion)))));
        return Math.max(0, Math.min(1, .5 + Math.log(attackerAccuracy / Math.max(.0001, Math.pow(this.evasion, .8)))));
    }

    damage(damage: Damage) {
        damage.dealt.forEach((d) => {
            switch (d.type) {
                case DamageType.PHYSICAL:
                    let physResist = this.getArmorMitigation(d.amount);
                    const physPen = damage.penetration.find((p) => p.type == DamageType.PHYSICAL);
                    if (physPen != null)
                        physResist -= physPen.amount;
                    this.applyDamage(d.amount * (1 - physResist));
                    break;
                case DamageType.FIRE:
                case DamageType.COLD:
                case DamageType.LIGHTNING:
                case DamageType.CHAOS:
                    let resist = this.resistance[d.type];
                    const pen = damage.penetration.find((p) => p.type == d.type);
                    if (pen != null)
                        resist -= pen.amount;
                    resist = Math.min(1, resist); // Prevent healing from taking damage
                    this.applyDamage(d.amount * (1 - resist));  
                    break;
            }
        });
    }

    applyDamage(damage: number, isChaos: boolean = false) {
        if (this.energyShield > 0 && !isChaos) { // Chaos damage bypasses energy shield
            if (damage > this.energyShield) {
                this.health -= damage - this.energyShield;
                this.energyShield = 0;
            } else {
                this.energyShield -= damage;
            }
        } else {
            this.health -= damage;
            if (this.health <= 0) {
                this.health = 0;
                this.isDowned = true;
                this.die();
            }
        }

        this.timeSinceLastDamage = 0;

        this.energyShield = Math.min(this.energyShield, this.maxEnergyShield); // Sanity check
    }

    die() {
        this.statusEffects.forEach((effect) => effect.entityDied(this));
    }

    getAttackSpeed() {
        return 1000 * this.actionSpeed;
    }

    getAttackDamage() {
        return new Damage({
            type: DamageType.PHYSICAL,
            amount: 5,
        })
    }

    attack(target: Entity, allEnemies: Entity[], allAllies: Entity[]): Damage[] | null {
        const damage: Damage[] | null = this.mainSkill.attack(this, target, allEnemies, allAllies);
        if (damage != null) {
            damage.forEach((d) => {
                if (!d.target) {
                    target.damage(d);
                } else {
                    d.target?.damage(d);
                }
            })
        }

        return damage;
    }

    tick(deltaTime: number) {
        this.timeSinceLastAttack += deltaTime;
        this.timeSinceLastDamage += deltaTime;
        if (this.timeSinceLastDamage > this.energyShieldRegenCooldown) {
            this.energyShield = Math.min(this.energyShield + this.energyShieldRegen * (deltaTime / 1000), this.maxEnergyShield);
        }

        this.statusEffects.forEach((effect) => {
            effect.tick(this, deltaTime);
        });

        this.statusEffects = this.statusEffects.filter((effect) => effect.durationRemaining > 0);
    }
}

export { Entity };