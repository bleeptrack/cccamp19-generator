var orange = '#ffc600';
var blue = '#0076ba';
var green = '#99ba00';
var fz = 100;
var colors = [blue, orange, green];
var rows = [];
var colorcode = [];
var border = 30;
var compgroup;
var h;
var w;

paper.install(window);
window.onload = function() {
	// Setup directly from canvas id:
	paper.setup('myCanvas');
	
		h = paper.project.view.bounds.height;
		w = paper.project.view.bounds.width;
		compgroup = new Group();

		generate();

}

function generate(){
	paper.project.clear();
	compgroup.remove();
	compgroup = new Group();
	rows = [];
	shuffle(colors);
	var text = document.getElementById('gentext').value;
	text = text.trim();
	var wordmark = findWords(text);
	var textparts = splitText(text,wordmark.length*2+1);
	var maxheight = fz*1.3;
    
	var chaosr = chaosRocket(new Point(w/2-350,h/2));
	var polyr = polyRocket(new Point(w/2, h/2));
	var leafr = leafRocket(new Point(w/2+350, h/2));
	chaosr.strokeWidth = 4.6*1.5;
	leafr.strokeWidth = 4.6*1.5;
	polyr.strokeWidth = 8*1.5;
	
	scaleToHeight(chaosr, h*0.6);
	scaleToHeight(polyr, h*0.6);
	scaleToHeight(leafr, h*0.6);
		
	compgroup.addChild(chaosr);
	compgroup.addChild(polyr);
	compgroup.addChild(leafr);
	
	
	if(text.length>0){
		chaosr.strokeWidth = 3.5;
		polyr.strokeWidth = 3.5;
		leafr.strokeWidth = 3.5;
		
		scaleToHeight(chaosr, maxheight);
		scaleToHeight(polyr, maxheight);
		scaleToHeight(leafr, maxheight);

		lineText(textparts, wordmark);
		offsetRows(wordmark);
		findRocketPlaces(chaosr, polyr, leafr);
		compgroup.position = [w/2,h/2];
	}
}

function findRocketPlaces(chaosr, polyr, leafr){
	var rocketByColor = {
		'#0076ba': chaosr,
		'#ffc600': polyr,
		'#99ba00': leafr
	};
	var startcol = rows[0].firstChild.style.fillColor.toCSS(true);
	rocketByColor[startcol].bounds.bottomLeft = rows[0].firstChild.bounds.topLeft;
	rocketByColor[startcol].position = rocketByColor[startcol].position.add([10,20]);
	delete rocketByColor[startcol];
	
	Object.keys(rocketByColor).forEach(function(key) {
		var col = key;
		var lastrocket = rocketByColor[col];
		var places = [];
		for(var i = 0; i<rows.length; i++){
			if( (i==0 || rows[i].lastChild.bounds.bottomRight.x>=rows[i-1].lastChild.bounds.bottomRight.x) && rows[i].lastChild.style.fillColor.toCSS(true)==col){
				var pos = new Point(rows[i].lastChild.bounds.bottomRight.x, rows[i].lastChild.point.y)
				places.push(pos.add([10,0]));
			}
		}
		shuffle(places);
		if(places.length>0){
			lastrocket.bounds.bottomLeft = places[0];
		}else{
			lastrocket.remove();
		}
	});
}

function offsetRows(wordmark){
		
	for(var i = 1; i<rows.length; i++){
		rows[i].bounds.bottomLeft.x = rows[i-1].bounds.bottomLeft.x;
		if(rows[i-1].bounds.width>border*2){
			var pos = border+rnd(0,rows[i-1].bounds.width-border*2);
			rows[i].position.x += pos;
		}
	}
}

//break up text parts in matching colorable parts
function lineText(textarr, wordmark){
	var lettercount = 0;
	var x = 0;
	
	
	for(var i = 0; i<textarr.length; i++){
		var txt = textarr[i];
		var group = new Group();
		var currentcount = 0;

		if(txt.length+lettercount>=wordmark[x]-1){
			var text = new PointText({
				point: [100, 500 + fz*0.7*i],
				content: txt.substring(currentcount,wordmark[x]-lettercount-1),
				fillColor: colors[x%3],
				fontFamily: 'Marvel', 
				fontSize: fz
			});
			currentcount = wordmark[x]-lettercount-1;
			x++;
			group.addChild(text);
			
		}
		
		if(txt.substring(currentcount).length>0){
			
			var pos = 100;
			if(group.lastChild){
				pos = group.lastChild.bounds.bottomRight.x;
			}
			
			var text = new PointText({
				point: [pos, 500 + fz*0.7*i],
				content: txt.substring(currentcount),
				fillColor: colors[x%3],
				fontFamily: 'Marvel',
				fontSize: fz
			});
			group.addChild(text);
		}
		lettercount += txt.length;
		rows.push(group);
		compgroup.addChild(group);
	}
	
	
}

