paper.install(window);
window.onload = function() {
	// Setup directly from canvas id:
	paper.setup('myCanvas');
	
		h = paper.project.view.bounds.height;
		w = paper.project.view.bounds.width;
		compgroup = new Group();
		
		document.getElementById('deltextbtn').disabled = true;
		document.getElementById('gentextbtn').disabled = true;

		generateRockets();

} 
