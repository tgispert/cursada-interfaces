//variables
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
const FX_VOL = 0.3;
const MUSIC_VOL = 0.6;
var enemyInterval = 50;
var pace;
var ratio;
var puntos;
var puntaje;
var vida;
var fabrica;
var estadoAnimPaisaje;
var animHandler;
var capa1;
var capa2;
var capa3;
var personaje;
var pj;
var musica;

//inicializacion de variables
function inicializarVariables(){
  //ritmo al cual avanzan los enemigos
  pace = 4;
  //proporcional que modifica el ritmo al cual avanzan los enemigos
  ratio = 1;
  puntos = 0;
  puntaje = document.getElementById("puntaje");
  puntaje.innerHTML = puntos;
  personaje = document.getElementById("personaje");
  pj = new Character(100,570);
  //barra de vida en la ui
  vida = document.getElementById("vida");
  vida.style.width = ""+pj.vida+"%";
  //fabrica de enemigos
  fabrica = new EnemyFactory();
  //paisaje
  estadoAnimPaisaje = PAUSED;
  capa1 = document.getElementById("capa1");
  capa2 = document.getElementById("capa2");
  capa3 = document.getElementById("capa3");
  //musica
  musica = new Audio('fx/music.wav');
  musica.volume = MUSIC_VOL;
  musica.play();
  //loop de musica
  musica.addEventListener('ended', function(){
    this.currentTime = 0;
    this.play();
  }, false);
}

//se corresponde con #personaje
function Character(posX,posY){
  this.posX = posX;
  this.posY = posY;
  this.enAccion = false;
  //saltando=1, pegando=2
  this.tipoAccion = 0;
  this.vida = 100;
  //audios
  var hit = new Audio('fx/hit.wav');
  hit.volume = FX_VOL;
  this.hitAudio = hit;
  var jump = new Audio('fx/jump.wav');
  jump.volume = FX_VOL;
  this.jumpAudio = jump;
  var die = new Audio('fx/die.wav');
  die.volume = FX_VOL;
  this.dieAudio = die;
}

//actualiza la vida del personaje y la barra en la ui
Character.prototype.actualizarVida = function(){
  this.vida = this.vida-4;
  vida.style.width = pj.vida+"%";
};

//se corresponde con cada .enemigo
function Enemigo(posX,tipoAccion){
  this.posX = posX;
  //saltable=1, rompible=2
  this.tipoAccion = tipoAccion;
  this.divID = null;
}

//retorna si el enemigo esta dentro de los limites del juego
Enemigo.prototype.enCuadro = function(){
  if(this.posX<-100){
    return false;
  }
  else{
    return true;
  }
};

//retorna si el enemigo colisiona con el personaje
Enemigo.prototype.colisiona = function(){
  //si choca y no esta haciendo la accion que requiere para pasar al enemigo
  //(tipoAccion==1 -> saltable) || (tipoAccion==2 -> rompible)
  if((this.posX>60)&&(this.posX<130)&&(pj.tipoAccion!=this.tipoAccion)){
    return true;
  }
  else{
    return false;
  }
};

//se encarga de animar el enemigo si el personaje esta golpeando y esta en rango de golpe
Enemigo.prototype.rangoGolpe = function () {
  //rompible
  if(this.tipoAccion==2){
    //en rango de golpe
    if((this.posX>130)&&(this.posX<160)){
      //audio de muerte
      var tofu = document.getElementById(this.divID);
      var audio = new Audio('fx/tofu.wav');
      audio.volume = FX_VOL;
      audio.play();
      //animacion
      tofu.style.animation = "tofuDie 0.5s steps(5, end)";
      //luego de la animacion hace desaparecer visualmente el enemigo
      window.setTimeout(function(){ tofu.style.display = "none"; },500);
    }
  }
};

//clase encargada del manejo de creacion de enemigos
function EnemyFactory(){
  var enemigos = [];
  this.enemigos = enemigos;
}

//crea un enemigo y lo agrega al html, tipo=1|2 (saltable|rompible)
EnemyFactory.prototype.crearEnemigo = function(tipo){
  var e1 = new Enemigo(1000,tipo);
  var div = document.createElement('div');
  if(tipo==1){
    div.className = "juego enemigo enemigoBola";
  }
  else{
    div.className = "juego enemigo enemigoTofu";
  }
  //el id de cada enemigo es el numero de puntos al momento de crearlo
  e1.divID = puntos;
  div.id = e1.divID;
  document.getElementById("personajes").appendChild(div);
  this.enemigos.push(e1);
};

//crea un enemigo al azar
EnemyFactory.prototype.crearEnemigoRandom = function () {
  if((pj.vida>0)){
    if(Math.floor((Math.random()*2)+1)!=0){
      this.crearEnemigo(Math.floor((Math.random()*2)+1));
    }
  }
};

//corrige de forma progresiva el ritmo al cual avanzan los enemigos
function corregirPace(num,ms){
  if(pace+num>MAX_PACE){
    pace = MAX_PACE;
  }
  else if(pace+num<MIN_PACE){
    pace = MIN_PACE;
  }
  else {
    //va sumandole num cada ms segundos hasta llegar
    //al MAX_PACE o MIN_PACE para que la aceleracion no sea tan brusca
    pace = pace + num;
    setTimeout(corregirPace(num,ms),ms);
  }
}

