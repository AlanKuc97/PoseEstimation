let capture;
let poseNet;
let fr = 3;
let constraints = {
		video: {
			mandatory: {
				maxWidth: 352,
				maxHeight: 240
			},
			optional: [{ maxFrameRate: fr }]
		},
		audio: false
	};
function setup(){
	createCanvas(100, 100);
	capture = createCapture(constraints);
	//capture.hide();
	frameRate(fr);
	poseNet = ml5.poseNet(capture,modelReady,);
	poseNet.on('pose',draw);
}
function modelReady(){
	console.log('Model ready!');
}
function getPoses(poses){
	
}
function draw(poses) {
	
}