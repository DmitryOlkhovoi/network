export interface ConnectionIN {
  node: Node;
}

export interface ConnectionOUT {
  node: Node;
  distance: number;
}

// export enum CONNECTION_TYPE {
//   OUT, IN
// }

export default
class Node {

  place: number;
  connectionsIN: ConnectionIN[] = [];
  connectionsOUT: ConnectionOUT[] = [];

  hits: number = 0;

  constructor(place: number) {
    this.place = place;
  }

  connect(node: Node) {
    const distance = Math.abs(node.place - this.place);

    this.connectionsOUT.push({
      node,
      distance: distance + 1,
    })

    node.connectionsIN.push({
      node: this
    })
  }
}