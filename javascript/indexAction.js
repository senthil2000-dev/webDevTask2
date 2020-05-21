var c = document.getElementById('canv');
var $ = c.getContext('2d');


var col = function(x, y, r, g, b) {
  $.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
  $.fillRect(x, y, 1,1);
}
var R = function(x, y, t) {
  return( Math.floor(192 + 64*Math.cos( (x*x-y*y)/300 + t )) );
}

var G = function(x, y, t) {
  return( Math.floor(192 + 64*Math.sin( (x*x*Math.cos(t/4)+y*y*Math.sin(t/3))/300 ) ) );
}

var B = function(x, y, t) {
  return( Math.floor(192 + 64*Math.sin( 5*Math.sin(t/9) + ((x-100)*(x-100)+(y-100)*(y-100))/1100) ));
}

var t = 0;

var run = function() {
  for(x=0;x<=35;x++) {
    for(y=0;y<=35;y++) {
      col(x, y, R(x,y,t), G(x,y,t), B(x,y,t));
    }
  }
  t = t + 0.120;
  window.requestAnimationFrame(run);
}

run();
document.getElementsByClassName("modal1")[0].style.display="none";
function modals(item) {
    var modal = document.getElementById("myModal");
    var btn = document.getElementsByClassName("btn1");
    var span = document.getElementsByClassName("close1")[0];
    if(item=="playGame") {
        modal.style.display = "block";
        addHtml(item);
        span.onclick = function() {
                    modal.style.display = "none";
                    }
    }
}
function addHtml(button) {
    var modalbody=document.getElementsByClassName("modal-body1")[0];
    var modalheading=document.querySelector(".modal-header1 h2");
    if(button=="playGame") {
        modalheading.innerHTML="DIFFICULTY MODES";
        modalbody.innerHTML="<input class='target' type='number' placeholder='Enter difficulty level(1-5)'></input>";
        modalbody.innerHTML+="<input class='target' type='number' placeholder='Number of players(1 or 2)'></input>";
        modalbody.innerHTML+="<button class='target'>PLAY NOW</button></form>";
      }
    var playButton=modalbody.querySelectorAll('.target')[2];
    playButton.addEventListener("click", function() {
      setGame();
    });
}

function setGame() {
        var invalid=false;
        var difficultyLevel = document.querySelectorAll(".target")[0].value? document.querySelectorAll(".target")[0].value : 1;
        var noOfPlayers = document.querySelectorAll(".target")[1].value? document.querySelectorAll(".target")[1].value : 1;
                if(!([1, 2, 3, 4, 5].includes(parseInt(difficultyLevel)))) {
                    alert("Difficulty modes range between 1 and 5: Enter a valid number");
                    invalid=true;
                    console.log(1, difficultyLevel);
                }
                else if(noOfPlayers!=1 && noOfPlayers!=2) {
                  alert("Enter a valid number of players (1 or 2)");
                  invalid=true;
                  console.log(12);
                }
          if(!invalid) {
              localStorage.setItem("level", parseInt(difficultyLevel));
              localStorage.setItem("noOfPlayers", parseInt(noOfPlayers));
              console.log(noOfPlayers);
              if(noOfPlayers==1)
                window.location.href="a.html";
              else if(noOfPlayers==2)
                window.location.href="b.html";
          } 
        }
        window.onclick = function(event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementsByClassName("close1")[0].click();
      }
    }
