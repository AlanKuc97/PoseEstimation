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
let fr = 1;
let videoHeight = 480;
let videoWidth = 640;
let timeSign = document.getElementById("timeSign");
let warmupSignArray = [document.getElementById("nR"),document.getElementById("nL"),
						document.getElementById("nF"),document.getElementById("aR"),
						document.getElementById("aL")];
let timer = [0,0,0,0,0,0,0,0,0,0,0,0];
let timerFlags = [0,0,0,0,0,0];
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
let timerSummary = {
    relaxed: 0,
    rightNeckStretch: 0,
    leftNeckStretch: 0,
    frontNeckStretch:0,
    rightArmStretch:0,
    leftArmStretch: 0
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
  console.log('Classification model loaded');
  classifyFrame();
}

function classifyFrame() {
  if(pose){
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      inputs.push(pose.keypoints[i].position.x);
      inputs.push(pose.keypoints[i].position.y);
    }
    neuralNet.classify(inputs, getResult);
  }else {
    setTimeout(classifyFrame, 100);
  }
}

function getResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
	workoutCheck(poseLabel);
  }
  classifyFrame();
}

function getPoses(poses){
	if(poses.length > 0){
		pose = poses[0].pose;
	}
}

function workoutCheck(poseLabel){
	switch(poseLabel){
		case "G":
            if(timerFlags[0] == 0){
			    saveTime(timerFlags);
                dropTimer();
                dropFlags();
                timerFlags[0] = 1;
                startNewTimer("G");
            }
            timeSign.innerText = "Time without warmup: " + getTimerDifference(0);
			checkTimerAlert(getTimerDifference(0,1));
			break;
		case "Q":
			if(timerFlags[1] == 0){
			    saveTime(timerFlags);
                dropTimer();
                dropFlags();
                timerFlags[1] = 1;
                startNewTimer("Q");
            }
			warmupSignArray[0].style.color = "green";
			timeSign.innerText = "Warming up!";
			break;
		case "W":
			if(timerFlags[2] == 0){
			    saveTime(timerFlags);
                dropTimer();
                dropFlags();
                timerFlags[2] = 1;
                startNewTimer("W");
            }
            //console.log(timer);
			warmupSignArray[1].style.color = "green";
			timeSign.innerText = "Warming up!";
			break;
		case "E":
			if(timerFlags[3] == 0){
			    saveTime(timerFlags);
                dropTimer();
                dropFlags();
                timerFlags[3] = 1;
                startNewTimer("E");
            }
			warmupSignArray[2].style.color = "green";
			timeSign.innerText = "Warming up!";
			break;
		case "R":
			if(timerFlags[4] == 0){
			    saveTime(timerFlags);
                dropTimer();
                dropFlags();
                timerFlags[4] = 1;
                startNewTimer("R");
            }
			warmupSignArray[3].style.color = "green";
			timeSign.innerText = "Warming up!";
			break;
		case "T":
			if(timerFlags[5] == 0){
			    saveTime(timerFlags);
                dropTimer();
                dropFlags();
                timerFlags[5] = 1;
                startNewTimer("T");
            }
			warmupSignArray[4].style.color = "green";
			timeSign.innerText = "Warming up!";
			break;
	}
}

function getTimerDifference(s,e){
	timer[e] = performance.now();
	return parseInt((timer[e] - timer[s])/1000);
}

function checkTimerAlert(time){
	if(time > 3600){
		alert("Please warmup!");
	}else if(time == 10){
		for(let i = 0; i < warmupSignArray.length; i++){
			warmupSignArray[i].style.color = "black";
		}
	}
}

function dropTimer(){
    timer = [0,0,0,0,0,0,0,0,0,0,0,0];
}

function dropFlags(){
    timerFlags = [0,0,0,0,0,0];
}

function saveTime(flags){
    for(let i=0; i < flags.length; i++){
        if(flags[i]){
            switch(i){
                case 0:
                    timerSummary.relaxed += getTimerDifference(0,1);
                    break;
                case 1:
                    timerSummary.rightNeckStretch += getTimerDifference(2,3);
                    break;
                case 2:
                    timerSummary.leftNeckStretch += getTimerDifference(4,5);
                    break;
                case 3:
                    timerSummary.frontNeckStretch += getTimerDifference(6,7);
                    break;
                case 4:
                    timerSummary.rightArmStretch += getTimerDifference(8,9);
                    break;
                case 5:
                    timerSummary.leftArmStretch += getTimerDifference(10,11);
                    break;
            }
        }
    }
}

function startNewTimer(label){
    switch(label){
        case "G":
            timer[0] = performance.now();
            break;
        case "Q":
            timer[2] = performance.now();
            break;
        case "W":
            timer[4] = performance.now();
            break;
        case "E":
            timer[6] = performance.now();
            break;
        case "R":
            timer[8] = performance.now();
            break;
        case "T":
            timer[10] = performance.now();
            break;
    }
}

function saveSummary(){
	saveTime(timerFlags);
    dropTimer();
    dropFlags();
	saveJSON(timerSummary, 'Summary.json');
}

function draw(poses) {
	image(capture,0,0);
}