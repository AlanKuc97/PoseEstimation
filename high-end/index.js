/*
	*** NEURAL NETWORK LABEL MEANING ***
	G - sitting still 
	Q - stretching neck to right side
	W - stretching neck to left side
	E - stretching neck front
	R - stretching right arm
	T - stretching left arm
*/
let capture;
let pose;
let poseNet;
let fr = 30;
let videoHeight = 480;
let videoWidth = 640;
let timeSign = document.getElementById("timeSign");
let timer = [performance.now(),0];
let constraints = {
		video: {
			optional: [{ maxFrameRate: fr }]
		},
		audio: false
	};
	
let neuralNet;
let parameters = {
    inputs: 34,
    outputs: 6,
    task: 'classification',
    debug: true
};
const modelInfo = {
    model: '../myModel/model.json',
    metadata: '../myModel/model_meta.json',
    weights: '../myModel/model.weights.bin',
};

function setup(){
	capture = createCapture(constraints);
	capture.size(videoWidth,videoHeight);
	capture.hide();
	createCanvas(capture.width, capture.height)
		.position((windowWidth - capture.width) / 2, (windowHeight - capture.height - timeSign.clientHeight) / 2);
	poseNet = ml5.poseNet(capture,modelReady);
	poseNet.on('pose',getPoses);
	neuralNet = ml5.neuralNetwork(parameters);
	neuralNet.load(modelInfo, neuralNetLoaded);
}

function modelReady(){
	console.log('Posenet model ready');
}

function neuralNetLoaded() {
  console.log('Classification model ready');
  classifyPose();
}

function classifyPose() {
  if(pose){
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    neuralNet.classify(inputs, getResult);
  }else {
    setTimeout(classifyPose, 100);
  }
}

function getResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
	workoutCheck(poseLabel);
  }
  classifyPose();
}

function getPoses(poses){
	if(poses.length > 0){
		pose = poses[0].pose;
	}
}

function workoutCheck(poseLabel){
	switch(poseLabel){
		case "G":
			timeSign.innerText = "Time without warmup: " + getTimerDifference();
			checkTimerAlert(getTimerDifference());
			break;
		case "Q":
			timer[0] = performance.now();
			timeSign.innerText = "Warming up!";
			break;
		case "W":
			timer[0] = performance.now();
			timeSign.innerText = "Warming up!";
			break;
		case "E":
			timer[0] = performance.now();
			timeSign.innerText = "Warming up!";
			break;
		case "R":
			timer[0] = performance.now();
			timeSign.innerText = "Warming up!";
			break;
		case "T":
			timer[0] = performance.now();
			timeSign.innerText = "Warming up!";
			break;
	}
	//console.log(poseLabel);
}

function getTimerDifference(){
	timer[1] = performance.now();
	return parseInt((timer[1] - timer[0])/1000);
}

function checkTimerAlert(time){
	if(time > 3600){
		alert("Please warmup!");
	}
}

function draw(poses) {
	image(capture,0,0);
}