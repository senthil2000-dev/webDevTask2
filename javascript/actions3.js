document.addEventListener("DOMContentLoaded", function(event) {
    localStorage.setItem("player1", "");
    var FPS = 60;
    var flag2=0;
    var b=parseInt(localStorage.getItem("level"));
    var noOfPlayers=localStorage.getItem("noOfPlayers");
    console.log(noOfPlayers);
    var heartLight=new Array();
    var T = 0;
    var TT = 0;
    var canvas = document.getElementById("gameBoard");
    var c = canvas.getContext('2d');
    var W = _W = 360;
    var H = _H = 512;
    var score = 0;
    let coinImage = new Image();
    coinImage.src = 'https://www.cat-in-web.ru/wp-content/uploads/coin-sprite-animation.png';
    let glowImage = new Image();
    glowImage.src = 'assets/spriteSheets/ballGlow.png';
    var dim = {w:window.innerWidth,h:window.innerHeight};
    canvas.setAttribute('width', W);
    canvas.setAttribute('height', H);
    _H = dim.h;
    _W = dim.w;
    var opts = {
        amount: 20,
        distance: 6.3157,
        radius: 6.3157,
        height: 42.1875,
        span: Math.PI*3.2
    };
    if(dim.w/dim.h < 45/64)
        _H = dim.w*H/W;
    else
        _W = dim.h*W/H;
    canvas.style.width=_W+"px";
    canvas.style.height=_H+"px";
    canvas.style.top=(dim.h-_H)/2+"px";
    canvas.style.left=(dim.w-2*_W)/2+"px";
    var camY = 0;
    var died = false;
    var dCircle = function(coords,radius,color){
        c.beginPath();
        c.fillStyle = color;
        c.arc(coords.x,coords.y,radius,0,2*Math.PI);
        c.fill();
    };
    var coord = function(dx,dy){
        return {x:dx,y:H+camY-dy};
    };
    var col = ['#F39','#3FF','#FF3','#A0F', '#FCC200', '#08f26e', '#FA8072', '#3964C3'];
    var gCol = function(index, total=4){
        var n = index;
        return col[n%total];
    };
    var rRange = function(x1,x2){
        return x1+Math.random()*(x2-x1);
    };
    var choose = function(){
        return arguments[Math.floor(arguments.length*Math.random())];
    };
    var rCol = function(){
        return col[Math.floor(4*Math.random())];
    };
    var gPCol = function(totalColors){
        var requiredArray=col.slice(0, totalColors);
        requiredArray=requiredArray.filter(element => element!=p.c);
        return requiredArray[Math.floor(requiredArray.length*Math.random())];
    };
    var repeat = function(func,rep){
        for(var _rep = 0; _rep < rep; _rep++){
            func();
        };
    };
    var getDots = function(xy1,xy2){
        return {
            d:Math.sqrt(Math.pow(xy1.x-xy2.x,2)+Math.pow(xy1.y-xy2.y,2)),
            a:Math.atan2(xy1.y-xy2.y,xy2.x-xy1.x)
        };
    };
    var die = function(){
        if(p.sprite==0) {
        var gameOver=new Audio("assets/sounds/gameOver.mp3");
        gameOver.play();
            var topScores=JSON.parse(localStorage.getItem("scores") || "[]");
        var q;
        for (q = 0; q < topScores.length; q++) {
            if(topScores[q]<score)
                break;
        }
        topScores.splice(q, 0, score);
        topScores=topScores.slice(0, 10);
        for(var i=topScores.length; i<10; ++i) {
            topScores[i]=0;
        }
        topScores=topScores.slice(0, 10);
        localStorage.setItem("scores", JSON.stringify(topScores));
        console.log(topScores);
        died = true;
        repeat(function(){newParticle(p.x,p.y+5);},14);
        TT = 1;
        }
    };
    var p = {x:W/2,y:H/4,r:10,c:rCol(),spd:0,spdMax:6,acc:0, sprite:0};
    var objects = [];
    var newObject = function(x,y,r,c){
        var o = {x:x,y:y,r:r,c:c,t:0,destroyed:false};
        o.move = function(){};
        o.draw = function(){
            dCircle(coord(o.x,o.y),o.r,o.c);
        };
        o.destroy = function(){
            o.destroyed = true;
        };
        o.update = function(){
            o.move();
            o.draw();
            if(o.y+125 < camY){
                o.destroy();
            };
            o.t++;
        };
        objects.push(o);
        return o;
    };
    var modAng = function(x){
        var y = x;
        while(y < 0){
            y += Math.PI*2;
        };
        return y%(Math.PI*2);
    };
    var obstacles = {n:0,sep:350};
    var cspd = 1;
    var new8 = function(y,ang,dir,col, ospd){
        var o8 = newObject(W/2,100+obstacles.sep*y,10,gCol(col));
        o8.cx = o8.x;
        o8.cy = o8.y;
        o8.rad8 = 80;
        o8.d = dir;
        o8.a = ang;
        o8.speed=ospd;
        o8.move = function(){
            with(o8){
                x = cx+1.5*rad8*Math.cos(a);
                y = cy+0.7*rad8*Math.sin(2*a);
                a += d*0.02*o8.speed;
            };
            if(!died && p.c != o8.c && getDots(coord(p.x,p.y),coord(o8.x,o8.y)).d < p.r+o8.r){
                die();
            };
        };
    };
    var newHeart = function(arr1, y, i, x1,flag, col){
        var o8 = newObject(W/2,100+obstacles.sep*y,10,gCol(col));
        arr1.push(o8);
        o8.num=heartLight.length-1;
        o8.cx = o8.x;
        o8.cy = o8.y;
        o8.x1=x1;
        o8.i=i;
        console.log(o8.num);
        o8.move = function(){
            with(o8){
                if(heartLight[num]>=39 && heartLight[num]<59) {
                    k=(i==0)?19:(i-1);
                    c=arr1[k].c;
                    heartLight[num]=0;
                }
                x =cx+16*x1;
                y=cy+16*(flag*Math.sqrt(36-Math.pow(x1,2))+(2*(Math.abs(x1)+Math.pow(x1,2)-6))/(3*(Math.abs(x1)+Math.pow(x1, 2)+2)));
                heartLight[num]++;
            }
            
            if(!died && p.c != o8.c && getDots(coord(p.x,p.y),coord(o8.x,o8.y)).d < p.r+o8.r){
                die();
                
            };
        };
    };
    
    
    var newHearts = function(y){
        var arr=[6, 5.7, 4.8, 3.25, 1.4, 0, -1.4, -3.25, -4.8, -5.7];
        var copy=Array.from(arr);
        copy.reverse();
        var newArr=arr.concat(copy);
        newArr.splice(newArr.length-1,1);
        newArr.splice(10, 0, -6);
        var array1=new Array();
        heartLight.push(0);
        for(var i = 0; i <20 ; i +=1){
            var k=(i<10)?1:-1;
            newHeart(array1, y, i, newArr[i], k, (i-i%5)/5);
        };
    };
    
    var newW8 = function(y, ospd){
        var ddir = choose(-1, 1);
        for(var i = 0; i < Math.PI*2; i += Math.PI*2/20){
            new8(y,i,ddir,Math.floor(8*(i/(Math.PI*2))), ospd);
        };
    };
    
    
    var rectangle = function(y,rad,ospd,dir,no) {
        
        var c1 = newObject(W/2,100+obstacles.sep*y,rad,Math.floor(4*Math.random()));
        console.log(no);
        c1.angle = 0;
        c1.n=no;
        c1.spd = dir*cspd*ospd;
        c1.draw = function(){
            var afrac, b;
            if(c1.n==3) {
                afrac=1.25;
                b=1;
            }
            else if(c1.n==4||c1.n==5) {
                afrac=1.075;
                b=0.9;
            }
            else {
                afrac=1.075;
                b=0.875;
            }
            for(var j = 0; j < c1.n; j++){
                c.beginPath();
                c.fillStyle = gCol(j+c1.c, c1.n);
                var a = modAng(c1.angle+2*Math.PI/c1.n*j);
                var a2 = modAng(a+2*Math.PI/c1.n);
                var coordinates=new Array(); 
                coordinates.push(coord(c1.x+c1.r*afrac*Math.cos(a), c1.y+c1.r*afrac*Math.sin(a)));
                coordinates.push(coord(c1.x+c1.r*afrac*Math.cos(a2), c1.y+c1.r*afrac*Math.sin(a2)));
                coordinates.push(coord(c1.x+c1.r*b*Math.cos(a2), c1.y+c1.r*b*Math.sin(a2)));
                coordinates.push(coord(c1.x+c1.r*b*Math.cos(a), c1.y+c1.r*b*Math.sin(a)));
                for(i=0; i<4; ++i) 
                    c.lineTo(coordinates[i].x, coordinates[i].y);
                if(gCol(j+c1.c, c1.n) != p.c && !died){
                    for(var i=0; i<4; ++i) {
                        var firstPt=coordinates[i];
                        var k=(i==3 ? 0 : (i+1));
                        var secPt=coordinates[k];
                        var midPt={x: (firstPt.x + secPt.x)/2, y: (firstPt.y + secPt.y)/2};
                        var dist=getDots(firstPt, secPt).d;
                        var dist2=getDots(coord(p.x, p.y), secPt).d;
                        var dist4=getDots(coord(p.x, p.y), midPt).d;
                        dotProduct=Math.abs(((midPt.x-p.x)*(secPt.x-firstPt.x)+(midPt.y-coord(p.x, p.y).y)*(secPt.y-firstPt.y))/dist); 
                        perpendicularDist=Math.sqrt(Math.pow(dist4,2)-Math.pow(dotProduct,2));
                        var dist3=getDots(firstPt, coord(p.x, p.y)).d;
                        
                        if(dist3<=p.r||dist2<=p.r||(dotProduct<=dist/2 && perpendicularDist<=p.r)||c.isPointInPath(p.x, coord(p.x, p.y).y)) {
                            console.log(i, c.fillStyle, dist4, dotProduct, perpendicularDist);
                            die();
                        }     
                    }
                };
                c.closePath();
                c.fill();
            };
            c1.angle += c1.spd*Math.PI/180;
        };
    };
    
    var movingBlocks=function(y,row, ospd, d, n, twoRows=false) {
        for(var i = 0; i < 2*n; ++i){
            newBlock(y,row, i,d,ospd, twoRows, n);
        }
    };
    
    var movingHBlocks=function(y, ospd, d, n) {
        for(var i = 0; i < 2*n; ++i){
            newHBlock(y, i, d, ospd, n);
        }
    };
    
    var newHBlock=function(y, index, dir, ospd, n) {
        var colorVal=gCol(index, n);
        var width=W/n;
        if(dir==1)
             var xVal=(2*index-2*n+1)*width/2;
        else if(dir==-1)
            var xVal=W-(2*index-2*n+1)*width/2;
        var yVal=100+obstacles.sep*y;
        var wideness=20;
        var height=(index%n+1)*((40-40%n)/n)+68;
        var obj = newObject(xVal, yVal, 10, colorVal);
        obj.index=index;
        obj.width=wideness;
        obj.height=height;
        obj.d=dir;
        obj.speed=ospd;
        obj.finalX=obj.x+dir*W;
        obj.draw= function() {
            c.beginPath();
            c.fillStyle=obj.c;
            var pointCoordinates=new Array();
            pointCoordinates.push(coord(obj.x+obj.width/2, obj.y-obj.height/2));
            pointCoordinates.push(coord(obj.x-obj.width/2, obj.y-obj.height/2));
            pointCoordinates.push(coord(obj.x-obj.width/2, obj.y+obj.height/2));
            pointCoordinates.push(coord(obj.x+obj.width/2, obj.y+obj.height/2));
            var midPtCoordinates= new Array();
            for(i=0; i<4;++i) {
            if(i%2==0) {
                midPtCoordinates[i/2]={
                    x: (pointCoordinates[i].x+pointCoordinates[i+1].x)/2,
                    y: (pointCoordinates[i].y+pointCoordinates[i+1].y)/2
                };
                c.arc(midPtCoordinates[i/2].x, midPtCoordinates[i/2].y, obj.width/2, Math.PI*i/2, Math.PI*(i/2+1));
            }
            else
               c.lineTo(pointCoordinates[i].x, pointCoordinates[i].y); 
            }
                
            c.closePath();
            c.fill();
            if(obj.c != p.c && !died){
                for(var i=0; i<4; ++i) {
                    if(i%2!=0) {
                       var firstPt=pointCoordinates[i];
                        var k=(i==3 ? 0 : (i+1));
                        var secPt=pointCoordinates[k];
                        var midPt={x: (firstPt.x + secPt.x)/2, y: (firstPt.y + secPt.y)/2};
                        var dist=getDots(firstPt, secPt).d;
                        var dist2=getDots(coord(p.x, p.y), secPt).d;
                        var dist4=getDots(coord(p.x, p.y), midPt).d;
                        dotProduct=Math.abs(((midPt.x-p.x)*(secPt.x-firstPt.x)+(midPt.y-coord(p.x, p.y).y)*(secPt.y-firstPt.y))/dist); 
                        perpendicularDist=Math.sqrt(Math.pow(dist4,2)-Math.pow(dotProduct,2));
                        var dist3=getDots(firstPt, coord(p.x, p.y)).d;
                        
                        if(dist3<=p.r||dist2<=p.r||(dotProduct<=dist/2 && perpendicularDist<=p.r)||c.isPointInPath(p.x, coord(p.x, p.y).y)) 
                            die();
                    }
                    else {
                        if((getDots(coord(p.x, p.y), midPtCoordinates[(i/2)]).d<=p.r+obj.width/2)||c.isPointInPath(p.x, coord(p.x, p.y).y)) 
                            die();
                    }    
                }
            };
            if((obj.x+obj.d-obj.finalX)*(obj.x-obj.finalX)<0||(obj.x==obj.finalX)) {
                obj.d*=-1;
                obj.finalX=obj.x+obj.d*W;
            }   
            obj.x+=obj.d*obj.speed;
        };
    };
    
    var newBlock=function(y,row,index,dir, ospd, twoRows, n) {
        var colorVal=gCol(index, n);
        var width=W/n;
        if(dir==1)
             var xVal=(2*index-2*n+1)*width/2;
        else if(dir==-1)
            var xVal=W-(2*index-2*n+1)*width/2;
        if(!twoRows) {
            var yVal=100+obstacles.sep*y+125*(row-2);
            var height=10;
        }
        else  {
            var yVal=100+obstacles.sep*y+72*(2*row-3);
            var height=20;
        }
            
        var obj = newObject(xVal, yVal, 10, colorVal);
        obj.index=index;
        obj.width=width;
        obj.height=height;
        obj.d=dir;
        obj.speed=ospd;
        obj.finalX=obj.x+dir*W;
        obj.draw= function() {
            c.beginPath();
            c.fillStyle=obj.c;
            var pointCoordinates=new Array();
            pointCoordinates.push(coord(obj.x-obj.width/2, obj.y-obj.height/2));
            pointCoordinates.push(coord(obj.x+obj.width/2, obj.y-obj.height/2));
            pointCoordinates.push(coord(obj.x+obj.width/2, obj.y+obj.height/2));
            pointCoordinates.push(coord(obj.x-obj.width/2, obj.y+obj.height/2));
            for(i=0; i<4;++i)
                c.lineTo(pointCoordinates[i].x, pointCoordinates[i].y);
            c.closePath();
            if(obj.c != p.c && !died){
                for(var i=0; i<4; ++i) {
                    var firstPt=pointCoordinates[i];
                    var k=(i==3 ? 0 : (i+1));
                    var secPt=pointCoordinates[k];
                    var midPt={x: (firstPt.x + secPt.x)/2, y: (firstPt.y + secPt.y)/2};
                    var dist=getDots(firstPt, secPt).d;
                    var dist2=getDots(coord(p.x, p.y), secPt).d;
                    var dist4=getDots(coord(p.x, p.y), midPt).d;
                    dotProduct=Math.abs(((midPt.x-p.x)*(secPt.x-firstPt.x)+(midPt.y-coord(p.x, p.y).y)*(secPt.y-firstPt.y))/dist); 
                    perpendicularDist=Math.sqrt(Math.pow(dist4,2)-Math.pow(dotProduct,2));
                    var dist3=getDots(firstPt, coord(p.x, p.y)).d;
                    
                    if(dist3<=p.r||dist2<=p.r||(dotProduct<=dist/2 && perpendicularDist<=p.r)||c.isPointInPath(p.x, coord(p.x, p.y).y)) {
                        
                        die();
                    }     
                }
            };
            c.fill();
            if((obj.x+obj.d-obj.finalX)*(obj.x-obj.finalX)<0||(obj.x==obj.finalX)) {
                obj.d*=-1;
                obj.finalX=obj.x+obj.d*W;
            }   
            obj.x+=obj.d*obj.speed;
        };
    };
    
    var sineWave=function (y,rad,ospd,phase) {
        
        arr = new Array(opts.amount).fill().map((el,ind)=>{
            return {
                a: opts.span/opts.amount*ind,
                x: (opts.radius*2+opts.distance)*ind,
                phase:phase
            }
        });
        arr.forEach(el=>{
            var c1 = newObject(W/2,100+obstacles.sep*y,opts.radius,Math.floor(4*Math.random()));
            c1.a=el.a;
            c1.speed=(Math.PI/180)*2*ospd;
            c1.cx = c1.x;
            c1.cy = c1.y;
            c1.x=el.x;
            c1.phase=el.phase;
            c1.move = function() {
                with(c1){
                    a+= speed;
                    var angle=a*(180/Math.PI);
                    y = Math.sin(a+c1.phase)*opts.height + c1.cy;
                    c=gCol((angle-angle%144)/144);
                };
                if(!died && p.c != c1.c && getDots(coord(p.x,p.y),coord(c1.x,c1.y)).d < p.r+c1.r){
                    die();
                    console.log(p.c, c1.c);
                };
            }
        });
    
    }
    
    var fan = function(y,rad,ospd,dir,n){
        var c1 = newObject(W/2,100+obstacles.sep*y,rad,Math.floor(4*Math.random()));
        c1.d=dir;
        c1.angle = 0;
        c1.spd = dir*cspd*ospd*0.03;
        c1.n=n;
        c1.draw = function(){
            var point=coord(c1.x, c1.y);
            drawFan(point.x+c1.d*c1.r/2, point.y, c1.angle, c1.r, c1.n);
            c.setTransform(1, 0 ,0 , 1, 0, 0);
            c1.angle+=c1.spd;
            // var co = coord(c1.x,c1.y);
            // for(var j = 0; j < 4; j++){
            //     c.beginPath();
            //     c.strokeStyle = gCol(j+c1.c);
            //     var a = modAng(c1.angle+Math.PI/2*j);
            //     var a2 = modAng(a+Math.PI/2);
            //     if(gCol(j+c1.c) != p.c && !died){
            //         if(dots.d+p.r > c1.r-c1.w/2 && dots.d-p.r < c1.r+c1.w/2){
            //             var pa = modAng(-dots.a);
            //             if(pa > a && pa < a2){
            //                 die();
            //             };
            //         };
            //     };
            //     c.arc(co.x,co.y,c1.r,a,a2);
            //     c.stroke();
            // };
            // c1.angle += c1.spd*Math.PI/180;
        };
    };
    
    function drawFan(x, y, rot, r, n){
        var u=(n%2==0)?n/2:n;
        var k=(n%2==0)?2:4;
        // use setTransform as it overwrites the canvas transform rather than multiply it as the other transform functions do
        c.setTransform(1, 0, 0, 1, x, y);
        c.rotate(rot);
        for(var j=0;j<n;++j) {
            c.beginPath();
            c.fillStyle=gCol(j, n);
            for(var theta=(j-1/k)*Math.PI*2/n; theta <(j+1/k)*Math.PI*2/n;theta+=0.01){ 
                var v = r*Math.cos(u*theta)*Math.cos(theta);
                var w = r*Math.cos(u*theta)*Math.sin(theta);
                if(gCol(j, n) != p.c && !died && theta!=(j-1/k)*Math.PI*2/n){
                        var m=r*Math.cos(u*(theta-0.01))*Math.cos(theta-0.01);
                        var o=r*Math.cos(u*(theta-0.01))*Math.sin(theta-0.01);
                        var v1=v*Math.cos(rot)-w*Math.sin(rot);
                        var w1=v*Math.sin(rot)+w*Math.cos(rot);
                        var m1=m*Math.cos(rot)-o*Math.sin(rot);
                        var o1=m*Math.sin(rot)+o*Math.cos(rot);
                        var firstPt={x:x+m1, y:y+o1};
                        var secPt={x:x+v1, y:y+w1};
                        var midPt={x: (firstPt.x + secPt.x)/2, y: (firstPt.y + secPt.y)/2};
                        var dist=getDots(firstPt, secPt).d;
                        var dist2=getDots(coord(p.x, p.y), secPt).d;
                        var dist4=getDots(coord(p.x, p.y), midPt).d;
                        dotProduct=Math.abs(((midPt.x-p.x)*(secPt.x-firstPt.x)+(midPt.y-coord(p.x, p.y).y)*(secPt.y-firstPt.y))/dist); 
                        perpendicularDist=Math.sqrt(Math.pow(dist4,2)-Math.pow(dotProduct,2));
                        var dist3=getDots(firstPt, coord(p.x, p.y)).d;
                        
                        if(dist3<=p.r||dist2<=p.r||(dotProduct<=dist/2 && perpendicularDist<=p.r)||c.isPointInPath(p.x, coord(p.x, p.y).y)) {
                            die();
                        } 
                };
                c.lineTo(v, w);
            }
            // 
            c.closePath();
            c.fill();
        }
            
        
    }
    
    function deg2rad(degrees)
    {
      var pi = Math.PI;
      return degrees * (pi/180);
    }
    
    var newGear = function(y,rad,ospd,dir, noOfPartitions, seperate=false, secondGear=false){
        var c1 = newObject(W/2, 100+obstacles.sep*y, rad, Math.floor(4*Math.random()));
        c1.connectionRadius=10;
        c1.teeth=16-16%noOfPartitions;
        c1.div=(c1.teeth*2/noOfPartitions);
        c1.angularSpeed=ospd*dir;
        c1.diameter = c1.teeth * 4 * c1.connectionRadius;
        c1.radius = c1.diameter / (2 * Math.PI);
        console.log(dir);
        if(seperate)
            c1.x=W/2+dir*c1.radius;
        c1.phi0 = 0;
        c1.n=noOfPartitions;
        c1.phiDegrees=0;
        c1.secondGear=secondGear;
        if(secondGear)
            c1.phi0=2*Math.PI/(c1.div*c1.n);
        c1.draw = function () {
            var coordinate=coord(c1.x, c1.y);
            c1.phiDegrees += c1.angularSpeed;
            var phi = c1.phi0 + deg2rad(c1.phiDegrees);
            c.fillStyle = c1.fillStyle;
            for (var i = 0; i < c1.teeth * 2; i++) {
                var alpha = 2 * Math.PI * (i / (c1.teeth * 2)) + phi;
                if(i%c1.div==0) {
                    var initial=alpha-Math.PI/(c1.div*c1.n);
                    if(c1.secondGear) {
                      c.save();
                      c.translate(W, 0);
                      c.scale(-1, 1);  
                    }
                    
                    c.beginPath();
                c.lineTo(coordinate.x + Math.cos(initial) * c1.radius*0.75, coordinate.y + Math.sin(initial) * c1.radius*0.75);
                }
                var color=gCol((i-i%c1.div)/c1.div, c1.n);
                c.fillStyle=color;
                
                var x = coordinate.x + Math.cos(alpha) * c1.radius;
                var y = coordinate.y + Math.sin(alpha) * c1.radius;
                c.arc(x, y, c1.connectionRadius, -Math.PI / 2 + alpha, 
                            Math.PI / 2 + alpha, i % 2 == 0);
                if(color!=p.c && !died && getDots(coord(p.x,p.y), {x: x, y:y}).d < p.r+c1.connectionRadius && (i%2!=0)) {
                    die();
                }
                if(i%c1.div==c1.div-1) {
                    c.lineTo(coordinate.x + Math.cos(initial+2*Math.PI/c1.n) * c1.radius*0.75, coordinate.y + Math.sin(initial+2*Math.PI/c1.n) * c1.radius*0.75);
                    c.arc(coordinate.x, coordinate.y, 0.75*c1.radius, initial+2*Math.PI/c1.n, initial, true);
                    if(color!=p.c && !died && (getDots(coord(p.x,p.y), coordinate).d < p.r+0.75*c1.radius) && (getDots(coord(p.x,p.y), coordinate).d > 0.75*c1.radius-p.r)) {
                        var pa = modAng(getDots(coord(p.x,p.y), coordinate).a);
                        var initial=modAng(initial);
                        var final=modAng(initial + 2*Math.PI/c1.n);
                        if(initial>Math.PI && final<Math.PI) {
                            var u=initial-Math.PI*2;
                            if(pa>Math.PI)
                                pa-=Math.PI*2;
                        }
                        else
                            var u = initial;
                        if(pa>u && pa<final) {
                           die(); 
                        }
                    }
                    
                    c.fill();
                    if(c1.secondGear)
                        c.restore();
                }
                
            }
        };
    };
    var newC1 = function(y,rad,ospd,dir, n, seperate=false){
        var width=seperate?(W/2+dir*1.075*rad):W/2;
        var c1 = newObject(width,100+obstacles.sep*y,rad,Math.floor(n*Math.random()));
        console.log(c1.c);
        c1.angle = 0;
        c1.spd = dir*cspd*ospd;
        c1.w = c1.r*15/100;
        c1.d=dir;
        c1.n=n;
        c1.seperate=seperate;
        c1.draw = function(){
            var co = coord(c1.x,c1.y);
            c.lineWidth = c1.w;
            for(var j = 0; j < c1.n; j++){
                c.beginPath();
                c1.color = gCol(j+c1.c, c1.n);
                if(c1.seperate && (c1.n)%2==0) {
                    if(c1.d!=1) {
                       c1.color = gCol(j, c1.n); 
                    }  
                    else {
                        if(j<c1.n/2) {
                            c1.color = gCol(c1.n/2-1-j , c1.n);
                        }
                        else {
                            c1.color = gCol(3*c1.n/2-1-j, c1.n);
                        }
                    }
                }
                c.strokeStyle=c1.color;
                var a = modAng(c1.angle+(Math.PI*2/c1.n)*j);
                var a2 = modAng(a+Math.PI*2/c1.n);
                if(c1.color != p.c && !died){
                    var dots = getDots(co,coord(p.x,p.y));
                    if(dots.d+p.r > c1.r-c1.w/2 && dots.d-p.r < c1.r+c1.w/2){
                        var pa = modAng(-dots.a);
                        if(a>Math.PI && a2<Math.PI) {
                            var u=a-Math.PI*2;
                            if(pa>Math.PI)
                                pa-=Math.PI*2;
                        }
                        else
                            var u = a;
                        if(pa > u && pa < a2){
                            die();
                        };
                    };
                };
                c.arc(co.x,co.y,c1.r,a,a2);
                c.stroke();
            };
            c1.angle += c1.spd*Math.PI/180;
        };
    };
    var newParticle = function(x,y){
        var part = newObject(x,y,5,rCol());
        part.g = 0.6;
        part.hspd = rRange(-10,10);
        part.vspd = rRange(10,20);
        part.move = function(){
            with(part){
                vspd -= g;
                x += hspd;
                y += vspd;
                if(x < 0 || x > W){
                    hspd *= -1;
                };
                if(y < camY){
                    destroy();
                };
            };
        };
    };
    var newSwitch = function(n, noOfColors){
        var sw = newObject(W/2,100+obstacles.sep*n-obstacles.sep/2,15,'#FFF');
        sw.move = function(){
            if(getDots({x:sw.x,y:sw.y},{x:p.x,y:p.y}).d < p.r+sw.r){
                p.c = gPCol(noOfColors);
                sw.destroy();
            };
        };
        sw.draw = function(){
            var co = coord(sw.x,sw.y);
            for(var i = 0; i < noOfColors; i++){
                var a = i*Math.PI*2/noOfColors-Math.PI/2;
                c.fillStyle = col[i];
                c.beginPath();
                c.lineTo(co.x,co.y);
                c.arc(co.x,co.y,sw.r,a,a+Math.PI*2/noOfColors);
                c.lineTo(co.x,co.y);
                c.fill();
            };
        };
    };
    var newStar = function(n){
        var st = newObject(W/2,100+obstacles.sep*n,15,'#DDD');
        st.score = choose(1,1,1,1,10);
        if(p.sprite!=0)
            st.score=1;
        if(st.score==10) 
            st.c="darkblue";
        console.log(st.c);
        st.a = 0;
        st.rs = st.r;
        st.move = function(){
            if(getDots({x:p.x,y:p.y},{x:st.x,y:st.y}).d < st.r){
                score += st.score;
        if(st.score==10) {
            p.sprite=new Sprite({
                ctx:c,
                image: glowImage,
                width: 299,
                height: 298,
                numberOfFrames: 9,
                ticksPerFrame: 4,
                canvasX: p.x,
                canvasY:p.y
              });
            p.sprite.render = function() {
                console.log(this.width*3 / this.numberOfFrames);
                var co=coord(p.x, p.y);
                this.ctx.drawImage(
                this.image,
                (this.frameIndex%3) * this.width*3 / this.numberOfFrames,
                ((this.frameIndex-this.frameIndex%3)/3)*this.height*3/ this.numberOfFrames,
                this.width*3 / this.numberOfFrames,
                this.height*3 / this.numberOfFrames,
                co.x-25,
                co.y-25,
                50,
                50
                )
            }
            setTimeout(function() {
                p.sprite=0;
            }, 10000);
            }
                st.destroy();
            };
            st.r = st.rs+1.2*Math.sin((st.a++)/180*Math.PI*4);
        };
        st.draw = function(){
            dStar(st.x,st.y,st.r,0,st.c,1,st.score == 1);
        };
    };
    var newCoin = function(n){
        var st = newObject(W/2,100+obstacles.sep*n,15,'#DDD');
        st.firstCoin=flag2;
        st.sprite = new Sprite({
            ctx:c,
            image: coinImage,
            width: 1000,
            height: 100,
            numberOfFrames: 10,
            ticksPerFrame: 4,
            canvasX: st.x,
            canvasY:st.y
          });
        st.score = choose(1,1,1,1,1,1,10);
        st.move = function(){
            if(getDots({x:p.x,y:p.y},{x:st.x,y:st.y}).d < st.r){
                score += st.score;
                st.destroy();
                console.log(flag2);
                if(st.firstCoin==1) {
                    console.log("yes");
                    b=0;
                    setTimeout(function() {
                        b=parseInt(localStorage.getItem("level"));
                    },10000); 
                }
            };
        };
        st.draw = function(){
            this.sprite.update();
            this.sprite.render();
        };
    };
    
    class Sprite {
        constructor(options) {
            this.ctx = options.ctx;
    
            this.image = options.image;
    
            this.frameIndex = 0;
            this.tickCount = 0;
            this.ticksPerFrame = options.ticksPerFrame || 0;
            this.numberOfFrames = options.numberOfFrames || 1;
    
            this.width = options.width;
            this.height = options.height;
            this.canvasX=options.canvasX;
            this.canvasY=options.canvasY;
        }
    
        update() {
            this.tickCount++;
    
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                if (this.frameIndex < this.numberOfFrames - 1) {
                    this.frameIndex++;
                } else {
                    this.frameIndex = 0;
                }
            }
        }
    
        render() {
            var co=coord(this.canvasX, this.canvasY);
            this.ctx.drawImage(
                this.image,
                this.frameIndex * this.width / this.numberOfFrames,
                0,
                this.width / this.numberOfFrames,
                this.height,
                co.x-15,
                co.y-15,
                30,
                30
            )
        }
    }
    var dStar = function(x,y,r1,ang,col,alpha,outline){
        var co = coord(x,y);
        c.fillStyle = col;
        c.strokeStyle = "white";
        c.lineWidth = 5;
        c.globalAlpha = alpha;
        c.beginPath();
        for(var j = 0; j <= 5; j++){
            var a1 = j*Math.PI*2/5-Math.PI/2-ang;
            var a2 = a1+Math.PI/5;
            var r2 = r1*0.5;
            c.lineTo(co.x+r1*Math.cos(a1),co.y+r1*Math.sin(a1));
            c.lineTo(co.x+r2*Math.cos(a2),co.y+r2*Math.sin(a2));
        };
        if(outline){
            c.fill();
        }else{
            c.stroke();
            c.fill();
        }
        c.globalAlpha = 1;
    };
    p.yy = p.y;
    var clicked = false;
    var after;
    canvas.addEventListener('click', function(){clicked = true;});
    function playGame(){
        startTime=Date.now();
        c.fillStyle = '#222';
        c.fillRect(0,0,W,H);
        c.fillStyle = '#FFF';
        c.font = '30px Arial';
        c.textAlign = 'left';
        c.fillText(score,10,30);
        c.font = '50px Arial';
        c.textAlign = 'center';
        c.fillText('COLOR',W/2,coord(0,250).y);
        c.fillText('SWITCH',W/2,coord(0,200).y);
        while(obstacles.n < 2+Math.floor(camY/obstacles.sep)){
            console.log(b);
            obstacles.n += 1;
            var caseAlpha=choose(0,0,0,0,1,2,2,3,3,3,3,3,3,3,3,3,4,4,5, 5, 5, 6,6,7,7,8,8,9,9,10,10,11,11,12,12, 13, 13, 13,14, 14);
            if(after) {//
                caseAlpha=8;
                after=false;
            }
            console.log(caseAlpha);
            var noOfColors=4;
            switch(caseAlpha){
            case 0:
                var speeds=[0.75, 1, 1.25, 1.5, 1.75, 2];
                var radiusCircle=choose(100,100,70);
                noOfColors=(radiusCircle==100)?(2+Math.floor(Math.random()*5)):(2+Math.floor(Math.random()*3));
                newC1(obstacles.n, radiusCircle,speeds[b],choose(-1,1), noOfColors);
                break;
            case 1:
                var speeds=[0.75,1,1.1,1.2,1.3,1.4];
                noOfColors=2+Math.floor(Math.random()*4);
                var direction=choose(-1, 1);
                newC1(obstacles.n,100,(speeds[b]*2)/3,direction, noOfColors);
                newC1(obstacles.n,70,speeds[b],direction*(-1), noOfColors);
                break;
            case 2:
                var speeds=[0.75,1,1.1,1.2,1.3,1.4];
                newW8(obstacles.n, speeds[b]);
                break;
            case 3:
                var speeds=[0.75,1,1.2,1.4,1.6,1.8];
                noOfColors=Math.floor(3+Math.random()*6);
                rectangle(obstacles.n,100,speeds[b],1, noOfColors);
                break;
            case 4:
                newHearts(obstacles.n);
                break;
            case 5:
                var speeds=[0.75,1,1.2,1.4,1.6,1.8];
                sineWave(obstacles.n,50,speeds[b],0);
                break;
            case 6:
                var speeds=[0.75,1,1.15,1.3,1.45,1.6];
                noOfColors=Math.floor(3+Math.random()*3);
                fan(obstacles.n, 110, speeds[b], choose(-1,1), noOfColors);
                break;
            case 7:
                var speeds=[0.75,1,1.15,1.3,1.45,1.6];
                noOfColors=Math.floor(3+Math.random()*3);
                fan(obstacles.n, 100, speeds[b], 1, noOfColors);
                fan(obstacles.n, 100, (speeds[b]*2)/3, -1, noOfColors);
                break;
            case 8:
                var speeds=[0.75, 1, 1.25, 1.5, 1.75, 2];
                noOfColors=choose(2, 4, 6);
                newC1(obstacles.n,75,speeds[b],1,noOfColors, true);
                newC1(obstacles.n,75,speeds[b],-1,noOfColors, true);
                break;
            case 9:
                var speeds=[0.75, 1, 1.1, 1.25, 1.4, 1.5];
                noOfColors=choose(3, 4);
                movingBlocks(obstacles.n,1,speeds[b],1,noOfColors);
                movingBlocks(obstacles.n,2,speeds[b],-1,noOfColors);
                movingBlocks(obstacles.n,3,speeds[b],1,noOfColors);
                after=true;
                break;
            case 10:
                var speeds=[0.75, 1, 1.1, 1.25, 1.4, 1.5];
                noOfColors=3+Math.floor(Math.random()*4);
                movingBlocks(obstacles.n,1,speeds[b],1, noOfColors, true);
                movingBlocks(obstacles.n,2,speeds[b],-1, noOfColors, true);
                break;
            case 11:
                var speeds=[0.75,1,1.2,1.4,1.6,1.8];
                sineWave(obstacles.n,50,speeds[b],0);
                sineWave(obstacles.n,50,speeds[b],Math.PI);
                break;
            case 12:
                var speeds=[0.75, 1, 1.1, 1.25, 1.4, 1.5];
                noOfColors=3+Math.floor(Math.random()*4);
                movingHBlocks(obstacles.n,speeds[b],1, noOfColors);
                movingHBlocks(obstacles.n,speeds[b],-1, noOfColors);
                break;
            case 13:
                var speeds=[0.75, 1, 1.25, 1.5, 1.75, 2];
                noOfColors=(2+Math.floor(Math.random()*5));
                newGear(obstacles.n, 100, speeds[b], choose(1, -1), noOfColors);
                break;
            case 14:
                var speeds=[0.75, 1, 1.25, 1.5, 1.75, 2];
                noOfColors=(3+Math.floor(Math.random()*4));
                newGear(obstacles.n, 100, speeds[b], 1, noOfColors, true, false);
                newGear(obstacles.n, 100, speeds[b], 1, noOfColors, true, true);
                break;
            };
            if(obstacles.n!=1)
                newSwitch(obstacles.n, noOfColors);
            else
                p.c = gPCol(noOfColors);
            var coinChoice=choose(1,1,1,1,1,1,1,1,1,0);
            console.log(flag2);
            if(coinChoice==0||flag2==1) {
                flag2=(flag2==1?0:1);
                newCoin(obstacles.n);
            }    
            else {
                flag2=0;
                newStar(obstacles.n);
            }  
            cspd *= 1.04;
        };
        if(!died){
            if(clicked){
                p.spd = p.spdMax;
                if(p.acc == 0){
                    p.spd *= 1.2;
                    p.acc = -0.3;
                };
            };
            with(p){
                spd = Math.max(spd+acc,-spdMax);
                y = Math.max(y+spd,yy);
                if(y < camY){
                     die();
                };
                if(sprite==0) {
                    dCircle(coord(x,y),r,c);
                }
                else {
                    p.sprite.update();
                    p.sprite.render();
                }
            };
    };    
        for(var i in objects){
            objects[i].update();
        };
        for(var i = 0; i < objects.length-1; i++){
            if(objects[i].destroyed){
                objects.splice(i,1);
            };
        camY = Math.max(camY,p.y-250);};
            
        T += TT;
        if(T > 70){
            console.log(2);console.log(died,TT);
            c.globalAlpha = 0.7;
            c.fillStyle = '#000';
            c.fillRect(0,0,W,H);
            c.globalAlpha = 1;
            c.fillStyle = '#000';
            c.strokeStyle = '#EEE';
            c.lineWidth = 2;
            c.fillText('GAME OVER',W/2,H/2);
            c.strokeText('GAME OVER',W/2,H/2);
            var otherScore=localStorage.getItem("player2")
            if(otherScore!="") {
                if(otherScore==score)
                    var text="TIED";
                else
                    var text=(otherScore>score)?"YOU LOSE":"YOU WIN";  
            }
            else {
                var text="";
            }
            c.fillText(text,W/2,H/2+50);
            c.strokeText(text,W/2,H/2+50);
            localStorage.setItem("player1", score);
            // if(clicked){
            //     score = 0;
            //     T = 0;
            //     TT = 0;
            //     camY = 0;
            //     cspd = 1;
            //     died = false;
            //     p.y = H*1/4;
            //     p.acc = 0;
            //     p.spd = 0;
            //     objects = [];
            //     obstacles.n = 0;
            //     b=parseInt(localStorage.getItem("level"));
            //     flag2=0;
            //     p.sprite=0;
            //     muted=false;
            // };
        };
        clicked = false;
    }
    setInterval(playGame, 1000/FPS);
    
    });
    var keys = {
        38:{down:false, action:function(){document.getElementById("gameBoard1").click();}},
        85:{down:false, action:function(){document.getElementById("gameBoard").click();}},
    };
    document.addEventListener("keydown", function (e) {
        if(keys[e.keyCode]) keys[e.keyCode].down = true;
    });
    document.addEventListener("keyup", function (e) {
        if(keys[e.keyCode]) keys[e.keyCode].down = false;
    });

    (function update() {
        for(var key in keys)
            if(keys[key].down)
                keys[key].action();

        // redraw players. 

        requestAnimationFrame(update);
    })();