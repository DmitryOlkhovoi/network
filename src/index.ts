// !DDR_E?
import Network from "./Network";
import findClosesPath from "./dijkstra";
import { shorterDistanceIn } from "./modifiers";

const input = [1, 3, 10, 0, 5, 6, 4, 8, 9, 2]
const output = [1, 2, 3, 4]
const network = new Network();

network.addDataLayer(input);
network.addHiddenLayer(20);
network.addHiddenLayer(10);
network.addDataLayer(output);

// TODO Find closest path from input to output data
// TODO Shoter the distance
// TODO Signal

// ? Power of a signal will be depends on a distance to an output node

const result = findClosesPath(network.layers[0].nodes[5], 2);
shorterDistanceIn(result);

console.log(network);