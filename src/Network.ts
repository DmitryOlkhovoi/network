import _ from 'underscore';
import Node from './Node';
import DataNode from './DataNode';
import findClosesPath from "./dijkstra";
import { shorterDistanceIn } from './modifiers';

export interface Layer {
  nodes: Node[],
}

/**
 * Network
 * 
 * Node index - [layer index]:[node index]. Index is value >=0, array index
 * 
 * ? Should signal depleting and be less affective on the distances?
 */
export default
class Network {
  
  layers: Layer[] = []

  /**
   * Adds layer to the current network and connects it to the prev one.
   * 
   * ! We can add the nodes one by one on creation - no need for extra loop
   * 
   * @param layer
   */
  private addLayer(layer: Layer) {
    if (this.layers.length) {
      const lastLayer = _.last(this.layers)!;

      lastLayer.nodes.forEach(node => {
        layer.nodes.forEach((nodeToConnect) => {
          node.connect(nodeToConnect);
        })
      });
    }

    this.layers.push(layer);
  }

  /**
   * Makes a layer with the Nodes
   * 
   * @param size A number of nodes
   */
  private makeHiddenLayer(size: number) {
    // ? Do it as optional params?
    if (size % 2) {
      throw new Error(':size should be even')
    }

    const lastLayer = _.last(this.layers);
    const startIndex = lastLayer ? (lastLayer.nodes.length - size) / 2 : 0

    const newLayer: Layer = {
      nodes: []
    };

    for (let i = startIndex; i < (size + startIndex); i += 1) {
      newLayer.nodes.push(new Node(i));
    }

    return newLayer;
  }

  /**
   * Makes a layer with the Nodes
   * 
   * @param size A number of nodes 
   * @param data A data for DataNodes
   */
  private makeDataLayer(size: number, data: number[]) {
    // ? Do it as optional params?
    if (size % 2) {
      throw new Error(':size should be even')
    }

    const lastLayer = _.last(this.layers);
    const startPlace = lastLayer ? (lastLayer.nodes.length - size) / 2 : 0

    const newLayer: Layer = {
      nodes: []
    };

    for (let place = startPlace, dataIndex = 0; place < (size + startPlace); place += 1, dataIndex += 1) {
      newLayer.nodes.push(new DataNode(place, data[dataIndex]));
    }

    return newLayer;
  }

  /**
   * Adds a layer with the Nodes
   * 
   * @param size A number of nodes
   */
  addHiddenLayer(size: number) {
    this.addLayer(this.makeHiddenLayer(size));
  }

  /**
   * Add a layer with the DataNodes
   * 
   * @param data A data for DataNodes
   * @param size A number of nodes
   */
  addDataLayer(data: number[], size: number = data.length) {
    this.addLayer(this.makeDataLayer(size, data));
  }

  fillInput(data: number[]) {
    const nodes = this.layers[0].nodes as DataNode[];

    nodes.forEach((node, i) => {
      node.data = data[i] || 0;
    });
  }

  train(outputValue: number, reverse = false) {
    const nodes = (reverse ? this.layers[0].nodes.reverse() : this.layers[0].nodes) as DataNode[];

    nodes.forEach(node => {
      if (!node.data) {
        return;
      }

      const [path] = findClosesPath(node, outputValue)

      shorterDistanceIn(
        path,
      );
    });
  }

  predict() {
    const inputNodes = this.layers[0].nodes as DataNode[];
    const outputNodes = this.layers[this.layers.length -1].nodes as DataNode[];

    inputNodes.forEach(inputNode => {
      if (!inputNode.data) {
        return;
      }

      const results: any = [];
      let minResult: any = null;

      outputNodes.forEach(outputNode => {
        results.push(findClosesPath(inputNode, outputNode.data));
      })

      minResult = results[1];

      results.forEach((result: any) => {
        if (result[1] < minResult[1]) {
          minResult = result;
        }
      });

      minResult[0][minResult[0].length - 1].hits += 1;
    })
  }
}