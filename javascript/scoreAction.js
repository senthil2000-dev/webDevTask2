var colorPositive = '#99cc00';
var colorNegative = '#6600ff';

var plusSignSize = 120;

var SquareScene = (function () {
  function SquareScene(canvas) {
    var _this = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    window.addEventListener('resize', function (_) {
      return _this.handleResize();
    }, false);

    this.handleResize();

    requestAnimationFrame(function (_) {
      return _this.draw();
    });
  }

  SquareScene.prototype.handleResize = function handleResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var canvas = this.canvas;

    canvas.width = width;
    canvas.height = height;
  };

  SquareScene.prototype.draw = function draw() {
    var _this2 = this;

    var framesElapsed = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    requestAnimationFrame(function (_) {
      return _this2.draw(framesElapsed + 1);
    });

    var canvas = this.canvas;
    var ctx = this.ctx;
    var width = canvas.width;
    var height = canvas.height;

  
    var angle = framesElapsed * Math.PI / 180;

    var positiveIsDominant = angle % Math.PI > Math.PI / 2;

    ctx.fillStyle = positiveIsDominant ? colorPositive : colorNegative;
    ctx.fillRect(0, 0, width, height);

    var size = plusSignSize;
    var halfSize = size / 2;
    var thirdSize = size / 3;
    var twoThirdsSize = thirdSize * 2;

    var maxX = width + thirdSize;
    var maxY = height + thirdSize;

    var drawSign = function drawSign(x, y, isNegative, index, sy, wasNegativeAtStart) {
      ctx.save();
      ctx.translate(x, y);

      var draw = false;

      if (isNegative & !positiveIsDominant) {
        ctx.rotate(angle);
        draw = true;
      }

      if (!isNegative & positiveIsDominant) {
        ctx.rotate(-angle);
        draw = true;
      }

      if (draw) {
        ctx.fillStyle = isNegative ? colorPositive : colorNegative;
        ctx.fillRect(-halfSize, thirdSize - halfSize, size, thirdSize);
        ctx.fillRect(thirdSize - halfSize, -halfSize, thirdSize, size);
      }

      ctx.restore();

      y += size + twoThirdsSize;
      isNegative = !isNegative;

      if (y > maxY) {
        x += thirdSize;
        y = sy - twoThirdsSize;

        if (Math.abs(y) >= twoThirdsSize * 2) {
          wasNegativeAtStart = !wasNegativeAtStart;
          isNegative = wasNegativeAtStart;
        }

        sy = y;
      }

      if (x > maxX) {
        return;
      }

      drawSign(x, y, isNegative, ++index, sy, wasNegativeAtStart);
    };

    drawSign(0 - size, 0, false, 0, 0, false);
  };

  return SquareScene;
})();

var canvas ;
var context ;
var Val_Max;
var Val_Min;
var sections;
var xScale;
var yScale;
var y;
		
var itemName = JSON.parse(localStorage.getItem("scores") || "[]");
var itemValue = JSON.parse(localStorage.getItem("scores") || "[]");
var colors=["violet", "indigo", "blue", "green", "yellow", "orange", "red", "gold", "pink", "lightgreen"];
function init() {
		
	sections = 10;
	Val_Max = 150;
	var stepSize = 10;
	var columnSize = 50;
	var rowSize = 60;
	var margin = 10;
	var header = "SCORES" 
		
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.fillStyle = "#000;"
  var W = _W = 650;
  var H = _H = 400;
  var score = 0;
  var dim = {w:window.innerWidth,h:window.innerHeight};
  _H = dim.h;
  _W = dim.w;
  
  if(dim.w/dim.h < 65/40)
      _H = dim.w*H/W;
  else
      _W = dim.h*W/H;
  canvas.style.width=_W*0.8+"px";
  canvas.style.height=_H*0.8+"px";
	yScale = (canvas.height - columnSize - margin) / (Val_Max);
	xScale = (canvas.width - rowSize) / (sections + 1);
	
	context.strokeStyle="#000;"; 
	context.beginPath();
		
  context.font = "8pt Arial"
  context.fillStyle="white";
  
  context.fillText(header, 0,columnSize - margin);
  
	context.font = "16 pt Helvetica"
	var count =  0;
	for (scale=Val_Max;scale>=0;scale = scale - stepSize) {
    y = columnSize + (yScale * count * stepSize);
    context.strokeStyle='lightblue';
    context.fillStyle="white";
		context.fillText(scale, margin,y);
		context.moveTo(rowSize,y)
		context.lineTo(canvas.width,y)
		count++;
	}
	context.stroke();
	
	context.font = "10pt Verdana";
	context.textBaseline="bottom";
	for (i=0;i<10;i++) {
    computeHeight(itemValue[i]);
    context.fillStyle="white";
		context.fillText(itemName[i], xScale * (i+2),y - margin);
	}
	context.font = "20pt Arial"
  context.textAlign = 'center';
  context.fillText("TOP 10 SCORES", canvas.width/2,columnSize - margin);
	
  
	context.fillStyle="#9933FF;";
  context.shadowColor = 'rgba(128,128,128, 0.5)';
  
	context.shadowOffsetX = 9;
	context.shadowOffsetY = 3;
  
  context.translate(0,canvas.height - margin);
	context.scale(xScale,-1 * yScale);
  
	for (i=0;i<10;i++) {
    context.fillStyle=colors[i];
		context.fillRect(i+2, 0, 0.3, itemValue[i]);
  }
  
}

function computeHeight(value) {
	y = canvas.height - value * yScale ;	
}