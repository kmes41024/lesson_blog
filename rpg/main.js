let mapArray, ctx, currentImgMain;
let imgMain, imgHome, imgDog, imgFood, imgEnd;
let eatFood = 0;
let endGame = false;

let foodSize = 4;

const gridLength = 200;


function start(){
    mapArray = [
        [0,0,0,0],
        [1,0,0,0],
        [2,1,0,1],
        [0,0,0,0]
    ];  //1房子 2狗 3飼料
    
    var tmp = 0;
    while(tmp < foodSize)
    {
        var num = Math.floor(Math.random()*15) + 1;
        var x = Math.floor(num/4);
        var y = num % 4

        if(mapArray[x][y] == 0)
        {
            mapArray[Math.floor(num/4)][num % 4] = 3;
            tmp++;
        }
    }

    ctx = $("#myCanvas")[0].getContext("2d"); 

    ctx.clearRect(0, 400, gridLength, gridLength);

    imgEnd = new Image();
    imgEnd.src = "rpg/images/end.png";

    imgMain = new Image();
    imgMain.src = "rpg/images/walk.png";
    currentImgMain = {
        "x":0,
        "y":0
    };

    imgMain.onload = function(){
        ctx.drawImage(imgMain, 0,0,472,472,currentImgMain.x,currentImgMain.y,gridLength,gridLength);
    }

    imgHome = new Image();
    imgHome.src = "rpg/images/home.png";
    imgDog = new Image();
    imgDog.src = "rpg/images/dog.png";
    imgFood = new Image();
    imgFood.src = "rpg/images/food.png";

    //TODO-improve 有沒有語法可以讓這裡寫得更好
    imgHome.onload = function(){
        for(var x in mapArray)
        {
            for(var y in mapArray[x])
            {
                if(mapArray[x][y] == 1)
                {
                    ctx.drawImage(imgHome, 0,0,473,473,y*gridLength,x*gridLength,gridLength,gridLength);
                }
                else if(mapArray[x][y] == 2)
                {
                    ctx.drawImage(imgDog, 0,0,473,473,y*gridLength,x*gridLength,gridLength,gridLength);
                }
                else if(mapArray[x][y] == 3)
                {
                    ctx.drawImage(imgFood, 0,0,473,473,y*gridLength,x*gridLength,gridLength,gridLength);
                }
            }
        }
    }
}

$(document).on("keydown", function(event){
    let targetImg, targetBlock, cutImagePositionX;      //cutImagePositionX - 決定主角臉朝向哪個方向

    targetImg = { //主角的目標座標
        "x":-1,
        "y":-1
    };
    targetBlock = { //主角的目標(對應2維陣列)
        "x":-1,
        "y":-1
    }
    
    event.preventDefault();
    //避免鍵盤預設行為發生，如捲動/放大/換頁...
    //判斷使用者按下什麼並推算目標座標
    
    switch(event.key)
    {
        case "ArrowLeft":
            targetImg.x = currentImgMain.x - gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 472*2;
            break;
        case "ArrowUp":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y - gridLength;
            cutImagePositionX = 472;
            break;
        case "ArrowRight":
            targetImg.x = currentImgMain.x + gridLength;
            targetImg.y = currentImgMain.y;
            cutImagePositionX = 472*3;
            break;
        case "ArrowDown":
            targetImg.x = currentImgMain.x;
            targetImg.y = currentImgMain.y + gridLength;
            cutImagePositionX = 0;
            break;
        default:
            return;
    }

    if(targetImg.x<=600 && targetImg.x>=0 && targetImg.y<=600 && targetImg.y>=0)        //看會不會超過地圖(0,0)<-->(400,400)
    {
        targetBlock.x = targetImg.y / gridLength;
        targetBlock.y = targetImg.x / gridLength;
    }
    else        //超過 就不讓他移動
    {
        targetBlock.x = -1;
        targetBlock.y = -1;
    }

    ctx.clearRect(currentImgMain.x, currentImgMain.y, gridLength, gridLength);      //清空主角原本所在的位置(每次都重新畫)

    if(targetBlock.x != -1 && targetBlock.y != -1)
    {
        switch(mapArray[targetBlock.x][targetBlock.y])
        {
            case 0: // 一般道路(可移動)
                $("#talkBox").text("");
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                break;
            case 1: // home
                $("#talkBox").text("現在不是回家的時候啊! 媽媽在家裡呢!");
                break;
            case 2: // dog
                $("#talkBox").text("");
                if(eatFood < 4)
                    alert("你尚未蒐集完所有飼料");
                else
                {
                    currentImgMain.x = targetImg.x;
                    currentImgMain.y = targetImg.y;
                    mapArray[targetBlock.x][targetBlock.y] = 0;
                    endGame = true;
                }
                break;
            case 3: // food
                $("#talkBox").text("耶~ 吃到第" + (eatFood+1) + "個飼料了");
                currentImgMain.x = targetImg.x;
                currentImgMain.y = targetImg.y;
                eatFood++;
                mapArray[targetBlock.x][targetBlock.y] = 0;
                break;
        }
    }
    else
    {
        $("#talkBox").text("唉唷，撞到牆了!! 好痛阿!");
    }

    //重新繪製主角
    if(!endGame)
        ctx.drawImage(imgMain, cutImagePositionX,0,472,472,currentImgMain.x,currentImgMain.y,gridLength,gridLength);
    else
    {
        ctx.clearRect(currentImgMain.x, currentImgMain.y, gridLength, gridLength);
        ctx.drawImage(imgEnd, 0,0,473,473,currentImgMain.x,currentImgMain.y,gridLength,gridLength);
        
        document.getElementById('momPic').setAttribute("src", "rpg/images/end2.png");
        document.getElementById('restartBtn').setAttribute("style","display");
        document.getElementById('restartBtn').setAttribute("style","height:50px;width:100px;margin-left: -600px;");

        for(var i = 0; i < 4; i++)
        {
            for(var j = 0; j < 4; j++)
            {
                mapArray[i][j] = 4;
            }
        }
    }
});

$("#restartBtn").on("click",function(){
    endGame = false;
    eatFood = 0;
    mapArray = [
        [0,0,0,0],
        [1,0,0,0],
        [2,1,0,1],
        [0,0,0,0]
    ]; 
    console.log("restart");
    document.getElementById('restartBtn').setAttribute("style","display:none");
    document.getElementById('momPic').setAttribute("src", "rpg/images/mom.png");
    start();
});