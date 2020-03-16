let capture;
let poseNet;
let fr = 15;
let videoHeight = 480;
let videoWidth = 640;
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
function setup(){
	createCanvas(videoWidth, videoHeight)
		.position((windowWidth - width) / 2, (windowHeight - height) / 2);
	capture = createCapture(constraints);
	capture.hide();
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
	image(capture,0,0);
}