const W_KEY = 119;
const A_KEY = 97;
const S_KEY = 115;
const D_KEY = 100;
const RUNNING = "running";
const PAUSED = "paused";

function estadoPaisaje(e){
  // var aux = document.getElementsByClassName("capa1");
  // for (var i = 0; i < aux.length; i++) {
  //   aux[i].style.animationPlayState = e;
  // }
  document.getElementById("capa1").style.animationPlayState = e;
  document.getElementById("capa2").style.animationPlayState = e;
  document.getElementById("capa3").style.animationPlayState = e;
}

function walk(){
  document.getElementById("personaje").style.animation = "walk 0.7s steps(9, end) infinite";
}

function jump(){
  document.getElementById("personaje").style.animation = "jump 0.7s steps(10, end)";
}

function idle(){
  document.getElementById("personaje").style.animation = "idle 3s steps(10, end) infinite";
}

function headbutt(){
  document.getElementById("personaje").style.animation = "headbutt 0.7s steps(9, end)";
}

document.onkeypress = function(e){
  e = e || window.event;
  switch(e.keyCode) {
    case W_KEY:
      jump();
      estadoPaisaje(RUNNING);
      window.setTimeout(walk,700);
      break;
    case A_KEY:
      headbutt();
      estadoPaisaje(RUNNING);
      window.setTimeout(walk,700);
      break;
    case S_KEY:
      idle();
      estadoPaisaje(PAUSED);
      break;
    case D_KEY:
      walk();
      estadoPaisaje(RUNNING);
      break;
    default:
      idle();
  }
}
