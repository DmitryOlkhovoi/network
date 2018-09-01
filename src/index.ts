// !DDR_E?
import Network from "./Network";
import Node from "./Node";
import DataNode from "./DataNode";

const input = [1, 3, 10, 0, 5, 6, 4, 8, 9, 2]
const output = [1, 2, 3, 4]
const network = new Network();

network.addDataLayer(input);
network.addHiddenLayer(1000);
network.addHiddenLayer(400);
network.addHiddenLayer(200);
network.addHiddenLayer(120);
network.addHiddenLayer(40);
network.addDataLayer(output);

// TODO Fill in data
// TODO Set output data
// TODO Find closest path from input to output data
// TODO Shoter the distance
// TODO Signal

// ? Power of a signal will be depends on a distance to an output node

// * Find path
let found = false;
let currentNode: Node | DataNode;

const path = new Map<Node, Node>();
const nodeToNodeDistance = new Map<Node, number>();
const visited: Node[] = [];
const valueToFind = 2;

const startNode = network.layers[0].nodes[9];

nodeToNodeDistance.set(startNode, 0);

function getClosest(nodeToNodeDistance: Map<Node, number>) {
  const values = [...nodeToNodeDistance.entries()]
    .filter((nodeDistance) => !visited.includes(nodeDistance[0]))
    .sort((a, b) => a[1] - b[1]);

    if (values.length) {
      return values[0][0]
    } else {
      throw new Error('I don`t know what to do');
    }
}

while(!found) {
  currentNode = getClosest(nodeToNodeDistance);

  found = currentNode instanceof DataNode && currentNode !== startNode && currentNode.data === valueToFind;

  if (found) {
    break;
  }

  currentNode.connectionsOUT.forEach((connection) => {
    const distance = nodeToNodeDistance.has(connection.node) ? nodeToNodeDistance.get(connection.node)! : Infinity;
    const possibleDistance = connection.distance +
      (nodeToNodeDistance.has(currentNode) ? nodeToNodeDistance.get(currentNode)! : Infinity);

    if (possibleDistance < distance) {
      path.set(connection.node, currentNode);
      nodeToNodeDistance.set(connection.node, possibleDistance);
    }
  });

  visited.push(currentNode);
}

function printPath(node: Node): Node | undefined {
  console.log(node);
  if (path.has(node)) {
    return printPath(path.get(node)!);
  }
}

printPath(currentNode!);

console.log('FUCK yeah', visited.length)