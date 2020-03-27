let capture;
let poseNet;
let fr = 15;
let videoHeight = 480;
let videoWidth = 640;
let timeSign = document.getElementById("timeSign");
let timer = [performance.now(),0];
let constraints = {
		video: {
			mandatory: {
				maxWidth: videoWidth,
				maxHeight: videoHeight
			},
			optional: [{ maxFrameRate: fr }]
		},
		audio: false
	};
const MIN_PREDICTION_SCORE = 0.3;
function setup(){
	createCanvas(videoWidth, videoHeight)
		.position((windowWidth - width) / 2, (windowHeight - height) / 2);
	capture = createCapture(constraints);
	capture.hide();
	frameRate(fr);
	poseNet = ml5.poseNet(capture,modelReady);
	poseNet.on('pose',getPoses);
}
function modelReady(){
	console.log('Model ready!');
}
function getPoses(poses){
	if(poses.length > 0){
		if(poses[0].pose.keypoints[7].score > MIN_PREDICTION_SCORE &&
		poses[0].pose.keypoints[8].score > MIN_PREDICTION_SCORE){
			if(workoutCheck(poses)){
				timer[0] = performance.now();
				timeSign.innerText = "Working out!";
			}else{
				timeSign.innerText = "Time without workout: " + getTimerDifference();
				checkTimerAlert(getTimerDifference());
			}
		}else{
			timeSign.innerText = "Small prediction score!";
		}
	}
}
function workoutCheck(poses){
	let rightElbY = poses[0].pose.keypoints[8].position.y;
	let leftElbY = poses[0].pose.keypoints[7].position.y;
	if(rightElbY < poses[0].pose.keypoints[6].position.y || 
		leftElbY < poses[0].pose.keypoints[6].position.y){
			return true;
	}else{
		return false;
	}
}
function getTimerDifference(){
	timer[1] = performance.now();
	return parseInt((timer[1] - timer[0])/1000);
}
function checkTimerAlert(time){
	if(time > 3600){
		alert("WORKOUT NIGGA!");
	}
}
function draw(poses) {
	image(capture,0,0);
}