function findWords(text){
	index = 0,
    res = [];
	while ((index = text.indexOf(' ', index + 1)) > 0) {
		res.push(index);
	}
	res[0] += 1;
	return res;
}

function splitText(text, nr){
	var idx = [];
	var textparts = [];
	
	idx.push(0)
	for(var i = 0; i<nr-1; i++){
		idx.push(rnd(2,text.length-2));
	}
	idx.push(text.length+1);
	idx.sort(function(a, b) {
		return a - b;
	});
	
	for(var i = 0; i<idx.length-1; i++){
		textparts.push(text.substring(idx[i], idx[i+1]).replace(/\s+/g, ''));
	}
	textparts = textparts.filter(function (el) {
		return el != "";
	});
	return textparts;
}

function scaleToHeight(path, height){
	path.scale(height/path.bounds.height);
}

function leafRocket(pos){
	var group = new Group();
	
	var stemheight = rnd(40,70);
	var veinheight1 = rnd(100,200);
	var veinheight2 = veinheight1 + rnd(100,200);
	var leafheight = veinheight2 + rnd(100,200);
	var leafhandle = rnd(150,300);
	
	var path = new Path();
	path.add(pos.add(new Point(-rnd(10,30), -stemheight)));
	path.add(pos);
	path.add(pos.add(new Point(-rnd(10,30), veinheight1)));
	path.add(pos.add(new Point(rnd(5,15), veinheight2)));
	path.smooth();
	group.addChild(path);

	
	var leaf = new Path();
	leaf.add(new Segment(pos, new Point(-leafhandle, leafhandle/4), new Point(leafhandle, leafhandle/4)));
	leaf.add(new Segment(pos.add(new Point(0,leafheight), new Point(-leafhandle, -leafhandle/4), new Point(-leafhandle, -leafhandle/4))));
	leaf.closed = true;
	group.addChild(leaf);
	
	var posoffset = path.getOffsetOf(pos);
	var windowcenter = path.getOffsetOf( path.getNearestPoint( pos.add([0,rnd(70,100)]) ) );
	var windowheight = rnd(30,45);
	var windowhandle = rnd(20,40);
	var windowoffset = rnd(5,20);
	
	var window1 = new Path();
	window1.add(new Segment(path.getPointAt(windowcenter-windowheight), null, new Point(-windowhandle,0) ));
	window1.add(path.getPointAt(windowcenter-windowheight).add([-leafhandle/5,windowheight/2]));
	group.addChild(window1);
	var window12 = new Path();
	window12.add(new Segment(path.getPointAt(windowcenter-windowheight+windowoffset), null, new Point(windowhandle,0) ));
	window12.add(path.getPointAt(windowcenter-windowheight+windowoffset).add([leafhandle/5,windowheight/2]));
	group.addChild(window12);
	
	var window2 = new Path();
	window2.add(new Segment(path.getPointAt(windowcenter+windowheight), null, new Point(-windowhandle,0) ));
	window2.add(path.getPointAt(windowcenter+windowheight).add([-leafhandle/5,-windowheight/2]));
	group.addChild(window2);
	var window22 = new Path();
	window22.add(new Segment(path.getPointAt(windowcenter+windowheight+windowoffset), null, new Point(windowhandle,0) ));
	window22.add(path.getPointAt(windowcenter+windowheight+windowoffset).add([leafhandle/5,-windowheight/2]));
	group.addChild(window22);
	
	var endpoint = path.getPointAt(path.length - 35);
	var norm = path.getNormalAt(path.length - 35);
	var endvein = new Path();
	endvein.add(new Segment(endpoint, null, norm.multiply(-leafhandle/12) ));
	endvein.add(path.lastSegment.point.add( new Point(-leafhandle/8,0) ));
	group.addChild(endvein);
	
	var minileafpoint = pos.add(new Point(0,leafheight/2));
	var dist = leafheight/2;
	
	var minileaf1 = new Path();
	minileaf1.add( new Segment(minileafpoint, new Point(leafhandle/3,leafhandle/3), new Point(-leafhandle/2, -leafhandle/2)) );
	minileaf1.add(minileafpoint.add( new Point(-dist/2,dist) ));
	minileaf1.closed = true;
	
	var minileaf2 = minileaf1.clone();
	var angle = Math.atan(0.5)*360/Math.PI;
	minileaf2.rotate(-angle,minileafpoint);
	
	var tmp = minileaf1.subtract(leaf);
	minileaf1.remove();
	minileaf1 = tmp;
	tmp = minileaf2.subtract(leaf);
	minileaf2.remove();
	minileaf2 = tmp;
	group.addChild(minileaf1);
	group.addChild(minileaf2);
	
	var minivein1 = new Path();
	minivein1.add( new Segment(minileafpoint, null, new Point(-leafhandle/6,0)));
	minivein1.add(minileafpoint.add( new Point(-dist/2*0.7,dist*0.7) ));
	
	var minivein2 = minivein1.clone();
	minivein2.rotate(-angle,minileafpoint);
	
	var inter = minivein1.getIntersections(leaf);
	var newvein1 = minivein1.splitAt(inter[0]);
	minivein1.remove();
	inter = minivein2.getIntersections(leaf);
	var newvein2 = minivein2.splitAt(inter[0]);
	minivein2.remove();
	group.addChild(newvein1);
	group.addChild(newvein2);
	
	group.strokeColor= green;
	
	group.position = pos;
	return group;
}

