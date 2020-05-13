function checkCPUthreads(){
	let logicalProcessorCount = navigator.hardwareConcurrency;
	if(logicalProcessorCount < 6)
		window.location.href = "low-end/index.html";
	else
		window.location.href = "high-end/index.html";
}