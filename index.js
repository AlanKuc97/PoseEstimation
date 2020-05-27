/*
	Some of the code style was used from The Coding Train online video course about Neural Network
	URL: https://www.youtube.com/watch?v=FYgYyq-xqAw&list=LLyyOgQUs55Y5_cyyaMUUqXw&index=19&t=1187s
*/
alert("Please make sure there is enough light in room!");
alert("Please make sure WEB camera is in front of you!");
function checkCPUthreads(){
	let logicalProcessorCount = navigator.hardwareConcurrency;
	if(logicalProcessorCount < 6)
		window.location.href = "low-end/index.html";
	else
		window.location.href = "high-end/index.html";
}