const W_KEY = 119;
const A_KEY = 97;
const S_KEY = 115;
const D_KEY = 100;
const RUNNING = "running";
const PAUSED = "paused";
const MAX_PACE = 8;
const MIN_PACE = 5;
const MAX_RATIO = 5;
const MIN_RATIO = 1;
var pace;
var ratio;
var puntos;
var puntaje;
var fabrica;
var estadoAnimPaisaje;
var animHandler;
var capa1;
var capa2;
var capa3;
var personaje;
var pj;

function inicializarVariables(){
  pace = 4;
  ratio = 1;
  puntos = 0;
  puntaje = document.getElementById("puntaje");
  puntaje.innerHTML = puntos;
  fabrica = new EnemyFactory();
  estadoAnimPaisaje = PAUSED;
  capa1 = document.getElementById("capa1");
  capa2 = document.getElementById("capa2");
  capa3 = document.getElementById("capa3");
  personaje = document.getElementById("personaje");
  pj = new Character(100,570);
  playGame();
}

function Character(posX,posY){
  this.posX = posX;
  this.posY = posY;
  this.enAccion = false;
  this.tipoAccion = 0;
  this.vidas = 100;
}

function Enemigo(posX,tipoAccion){
  this.posX = posX;
  this.tipoAccion = tipoAccion;
  this.divID = null;
}

Enemigo.prototype.setID = function () {
  this.divID = puntos;
};

Enemigo.prototype.enCuadro = function () {
  if(this.posX<-100){
    return false;
  }
  else{
    return true;
  }
};

Enemigo.prototype.colisiona = function () {
  if((this.posX>60)&&(this.posX<120)&&(pj.tipoAccion!=this.tipoAccion)){
    return true;
  }
  else{
    return false;
  }
};

function EnemyFactory(){
  var enemigos = [];
  this.enemigos = enemigos;
}

EnemyFactory.prototype.crearEnemigo = function () {
  var e1 = new Enemigo(1000,2);
  var div = document.createElement('div');
  div.className = "juego enemigo";
  e1.divID = puntos;
  div.id = e1.divID;
  document.getElementById("personajes").appendChild(div);
  this.enemigos.push(e1);
};

function corregirPace(num,ms){
  if(pace+num>MAX_PACE){
    pace = MAX_PACE;
  }
  else if(pace+num<MIN_PACE){
    pace = MIN_PACE;
  }
  else {
    pace = pace + num;
    setTimeout(corregirPace(num,ms),ms);
  }
}

function estadoPaisaje(e){
  if(estadoAnimPaisaje!=e){
    estadoAnimPaisaje = e;
    if(estadoAnimPaisaje==PAUSED){
      if(pace>4){ window.corregirPace(-1,700); }
    }
    else{
      if(pace<10){ window.corregirPace(1,700); }
    }
  }
  capa1.style.animationPlayState = e;
  capa2.style.animationPlayState = e;
  capa3.style.animationPlayState = e;
}

function personajeOcioso(){
  pj.enAccion = false;
  pj.tipoAccion = 0;
  walk();
}

function walk(){
  personaje.style.animation = "walk 0.7s steps(9, end) infinite";
}

function jump(){
  pj.enAccion = true;
  pj.tipoAccion = 1;
  personaje.style.animation = "jump 0.5s steps(10, end)";
}

function idle(){
  personaje.style.animation = "idle 3s steps(10, end) infinite";
}

function headbutt(){
  pj.enAccion = true;
  pj.tipoAccion = 2;
  personaje.style.animation = "headbutt 0.7s steps(9, end)";
}

function die(){
  personaje.style.animation = "die 0.5s steps(1, end)";
}

document.onkeypress = function(e){
  e = e || window.event;
  if(pj.enAccion==false){
    switch(e.keyCode) {
      case W_KEY:
        jump();
        estadoPaisaje(RUNNING);
        animHandler = window.setTimeout(personajeOcioso,500);
        break;
      case A_KEY:
        headbutt();
        estadoPaisaje(RUNNING);
        animHandler = window.setTimeout(personajeOcioso,700);
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
}

function flashPoints(segundos){
  puntaje.style.animation = "flash "+segundos+"s";
  setTimeout(function(){ puntaje.style.animation = ""; },segundos*1000);
}

function avanzarEnemigos() {

  if((puntos%100)==0){
    if(ratio<MAX_RATIO){ ratio=ratio+0.2; }
    flashPoints(0.5);
    fabrica.crearEnemigo();
  }
  for (var i = 0; i < fabrica.enemigos.length; i++) {
    if(fabrica.enemigos[i].enCuadro()==true){
      fabrica.enemigos[i].posX = fabrica.enemigos[i].posX - (pace*ratio);
      document.getElementById(fabrica.enemigos[i].divID).style.left = fabrica.enemigos[i].posX +"px";
      if(fabrica.enemigos[i].colisiona()){
        die();
        pj.vidas--;
        window.clearTimeout(animHandler);
        window.setTimeout(function () { pj.enAccion = false; }, 300);
        estadoPaisaje(PAUSED);
      }
    }
    else{
      document.getElementById(fabrica.enemigos[i].divID).remove();
      fabrica.enemigos.splice(i,1);
      i--;
    }
  }
  puntos = setTimeout(playGame, 40);
  puntaje.innerHTML = puntos;
}

function playGame(){
  if(pj.vidas>0){
    avanzarEnemigos();
  }
  else{
    console.log('GAME OVER');
  }
}

document.getElementById("jugar").onclick = function(){
  document.getElementById("jugar").style.visibility = "hidden";
  inicializarVariables();
};
