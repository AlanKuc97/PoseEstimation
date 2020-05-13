/*
	Pavyzdys rašant šita koda buvo video: https://www.youtube.com/watch?v=FYgYyq-xqAw&t=141s  
*/
let neuralNet;
let parameters = {
    inputs: 34,
    outputs: 6,
    task: 'classification',
    debug: true
};
function setup() {
  createCanvas(100, 100);
  neuralNet = ml5.neuralNetwork(parameters);
  neuralNet.loadData('PoseData.json', loadedData);
}

function loadedData() {
  neuralNet.normalizeData();
  neuralNet.train({epochs: 100}, done); 
}

function done() {
  console.log('model trained');
  neuralNet.save();
}