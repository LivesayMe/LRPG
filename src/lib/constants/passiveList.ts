import { Player } from "../player";
import { Passive } from "../passive";
import { PassiveNode } from "../passiveNode";

function createPassiveWheel(passives: Passive[]): PassiveNode[] {
    let passiveNodes: PassiveNode[] = [];
    for (let i = 0; i < passives.length; i++) {
        let adjacentNodes: number[] = [];
        if (i > 0) {
            adjacentNodes.push(passiveNodes.at(-1)?.passive.id ?? 0);
        }
        passiveNodes.push(new PassiveNode(passives[i], adjacentNodes, [0, i*10]));
    }

    return passiveNodes;
}

const esWheel = createPassiveWheel([
    new Passive("Energy Shield", "+30 Max Energy Shield", (player: Player) => {player.maxEnergyShield += 30}, 0),
    new Passive("Energy Shield", "+30 Max Energy Shield", (player: Player) => {player.maxEnergyShield += 30}, 0),
    new Passive("Energy Shield", "%30 Increased Max Energy Shield", (player: Player) => {player.maxEnergyShield *= 1.3}, 1)
])

const evasionWheel = createPassiveWheel([
    new Passive("Evasion","+30 Evasion Rating",  (player: Player) => {player.evasion += 30}, 0),
    new Passive("Evasion", "+30 Evasion Rating", (player: Player) => {player.evasion += 30}, 0),
    new Passive("Evasion", "%30 Increased Evasion Rating", (player: Player) => {player.evasion *= 1.3}, 1)
]);

// const fireWheel = createPassiveWheel([
//     new Passive("%30 Increased Damage", "Fire Damage", (player: Player) => {player.fireDamage += 30}, 0),
// ]);

const wheels = [esWheel, evasionWheel];

export { wheels };