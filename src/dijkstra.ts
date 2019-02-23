import DataNode from "./DataNode";
import Node from "./Node";

/**
 * Finds closes path
 * @param startNode 
 * @param valueToFind 
 * @returns  

/**
 * Starts node
 * @param startNode 
 * @param valueToFind 
 * @returns  

/**
 * Starts node
 * @param startNode 
 * @param valueToFind 
 * @returns  
 */
export default function findClosesPath(startNode: Node, valueToFind: number): [Node[], number] {
  /**
   * If found is true - stop searching
   */
  let found = false;

  /**
   * Current node we visit
   */
  let currentNode: Node | DataNode;

  /**
   * A Node we need to find
   */
  let foundedNode: Node | DataNode;

  /**
   * Stores path
   * ? currentNode -> connection.node
   */
  const path = new Map<Node, Node>();

  /**
   * Map to keep track of distances
   */
  const nodeToNodeDistance = new Map<Node, number>();

  /**
   * Aray to keep track of visited nodes
   */
  const visited: Node[] = [];

  nodeToNodeDistance.set(startNode, 0);

  // ! Use Heap

  /**
   * Gets closest and not visited node
   * @param nodeToNodeDistance array of distances
   * @returns node
   */
  function getClosest(nodeToNodeDistance: Map<Node, number>) {
    const values = [...nodeToNodeDistance.entries()]
      .filter(nodeDistance => !visited.includes(nodeDistance[0]))
      .sort((a, b) => a[1] - b[1]);

    if (values.length) {
      return values[0][0];
    } else {
      throw new Error("I don`t know what to do. Check if the value exists");
    }
  }

  while (!found) {
    currentNode = getClosest(nodeToNodeDistance);

    found =
      currentNode instanceof DataNode &&
      currentNode !== startNode && // * Should be the input node. They can have identical values
      currentNode.data === valueToFind;

    if (found) {
      foundedNode = currentNode;
      break;
    }

    currentNode.connectionsOUT.forEach(connection => {
      // * If we don't have distance yet - it will be seted to Inifinity
      const distance = nodeToNodeDistance.has(connection.node)
        ? nodeToNodeDistance.get(connection.node)!
        : Infinity;

      // * Possible new distance
      const possibleDistance =
        connection.distance +
        (nodeToNodeDistance.has(currentNode)
          ? nodeToNodeDistance.get(currentNode)!
          : Infinity);

      // * Set new distance if it's shorter
      if (possibleDistance < distance) {
        // ? currentNode -> connection.node
        path.set(connection.node, currentNode);
        nodeToNodeDistance.set(connection.node, possibleDistance);
      }
    });

    visited.push(currentNode);
  }

  const result = [];

  // * Traverse from end to start and return the result
  for (let node = currentNode!; path.has(node); node = path.get(node)!) {
    result.push(path.get(node)!);
  }

  // * Adds founded node to the start(end of the path) of the array
  result.unshift(foundedNode!);

  // * From start to end
  return [result.reverse(), nodeToNodeDistance.get(currentNode!)!];
}
