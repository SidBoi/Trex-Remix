var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var backgroundImg;
var NightTime;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2;
var score = 0;
var HighestScore = 0;
var restart;

localStorage["HighestScore"] = 0;

function preload() {
    trex_running = loadAnimation("Assets/Dino-Animation/Dino-Frame-1.png", "Assets/Dino-Animation/Dino-Frame-2.png",
        "Assets/Dino-Animation/Dino-Frame-3.png", "Assets/Dino-Animation/Dino-Frame-4.png", "Assets/Dino-Animation/Dino-Frame-5.png",
        "Assets/Dino-Animation/Dino-Frame-6.png", "Assets/Dino-Animation/Dino-Frame-7.png", "Assets/Dino-Animation/Dino-Frame-8.png",
        "Assets/Dino-Animation/Dino-Frame-9.png", "Assets/Dino-Animation/Dino-Frame-10.png", "Assets/Dino-Animation/Dino-Frame-11.png",
        "Assets/Dino-Animation/Dino-Frame-11.png", "Assets/Dino-Animation/Dino-Frame-12.png", "Assets/Dino-Animation/Dino-Frame-13.png",
        "Assets/Dino-Animation/Dino-Frame-14.png", "Assets/Dino-Animation/Dino-Frame-15.png", "Assets/Dino-Animation/Dino-Frame-16.png",
        "Assets/Dino-Animation/Dino-Frame-17.png", "Assets/Dino-Animation/Dino-Frame-18.png", "Assets/Dino-Animation/Dino-Frame-19.png",
        "Assets/Dino-Animation/Dino-Frame-20.png", "Assets/Dino-Animation/Dino-Frame-21.png", "Assets/Dino-Animation/Dino-Frame-22.png",
        "Assets/Dino-Animation/Dino-Frame-23.png", "Assets/Dino-Animation/Dino-Frame-24.png", "Assets/Dino-Animation/Dino-Frame-25.png",
        "Assets/Dino-Animation/Dino-Frame-26.png", "Assets/Dino-Animation/Dino-Frame-27.png", "Assets/Dino-Animation/Dino-Frame-28.png",
        "Assets/Dino-Animation/Dino-Frame-29.png", "Assets/Dino-Animation/Dino-Frame-30.png");
    trex_collided = loadAnimation("Assets/Dino-Animation/Dino-Frame-1.png");

    groundImage = loadImage("Assets/ground.png");

    cloudImage = loadImage("Assets/cloud.png");

    obstacle1 = loadImage("Assets/obstacle1.png");
    obstacle2 = loadImage("Assets/obstacle2.png");

    restartImg = loadImage("Assets/replay.png");

    //backgroundImg = loadImage("Assets/Backgrounds/Desert.jpg")
    NightTime()
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    trex = createSprite(90, 775, 20, 50);
    trex.setCollider('circle', 0, 0, 120)
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided);
    trex.scale = 0.4;

    ground = createSprite(200, 820, 400, 20);
    ground.addImage("ground", groundImage);
    ground.x = ground.width / 2;
    ground.velocityX = -(6 + 3 * score / 100);

    restart = createSprite(800, 385);
    restart.addImage(restartImg);

    restart.scale = 0.5;
    restart.visible = false;

    invisibleGround = createSprite(200, 780, 400, 10);
    invisibleGround.visible = false;

    cloudsGroup = new Group();
    obstaclesGroup = new Group();

    score = 0;
    HighestScore = 0;
}

function draw() {
    //trex.debug = true;
    if (backgroundImg)
        background(backgroundImg);
    textSize(20);
    text("Score: " + score, 1490, 40);
    //text("Highest Score: " + HighestScore, 250, 40);

    if (gameState === PLAY) {
        score = score + Math.round(getFrameRate() / 60);
        ground.velocityX = -(6 + 3 * score / 100);

        if (keyDown("space") && trex.y >= 720) {
            trex.velocityY = -15;

        }

        trex.velocityY = trex.velocityY + 0.5

        if (ground.x < 0) {
            ground.x = ground.width / 2;
        }

        trex.collide(invisibleGround);
        spawnClouds();
        spawnObstacles();

        if (obstaclesGroup.isTouching(trex)) {
            gameState = END;
        }
    } else if (gameState === END) {
        restart.visible = true;

        //set velcity of each game object to 0
        ground.velocityX = 0;
        trex.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);

        //change the trex animation
        trex.changeAnimation("collided", trex_collided);

        //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);

        if (mousePressedOver(restart)) {
            reset();
        }
    }


    drawSprites();
}

function spawnClouds() {
    //write code here to spawn the clouds
    if (frameCount % 125 === 0) {
        var cloud = createSprite(1600, 120, 40, 10);
        cloud.y = Math.round(random(80, 550));
        cloud.addImage(cloudImage);
        cloud.scale = 1;
        cloud.velocityX = -3;

        //assign lifetime to the variable
        cloud.lifetime = 500;

        //adjust the depth
        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        //add each cloud to the group
        cloudsGroup.add(cloud);
    }

}

function spawnObstacles() {
    if (frameCount % 95 === 0) {
        var obstacle = createSprite(1600, 680, 10, 40);
        obstacle.setCollider("circle", 0, 0, 220)
            //obstacle.debug = true;
        obstacle.velocityX = -(6 + 3 * score / 100);

        //generate random obstacles
        var rand = Math.round(random(1, 2));
        switch (rand) {
            case 1:
                obstacle.addImage(obstacle1);
                break;
            case 2:
                obstacle.addImage(obstacle2);
                break;
            default:
                break;
        }

        //assign scale and lifetime to the obstacle           
        obstacle.scale = 0.3;
        obstacle.lifetime = 230;
        //add each obstacle to the group
        obstaclesGroup.add(obstacle);
    }
}

async function NightTime() {
    var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
    var responseJSON = await response.json();

    var datetime = responseJSON.datetime;
    var hour = datetime.slice(11, 13);

    if (hour >= 06 && hour <= 19) {
        bg = "Assets/Backgrounds/Forest.jpg";
    } else {
        bg = "Assets/Backgrounds/NightTime.png";
    }

    backgroundImg = loadImage(bg);
    console.log(backgroundImg);
}

function reset() {
    gameState = PLAY;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();

    trex.changeAnimation("running", trex_running);

    if (localStorage["HighestScore"] < score) {
        localStorage["HighestScore"] = score;
    }
    console.log(localStorage["HighestScore"]);
    score = 0;

}