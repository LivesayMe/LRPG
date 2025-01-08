import { Entity } from "./entity";

class Damage {
    dealt: {
        type: DamageType;
        amount: number;
    }[];
    initiator: Entity | null;
    target: Entity | null;
    penetration: {
        type: DamageType;
        amount: number;
    }[];

    constructor(args: {
        dealt?: Array<{ type: DamageType; amount: number }>;
        initiator?: Entity;
        target?: Entity;
        penetration?: Array<{ type: DamageType; amount: number }>;
        type?: DamageType;
        amount?: number;
        penType?: DamageType;
        penAmount?: number;
    }) {
        if (args.type != null && args.amount != null && args.dealt == null) {
            this.dealt = [{ type: args.type, amount: args.amount }];
        } else {
            this.dealt = args.dealt ?? [];
        }
        this.initiator = args.initiator ?? null;
        this.target = args.target ?? null;
        if (args.penType != null && args.penAmount != null && args.penetration == null) {
            this.penetration = [{ type: args.penType, amount: args.penAmount }];
        } else {
            this.penetration = args.penetration ?? [];
        }
    }

    getPrettyString(): string {
        let totalDamage = this.dealt.reduce((a, b) => a + b.amount, 0);
        return totalDamage.toString();
    }

    getDamage(type: DamageType) {
        return this.dealt.find((d) => d.type == type)?.amount ?? 0;
    }

    copy(): Damage {
        return new Damage({
            dealt: this.dealt.map((d) => ({ type: d.type, amount: d.amount })),
            penetration: this.penetration.map((p) => ({ type: p.type, amount: p.amount })),
        });
    }
}

enum DamageType {
    PHYSICAL,
    FIRE,
    COLD,
    LIGHTNING,
    CHAOS
}

export { Damage, DamageType };