function polyRocket(pos){
	
	var group = new Group();
	
	var tipheight = rnd(50,200);
	var tipside = rnd(70,150);
	
	var bodyheight = tipheight + (100,250);
	var basewidth = rnd(30,80);
	
	var outerfeetheight = bodyheight + rnd(50,100);
	var outerfeetwidth = rnd(100,180);
	
	var feetdelta = rnd(80,200);
	var feetheight = outerfeetheight + feetdelta;
	var feetwidth = outerfeetwidth - rnd(0,20);
	
	var innerfeetheight = rnd(outerfeetheight+10,outerfeetheight + feetdelta*2/3);
	var innerfeetwidth = rnd(basewidth+10, feetwidth-10);
	
	var feetpeakwidth = rnd(20, outerfeetwidth/3);
	
	var path = new Path();
	path.add(pos.add(new Point(0, feetheight)));
	path.add(pos.add(new Point(-feetpeakwidth, outerfeetheight)));
	path.add(pos.add(new Point(-innerfeetwidth, innerfeetheight)));
	path.add(pos.add(new Point(-feetwidth, feetheight)));
	path.add(pos.add(new Point(-outerfeetwidth, outerfeetheight)));
	path.add(pos.add(new Point(-basewidth, bodyheight)));
	path.add(pos.add(new Point(-tipside, tipheight)));
	path.add(pos)
	path.add(pos.add(new Point(tipside, tipheight)));
	path.add(pos.add(new Point(basewidth, bodyheight)));
	path.add(pos.add(new Point(outerfeetwidth, outerfeetheight)));
	path.add(pos.add(new Point(feetwidth, feetheight)));
	path.add(pos.add(new Point(innerfeetwidth, innerfeetheight)));
	path.add(pos.add(new Point(feetpeakwidth, outerfeetheight)));
	path.closed = true;
	group.addChild(path);
	
	
	var windowoffset = rnd(0, 30);
	var windowheight = tipheight * rnd(40, 70)/100;
	var windowwidth = tipside * rnd(40, 70)/100;
	
	var window = new Path();
	window.add(pos.add(new Point(-windowwidth,tipheight + windowoffset)));
	window.add(pos.add(new Point(0,tipheight-windowheight + windowoffset)));
	window.add(pos.add(new Point(windowwidth,tipheight + windowoffset)));
	window.add(pos.add(new Point(0,tipheight+windowheight + windowoffset)));
	window.closed = true;
	group.addChild(window);
	
	var centerpoint = pos.add(new Point(0,rnd(bodyheight*0.7, bodyheight - 20)));
	
	
	group.addChild(new Path.Line({
		from: pos.add(new Point(-outerfeetwidth, outerfeetheight)),
		to: pos.add(new Point(-innerfeetwidth, innerfeetheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(outerfeetwidth, outerfeetheight)),
		to: pos.add(new Point(innerfeetwidth, innerfeetheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(-innerfeetwidth, innerfeetheight)),
		to: pos.add(new Point(-basewidth, bodyheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(innerfeetwidth, innerfeetheight)),
		to: pos.add(new Point(basewidth, bodyheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(-basewidth, bodyheight)),
		to: pos.add(new Point(-feetpeakwidth, outerfeetheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(basewidth, bodyheight)),
		to: pos.add(new Point(feetpeakwidth, outerfeetheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(-innerfeetwidth, innerfeetheight)),
		to: pos.add(new Point(-basewidth, bodyheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(innerfeetwidth, innerfeetheight)),
		to: pos.add(new Point(basewidth, bodyheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(-windowwidth,tipheight + windowoffset)),
		to: pos.add(new Point(-basewidth, bodyheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(windowwidth,tipheight + windowoffset)),
		to: pos.add(new Point(basewidth, bodyheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(-windowwidth,tipheight + windowoffset)),
		to: pos.add(new Point(-tipside, tipheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(windowwidth,tipheight + windowoffset)),
		to: pos.add(new Point(tipside, tipheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(0,tipheight-windowheight + windowoffset)),
		to: pos.add(new Point(-tipside, tipheight))
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(0,tipheight-windowheight + windowoffset)),
		to: pos.add(new Point(tipside, tipheight))
	}));
	
	group.addChild(new Path.Line({
		from: pos.add(new Point(-basewidth, bodyheight)),
		to: centerpoint
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(basewidth, bodyheight)),
		to: centerpoint
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(-feetpeakwidth, outerfeetheight)),
		to: centerpoint
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(feetpeakwidth, outerfeetheight)),
		to: centerpoint
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(-windowwidth,tipheight + windowoffset)),
		to: centerpoint
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(windowwidth,tipheight + windowoffset)),
		to: centerpoint
	}));
	
	group.addChild(new Path.Line({
		from: pos.add(new Point(0,tipheight-windowheight + windowoffset)),
		to: pos
	}));
	group.addChild(new Path.Line({
		from: pos.add(new Point(0, feetheight)),
		to: pos.add(new Point(0,tipheight+windowheight + windowoffset))
	}));

	group.strokeColor = orange;
	
	group.position = pos;
	return group;
}

function chaosRocket(pos){
	
	var antenna = rnd(0,15);
	var antennabase = rnd(9,15);
	var antennahandle = new Point(0,rnd(10,20));
	var antennaangle = rnd(30,45);
	var windowsize = rnd(80, 130);
	var windowpos = pos.add(new Point(-windowsize/2,windowsize));
	var blocksize = rnd(Math.floor(windowsize*0.2), Math.floor(windowsize*0.5));
	var basewidth = rnd(30,80);
	var topshape = rnd(60, 110);
	var height = rnd(300,380);
	
	
	var path = new Path();
	path.add(new Segment(pos.add(new Point(-basewidth,height)), new Point(15,30), null));
	path.add(new Segment(pos.add(new Point(-50,80)), new Point(-topshape,topshape),new Point(40,-40)));
	path.add(new Segment({
		point: pos.add(new Point(-antennabase,40)), 
		handleIn: antennahandle.rotate(antennaangle),
		handleOut: antennahandle.rotate(antennaangle+180)
	}));
	
	path.add(new Segment(pos.add(0,antenna), null, null));
	
	path.add(new Segment({
		point: pos.add(new Point(antennabase,40)), 
		handleIn: antennahandle.rotate(-antennaangle+180),
		handleOut: antennahandle.rotate(-antennaangle)
	}));
	path.add(new Segment(pos.add(new Point(50,80)), new Point(-40,-40), new Point(topshape,topshape)));
	path.add(new Segment(pos.add(new Point(basewidth,height)), null, new Point(-15,30)));
	path.closed = true;
	path.strokeColor = blue;
	
	
	var window = new Path.Ellipse(new Rectangle(windowpos, new Size(windowsize,windowsize)));
	window.rotate(45);
	
	var body = path.subtract(window);
	window.remove();
	path.remove();
	
	
	
	var block = new Path.Rectangle(windowpos.add(new Point(-blocksize/2+windowsize/2,-200+windowsize/2)), new Size(blocksize,200));
	block.rotate(-rnd(30,130),windowpos.add(new Point(windowsize/2, windowsize/2)));
	block.fillColor = 'red';
	
	var rockettop = body.subtract(block);
	block.remove();
	body.remove();
	

	if(rockettop.children){
		console.log(rockettop);
		var tmp = rockettop.children[0].clone();
		rockettop.remove();
		rockettop = tmp; 
		console.log(rockettop);
	}
	
	console.log(rockettop.index);

	
	rockettop.smooth({ type: 'catmull-rom', factor:0.3,  from: 1, to: 4 });
	//rockettop.smooth({ type: 'catmull-rom', factor:0.7,  from: 2, to: 3 });
	
	rockettop.smooth({ type: 'catmull-rom', factor:0.7,  from: 5, to: 8 });
	
	//rockettop.smooth({ type: 'catmull-rom', factor:0.3,  from: 1, to: 8 });
	//rockettop.smooth({ type: 'geometric', factor:0.5,  from: 3, to: 5 });
	rockettop.closed = false;
	//rockettop.simplify();
	
	maybe(flip, rockettop, 0.5);
	
	
	var bow = pos.add(new Point(rnd(10,basewidth-10), height));
	var bowhandle = new Point(0,50);
	var bowangle = rnd(0,60)-30;
	var foothandle = rnd(100,150);
	var footheight = height+rnd(100,200);
	var launcherhandle = rnd(30,60);
	var launcherpos = rnd(40,55);
	
	var bottom = new Path();
	bottom.add(new Segment(pos.add(new Point(0,height-50)), new Point(-foothandle,0), new Point(foothandle,0)));
	bottom.add(new Segment(pos.add(new Point(90,footheight)), new Point(40, -100), new Point(10,-30)));
	bottom.add(new Segment(pos.add(new Point(launcherpos, height+50)), new Point(launcherhandle,0), new Point(-launcherhandle,0)));
	bottom.add(pos.add(new Point(0, footheight)));	
	bottom.add(new Segment(pos.add(new Point(-launcherpos, height+50)), new Point(launcherhandle,0), new Point(-launcherhandle,0)));
	bottom.add(new Segment(pos.add(new Point(-90,footheight)), new Point(-40,-100), new Point(-60, -100)));
	bottom.closed = true;
	
	//bottom.scale(rnd(65,100)/100,rnd(45,100)/100, pos.add(new Point(0,380)));
	
	rockettop.reverse();
	rockettop.add(new Segment(bow, bowhandle.rotate(bowangle), bowhandle.rotate(bowangle+180) ));
	
	
	var loc = rnd(30,100);
	//var cutbottom = bottom.splitAt(bottom.getLocationAt(loc));
	var cutbottom = bottom.splitAt(bottom.getLocationAt(bottom.getOffsetOf(pos.add(new Point(-launcherpos, height+50)))-loc/2));
	var buttom2 = cutbottom.splitAt(bottom.getLocationAt(loc));
	cutbottom.strokeColor = 'blue';
	cutbottom.remove();
	bottom.remove();
	buttom2.strokeColor = 'red';
	
	
	rockettop.join(buttom2);
	//rockettop.fullySelected = true;
	
	rockettop.removeSegment(15);
	
	maybe(flip, rockettop, 0.5);
	
	rockettop.position = pos;
	
	//rockettop.smooth({type: 'catmull-rom', factor:0.1, from: 13, to: 13 });
	//rockettop.smooth({type: 'catmull-rom', factor:0.8, from: 15, to: 15 });
	console.log(rockettop.index);
	return rockettop;
}

function rnd(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function wiggle(path, offset){
	for(var i = 0; i<path.segments.length; i++){
		
		path.segments[i].point = path.segments[i].point.add(new Point(rnd(-offset,offset), rnd(-offset,offset)));
		
	}
}

function flip(path){
	path.scale(-1,1);
	path.reverse();
}

function maybe(func, args, chance){
	var r = Math.random();
	if(r<=chance){
		func(args);
	}
}

function downloadSVG(){
    var svg = project.exportSVG({ asString: true });    
    var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "cccamp19.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
