import { Player } from "./player";
import { wheels } from "./constants/passiveList";
import { Passive } from "./passive";
import { PassiveNode } from "./passiveNode";

class PassiveTree {
    nodes: PassiveNode[];

    constructor(nodes: PassiveNode[]) {
        this.nodes = nodes;
    }

    getAvailableNodes(): PassiveNode[] {
        return this.nodes.filter(node => this.isNodeAvailable(node));
    }

    isNodeAvailable(node: PassiveNode): boolean {
        // The node is not taken and at least one adjacent node is taken
        return !node.isTaken && node.adjacentNodes.some(adjacentNode => this.nodes[adjacentNode].isTaken);
    }

    takePassive(player: Player, node: PassiveNode): void {
        node.isTaken = true;
        player.playerEffects.push({effect: node.passive.effect, id: node.passive.id, priority: node.passive.priority});
        player.applyItems();
    }   
}

const treePositionPadding = 2;
function createPassiveTree(): PassiveTree {
    let passiveNodes: PassiveNode[] = [];
    const treeLength = Math.floor(wheels.length / 2);
    
    passiveNodes.push(new PassiveNode(new Passive(
        "Base",
        "The start of a new adventure",
        (player: Player) => {},
        0
    ), [], [20, 0]));
    passiveNodes.at(-1)!.isTaken = true;
    const baseId = passiveNodes.at(-1)!.passive.id;

    for (let i = 0; i < treeLength; i++) {
        passiveNodes.push(new PassiveNode(new Passive(
            "Strength",
            "+10 Strength",
            (player: Player) => {player.strength += 10},
            0
        ), [baseId], [20, i*10 + 10]));

        const wheel1 = wheels[i*2 + 0];
        const wheel2 = wheels[i*2 + 1];
        const basePassive = passiveNodes.at(-1)!;
        basePassive.adjacentNodes.push(wheel1.at(0)!.passive.id);
        basePassive.adjacentNodes.push(wheel2.at(0)!.passive.id);

        wheel1.forEach((node) => {node.position[0] = 0; node.position[1] = i*10 + 10;});
        wheel2.forEach((node) => {node.position[0] = 40; node.position[1] = i*10 + 10;});

        passiveNodes = passiveNodes.concat(wheel1);
        passiveNodes = passiveNodes.concat(wheel2);

    }

    passiveNodes.forEach(node => node.position[0] += treePositionPadding);
    passiveNodes.forEach(node => node.position[1] += treePositionPadding);

    return new PassiveTree(passiveNodes);
}

export { PassiveTree, createPassiveTree };