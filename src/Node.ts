export interface ConnectionIN {
  node: Node;
}

export interface ConnectionOUT {
  node: Node;
  distance: number;
}

export enum CONNECTION_TYPE {
  OUT, IN
}

export default
class Node {

  static MINIMAL_DISTANCE = 1;

  place: number;
  activity: number = 0;
  connectionsIN: ConnectionIN[] = [];
  connectionsOUT: ConnectionOUT[] = [];

  constructor(place: number) {
    this.place = place;
  }

  addConnection(type: CONNECTION_TYPE, node: Node) {
    if (type === CONNECTION_TYPE.IN) {
      this.connectionsIN.push({
        node,
      });
    } else {
      const distance = Math.abs(node.place - this.place);

      this.connectionsOUT.push({
        node,
        distance: distance || Node.MINIMAL_DISTANCE,
      });
    }
  }
}