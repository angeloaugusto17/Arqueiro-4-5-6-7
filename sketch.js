//Jogo do Arqueiro; Angelo Augusto; 30/05/22; 08:45am.
//CONSTANTES - BIBLIOTECA MATTER - OK
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

//VARIAVEIS - OK
var engine, world;
var canvas;
var player, playerBase, playerArcher;
var playerArrows = [];
var board1, board2;
var numberOfArrows = 10;
var score = 0;
var imgBackground

//CARREGAR IMAGENS/ANIMAÇÕES/SONS - OK
function preload() {
  imgBackground = loadImage("./assets/background.png");
}

//INICIALIZAR VARIAVEIS - EXECUTA UMA VEZ
function setup() {
  //CRIA A TELA - OK
  canvas = createCanvas(windowWidth, windowHeight);

  //INICIALIZA MECANISMO E O MUNDO - OK
  engine = Engine.create();
  world = engine.world;

  //CRIAR A BASE DO CORPO DO JOGADOR COM A CLASSE PlayerBase - #PART1
  playerBase = new PlayerBase(300,500,180,150);

  //CRIAR O CORPO DO JOGADOR COM A CLASSE Player e PlayerArcher - #PART1
  player = new Player(285, playerBase.body.position.y - 153,50,180);

  playerArcher = new PlayerArcher(340,playerBase.body.position.y - 180,120,120);

  //CRIAR OS ALVOS COM A CLASSE Board - #PART3
  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
}

//DESENHA NA TELA, ADICIONA FUNÇOES - EXECUTA VARIAS VEZES
function draw() {
  //ADICIONA IMAGEM DO CENARIO - OK
  background(imgBackground);

  //ATUALIZA O MECANISMO - OK
  Engine.update(engine);

  //MOSTRA O PLAYER COM A FUNÇÃO Display(); - #PART1
  playerBase.display();
  player.display();
  playerArcher.display();

  //MOSTRA OS ALVOS COM A FUNÇÃO Display(); - #PART3
  board1.display();
  board2.display();


  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );

      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      );

      //SOMAR 5 NA PONTUAÇÃO QUANDO ACERTAR O ALVO - #PART4

      if (board1Collision.collided || board2Collision.collided) {
        score += 5;
      }

      var posX = playerArrows[i].body.position.x;
      var posY = playerArrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (!playerArrows[i].isRemoved) {
          playerArrows[i].remove(i);
        } else {
          playerArrows[i].trajectory = [];
        }
      }
    }
  }

  //MOSTRA TITULO - OK
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("ARQUEIRO ÉPICO", width / 2, 100);

  //MOSTRA CONTAGEM DE FLECHAS
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Flechas Restantes: " + numberOfArrows, 200, 100);
  
  //MOSTRA PONTUAÇÃO
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Pontuação: " + score, width - 200, 100);


  //SE O NUMERO DE FLECHAS FOR 0, CHAMA A FUNÇÃO GAMEOVER - #PART7

  if (numberOfArrows == 0) {
    gameOver();
  }
}

//CRIAR A FUNÇÃO DE APERTAR ESPAÇO PARA LANÇAR A FLECHA - #PARTE5

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;
      var arrow = new PlayerArrow(posX, posY, 100, 10, angle);
      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

//CRIAR GAME OVER - #PARTE6
function gameOver() {
  swal(
    {
      title: `Fim de Jogo!!!`,
       text: "Obrigado por jogar!!",
       imageUrl:
         "https://raw.githubusercontent.com/vishalgaddam873/PiratesInvision/main/assets/board.png",
       imageSize: "150x150",
       confirmButtonText: "Jogar Novamente"
     },
     function(isConfirm) {
       if (isConfirm) {
         location.reload();
       }
     }
  );
}


