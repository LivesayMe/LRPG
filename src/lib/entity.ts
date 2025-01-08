import { Damage, DamageType } from "./damage";
import { Skill } from "./skill";
let entityCount = 0;

class Entity {
    id: number;
    name: string;
    
    maxHealth: number;
    health: number;

    energyShield: number;
    maxEnergyShield: number;

    energyShieldRegen: number = 0;
    energyShieldRegenCooldown: number = 2000;

    armor: number;
    evasion: number;

    fireResistance: number;
    coldResistance: number;
    lightningResistance: number;
    chaosResistance: number;

    accuracyRating: number;
    incCriticalHitChance: number = 1;
    criticalHitMultiplier: number = 2;

    level: number = 1;

    mainSkill: Skill;

    // Simulation stuff
    timeSinceLastAttack: number = 0;
    timeSinceLastDamage: number = 0;
    mostRecentDamage: Damage;
    eventDisplayQueue: { message: string; color: string }[] = [];
    isDowned: boolean = false;

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

        this.fireResistance = args.fireResistance ?? 0;
        this.coldResistance = args.coldResistance ?? 0;
        this.lightningResistance = args.lightningResistance ?? 0;
        this.chaosResistance = args.chaosResistance ?? 0;

        this.level = args.level ?? 1;

        this.accuracyRating = args.accuracyRating ?? 100;
        this.mainSkill = args.mainSkill ?? new Skill(
            "Default", 
            "", 
            (initiator, target) => new Damage({initiator: initiator, target: target, type: DamageType.PHYSICAL, amount: 0 }), 
            () => 1000
        );

        this.id = entityCount++;
        this.energyShieldRegen = this.maxEnergyShield / 10;
    }

    fullHeal() {
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

        this.fireResistance = 0;
        this.coldResistance = 0;
        this.lightningResistance = 0;
        this.chaosResistance = 0;

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
                    const firePen = damage.penetration.find((p) => p.type == DamageType.FIRE);
                    let res = this.fireResistance;
                    if (firePen != null)
                        res -= firePen.amount;
                    this.applyDamage(d.amount * (1 - res / 100));
                    break;
                case DamageType.COLD:
                    res = this.coldResistance;
                    const coldPen = damage.penetration.find((p) => p.type == DamageType.COLD);
                    if (coldPen != null)
                        res -= coldPen.amount;
                    this.applyDamage(d.amount * (1 - res / 100));
                    break;
                case DamageType.LIGHTNING:
                    res = this.lightningResistance;
                    const lightningPen = damage.penetration.find((p) => p.type == DamageType.LIGHTNING);
                    if (lightningPen != null)
                        res -= lightningPen.amount;
                    this.applyDamage(d.amount * (1 - res / 100));
                    break;
                case DamageType.CHAOS:
                    res = this.chaosResistance;
                    const chaosPen = damage.penetration.find((p) => p.type == DamageType.CHAOS);
                    if (chaosPen != null)
                        res -= chaosPen.amount;
                    this.applyDamage(d.amount * (1 - res / 100));
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
            }
        }

        this.timeSinceLastDamage = 0;
    }

    getAttackSpeed() {
        return 1000;
    }

    getAttackDamage() {
        return new Damage({
            type: DamageType.PHYSICAL,
            amount: 5,
        })
    }

    attack(target: Entity): Damage | null {
        const damage: Damage | null = this.mainSkill.attack(this, target);
        if (damage != null)
            target.damage(damage);

        return damage;
    }
}

export { Entity };