import Node from "./Node";

export default
class DataNode extends Node {
  data: number;

  constructor(index: number, data: number) {
    super(index);

    this.data = data;
  }

  isOutput() {
    return !!this.connectionsIN.length
  }
}