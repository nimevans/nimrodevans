var c = document.getElementById("c");
var ctx = c.getContext("2d");

var cw = c.width = window.innerWidth;
var ch = c.height = window.innerHeight;

var x0 = cw / 100 * 25;
var y0 = ch / 100 * 35;
var r0 = cw / 100 * 15;
var x1 = ch / 2;
var y1 = ch / 100 * 40
var r1 = cw / 100 * 85;
/*
var grd=ctx.createRadialGradient(x0,y0,r0,x1,y1,r1);
grd.addColorStop(0,"red");
grd.addColorStop(1,"pink");

// Fill with gradient
ctx.fillStyle=grd;
ctx.fillRect(0,0,cw,ch);
*/

var start = null;
var pSteps = getRandomFloat(0.001,0.99);
var pSteps2 = getRandomFloat(0.001,0.99);
var cSpd = getRandomInt(3,12)/10000;
var slowDn = 5;
c.style.position = 'absolute';

var x0dest = getRandomFloat(0.1,0.7);
var y0dest = getRandomFloat(0.1,0.7);
var r0dest = getRandomFloat(0.001,0.2);
var x1dest = getRandomFloat(0.2,0.9);
var y1dest = getRandomFloat(0.2,0.9);
var r1dest = getRandomFloat(0.5,1.5);

function step(timestamp) {
	var cw = c.width = window.innerWidth;
	var ch = c.height = window.innerHeight;
	
	var x0vector = (cw * x0dest) - x0;
	x0 = x0 + (x0vector/200);
	if( x0 > (cw*x0dest)-5 && x0 < (cw*x0dest)+5 ) x0dest = getRandomFloat(0.1,0.7);

	var y0vector = (ch * y0dest) - y0;
	y0 = y0 + (y0vector/200);
	if( y0 > (ch*y0dest)-5 && y0 < (ch*y0dest)+5 ) y0dest = getRandomFloat(0.1,0.7);

	var r0vector = r0dest - r0;
	r0 = r0 + (r0vector/200);
	if( r0 > r0dest-0.01 && r0 < r0dest+0.01 ) r0dest = getRandomFloat(0.001,0.4);

	/*
	var x1vector = (cw * x1dest) - x1;
	x1 = x1 + (x1vector/300);
	if( x1 > (cw*x1dest)-5 && x1 < (cw*x1dest)+5 ) x1dest = getRandomFloat(0.2,0.9);

	var y1vector = (ch * y1dest) - y1;
	y1 = y1 + (y0vector/300);
	if( y1 > (ch*y1dest)-5 && y1 < (ch*y1dest)+5 ) y1dest = getRandomFloat(0.2,0.9);
	*/
	// var temp = (((x0/x1) + (y1/y0))/2)*(cw+ch/2);
	var temp = (Math.abs(x1-x0) + Math.abs(y1-y0))/2;
	console.log(temp,x0,x1);
	r1=ch*1.1;

	/*
	var r1vector = r1dest - r1;
	r1 = r1 + (r1vector/200);
	if( r1 > r0dest-0.01 && r0 < r0dest+0.01 ) r0dest = getRandomFloat(0.01,0.5);
	*/
/*
	var y0step = (ch * y0dest) - y0;
	y0 = y0 + (y0step/100);
	if( y0 > y0step-5 && y0 < y0step+5 ) y0dest = getRandomFloat(0.1,0.7);
	*/

	// x1 = ch / 2;
	// y1 = ch / 100 * 40
	var grd=ctx.createRadialGradient(x0,y0,r0,x1,y1,r1);

	var rng = getRandomInt(1,100);
	if(rng === 1) cSpd = getRandomInt(3,12)/10000;

	if(getRandomInt(1,200) === 1) slowDn = getRandomInt(2,6);

	if (!start) start = timestamp;
	pSteps += cSpd;
	if(pSteps>=1) pSteps = 0;
	pSteps2 += cSpd/slowDn;
	if(pSteps2>=1) pSteps2 = 0;

	var rgb = HSVtoRGB( pSteps,0.35,1 );
	var rgb2 = HSVtoRGB( 1-pSteps,0.2,0.8 );
	grd.addColorStop( 0, "rgba("+rgb.r+","+rgb.g+","+rgb.b+",1)" );
	grd.addColorStop( 1, "rgba("+rgb2.r+","+rgb2.g+","+rgb2.b+",1)" );

	ctx.fillStyle=grd;
	ctx.fillRect(0,0,cw,ch);

	window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomFloat(min, max) {
	return (Math.random() * (max - min)) + min;
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

/*
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				},
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());
// ends requestAnimationFrame polyfill

var c = document.getElementById("c");
var ctx = c.getContext("2d");

var cw = c.width = window.innerWidth;
var ch = c.height = window.innerHeight;
var R = 200;
var colorsLength = 6;
var A = 360 / colorsLength;
var angleIncrement = 0;

var grd, ap, af, xp, yp, xf, yf;
var rad = (Math.PI / 180);
ctx.lineWidth = 25;

function draw() {
		ctx.clearRect(0, 0, cw, ch);

		if (angleIncrement >= 360) {
			angleIncrement = 0;
		} else {
			angleIncrement++;
		}
		//console.log(angleIncrement);

		for (var i = 0; i < colorsLength; i++) {

			ap = A * i;
			af = A * (i + 1) + .5;

			apRad = rad * ap;
			afRad = rad * af;

			ctx.beginPath();
			ctx.arc(cw / 2, ch / 2, R, apRad, afRad);

			xp = cw / 2 + R * Math.cos(apRad);
			yp = ch / 2 + R * Math.sin(apRad);
			xf = cw / 2 + R * Math.cos(afRad);
			yf = ch / 2 + R * Math.sin(afRad);



			grd = ctx.createLinearGradient(xp, yp, xf, yf);
			grd.addColorStop(0, "hsl(" + (ap + angleIncrement) + ",100%,50%)");
			grd.addColorStop(1, "hsl(" + (af + angleIncrement) + ",100%,50%)");

			ctx.strokeStyle = grd;

			ctx.stroke();
		}
		requestId = window.requestAnimationFrame(draw);
	} //end draw()

function start() {
	requestId = window.requestAnimationFrame(draw);
	stopped = false;
}

function stopAnim() {
	if (requestId) {
		window.cancelAnimationFrame(requestId);
	}
	stopped = true;
}

window.addEventListener("load", start(), false);
c.addEventListener("click", function() {
	(stopped == true) ? start(): stopAnim();
}, false);
*/