//detiene o reanuda el estado de la animacion del paisaje
function estadoPaisaje(e){
  if(estadoAnimPaisaje!=e){
    estadoAnimPaisaje = e;
    if(estadoAnimPaisaje==PAUSED){
      //cuando se detiene el paisaje desacelera los enemigos
      if(pace>4){ window.corregirPace(-1,700); }
    }
    else{
      //cuando se reanuda el paisaje desacelera los enemigos
      if(pace<10){ window.corregirPace(1,700); }
    }
  }
  capa1.style.animationPlayState = e;
  capa2.style.animationPlayState = e;
  capa3.style.animationPlayState = e;
}

//marca al personaje con enAccion=false para saber que no esta haciendo
//ninguna accion de importancia (saltar|pegar)
function personajeOcioso(){
  pj.enAccion = false;
  pj.tipoAccion = 0;
  walk();
}

//asigna al personaje la animacion de caminar
function walk(){
  pj.tipoAccion = 0;
  personaje.style.animation = "walk 0.7s steps(9, end) infinite";
}

//asigna al personaje la animacion de saltar
function jump(){
  pj.enAccion = true;
  pj.tipoAccion = 1;
  //reproduce el sonido asignado al salto
  pj.jumpAudio.play();
  personaje.style.animation = "jump 0.5s steps(10, end)";
}

//asigna al personaje la animacion de quedarse en el lugar
function idle(){
  pj.tipoAccion = 0;
  personaje.style.animation = "idle 3s steps(10, end) infinite";
}

//asigna al personaje la animacion de golpear
function headbutt(){
  pj.enAccion = true;
  pj.tipoAccion = 2;
  //reproduce el sonido asignado al golpe
  pj.hitAudio.play();
  personaje.style.animation = "headbutt 0.7s steps(9, end)";
}

//asigna al personaje la animacion de muerte
function die(){
  pj.tipoAccion = 0;
  //reproduce el sonido asignado al muerte
  pj.dieAudio.play();
  personaje.style.animation = "die 0.3s steps(1, end)";
}

//se encarga de manejar la deteccion de teclas apretadas
document.onkeypress = function(e){
  e = e || window.event;
  if(pj.enAccion==false){
    switch(e.keyCode) {
      case W_KEY:
        jump();
        estadoPaisaje(RUNNING);
        //animHandler guarda los timeout de las animaciones para terminar
        //cualquier animacion en caso de colision con un enemigo
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
        walk();
    }
  }
}

//le asigna una animacion a los puntos en la ui
function flashPoints(segundos){
  puntaje.style.animation = "flash "+segundos+"s";
  setTimeout(function(){ puntaje.style.animation = ""; },segundos*1000);
}

//se encarga de manejar el avance de los enemigos
function avanzarEnemigos() {
  //cada 100 puntos aumenta el ratio al cual se mueven los enemigos
  if((puntos%100)==0){
    if(ratio<MAX_RATIO){ ratio=ratio+0.2; }
    flashPoints(0.5);
  }
  //recorre todos los enemigos en la fabrica
  for (var i = 0; i < fabrica.enemigos.length; i++) {
    if(fabrica.enemigos[i].enCuadro()==true){
      //actualiza la posicion en el objeto
      fabrica.enemigos[i].posX = fabrica.enemigos[i].posX - (pace*ratio);
      //actualiza la posicion en el html
      document.getElementById(fabrica.enemigos[i].divID).style.left = fabrica.enemigos[i].posX +"px";
      if(fabrica.enemigos[i].colisiona()){
        //si colisiona hace la animacion de muerte
        die();
        window.clearTimeout(animHandler);
        window.setTimeout(function(){ pj.enAccion = false; }, 400);
        //detiene el paisaje
        estadoPaisaje(PAUSED);
        //actualiza la vida
        pj.actualizarVida();
      }
      else {
        //si no hay colision pero esta golpeando y el enemigo esta en rango
        //llama a rangoGolpe() para animar al enemigo
        if(fabrica.enemigos[i].tipoAccion==2){
          fabrica.enemigos[i].rangoGolpe();
        }
      }
    }
    else{
      //si enCuadro()==false
      //borra al enemigo del html y de la fabrica
      document.getElementById(fabrica.enemigos[i].divID).remove();
      fabrica.enemigos.splice(i,1);
      i--;
    }
  }
  //para una animacion fluida llama a la funcion playGame() cada 40ms
  puntos = setTimeout(playGame, 40);
  //actualiza puntos
  puntaje.innerHTML = puntos;
}

//se encarga de controlar el ciclo de vida del juego
function playGame(){
  //si el personaje todavia tiene vida
  if(pj.vida>0){
    //achica el intervalo de creacion de enemigos cada 300 puntos
    if((puntos%300==0)&&(enemyInterval>10)){ enemyInterval = enemyInterval -5;}
    //llama a la fabrica para crear un enemigo aleatorio
    if(puntos%enemyInterval==0){
      fabrica.crearEnemigoRandom();
    }
    avanzarEnemigos();
  }
  else{
    //manejo de los eventos de finalizacion del juego
    var go = new Audio('fx/go.wav');
    go.play();
    document.getElementById("moon").style.animation = "gameOver 4s";
    document.getElementById("game-over").style.visibility = "visible";
  }
}

// inicializacion del juego
document.getElementById("jugar").onclick = function(){
  document.getElementById("jugar").style.visibility = "hidden";
  document.getElementById("intro").style.visibility = "hidden";
  inicializarVariables();
  playGame();
};
