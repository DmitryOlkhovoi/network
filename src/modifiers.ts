import Node from "./Node";


/**
 * Shorters distances in network
 * @param path 
 */
export function shorterDistanceIn(path: Node[]) {
  path.forEach((node, i) => {
    const tmpNode = path[i + 1];
    const connection = node.connectionsOUT.find(connection => {
      return connection.node === tmpNode;
    });

    if (!connection) {
      return;
    }

    connection.distance -= 0.01;
  });
}
