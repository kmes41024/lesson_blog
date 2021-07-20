let player; //YouTube Player
let currentPlay = 0; //記錄目前撥到第幾首歌
let songList = 0;
let loadSuccess = false;

//////////////////////////////////////////////////////////////////////////////////
function setStyle(style)
{
    document.getElementById('musicStyle').innerHTML = style;
    if(style=="我隨便幫你播")
    {
        document.getElementById('color').style.backgroundColor = "#fff2e6";
        document.getElementById('choose').style.backgroundColor = "#ffd9b3";
    }
    else if(style=="我的主題曲")
    {
        document.getElementById('color').style.backgroundColor = "#D8FFC2";
        document.getElementById('choose').style.backgroundColor = "#A0E47A";
    }
    else if(style=="我推薦的慢歌")
    {
        document.getElementById('color').style.backgroundColor = "#cceeff";
        document.getElementById('choose').style.backgroundColor = "#99ddff";
    }
    else if(style=="我推薦的快歌")
    {
        document.getElementById('color').style.backgroundColor = "#ff99bb";
        document.getElementById('choose').style.backgroundColor = "#ff6699";
    }
}

function turnBlue(num)
{
    if(num == 1)
        document.getElementById('left').setAttribute("src","youtube/left_blue.png");
    else if(num == 2)
        document.getElementById('right').setAttribute("src","youtube/right_blue.png");
}

function turnGrey(num)
{
    if(num == 1)
        document.getElementById('left').setAttribute("src","youtube/left_grey.png");
    else if(num == 2)
        document.getElementById('right').setAttribute("src","youtube/right_grey.png");
}
//////////////////////////////////////////////////////////////////////////////////

$("#left").on("click",function(){       //切上一首歌
    if(loadSuccess)
    {
        if(currentPlay == 0)
            alert("已是第一首歌");
        else
        {
            currentPlay--;
            
            player.loadVideoById({
                videoId:playLists[songList][currentPlay],
                startSeconds:playTimes[songList][currentPlay][0],
                endSeconds:playTimes[songList][currentPlay][1],
                suggestedQuality:"large"
            });
        }
    }
});

$("#right").on("click",function(){      //切下一首歌
    if(loadSuccess)
    {
        if(currentPlay == playLists[songList].length-1)
            alert("已是最後一首歌");
        else
        {
            currentPlay++;
            
            player.loadVideoById({
                videoId:playLists[songList][currentPlay],
                startSeconds:playTimes[songList][currentPlay][0],
                endSeconds:playTimes[songList][currentPlay][1],
                suggestedQuality:"large"
            });
        }
    }
});

$(".styleBtn").on("click",function(){       //切換音樂類型
    if(loadSuccess)
    {
        style = document.getElementById('musicStyle').innerHTML;
        console.log(style)
        if(style=="我隨便幫你播")
            songList = 0;
        else if(style=="我的主題曲")
            songList = 1;
        else if(style=="我推薦的慢歌")
            songList = 2;
        else if(style=="我推薦的快歌")
            songList = 3;

        currentPlay=0;
        player.cueVideoById({           //載入 但不撥放
            videoId:playLists[songList][currentPlay],
            startSeconds:playTimes[songList][currentPlay][0],
            endSeconds:playTimes[songList][currentPlay][1],
            suggestedQuality:"large"
        });
    }  
});

//YouTube API Ready
function onYouTubeIframeAPIReady(){
    style = document.getElementById('musicStyle').innerHTML;
    if(style=="我隨便幫你播")
        songList = 0;
    else if(style=="我的主題曲")
        songList = 1;
    else if(style=="我推薦的慢歌")
        songList = 2;
    else if(style=="我推薦的快歌")
        songList = 3;
    
    player = new YT.Player("player",{
        height:"390",
        width:"640",
        videoId:playLists[songList][currentPlay],
        playerVars:{
            autoplay:0, //是否自動撥放
            controls:0, //是否顯示控制項
            start:playTimes[songList][currentPlay][0],//開始秒數
            end:playTimes[songList][currentPlay][1],//結束秒數
            iv_load_policy:3
        },
        events:{
            onReady:onPlayerReady,
            onStateChange:onPlayerStateChange
        }
    });
    
    loadSuccess = true;
}

//YouTube Player Ready
function onPlayerReady(event){
    $("#playButton").on("click",function(){
        $("#songName").text(player.getVideoData().title);
        player.playVideo();
    });
}

//Player State Change
function onPlayerStateChange(event){
    if(Math.floor(player.getCurrentTime())==playTimes[songList][currentPlay][1]){      //狀態轉變&播到最後一秒
        if(currentPlay<playLists[songList].length-1){
            currentPlay++;
            player.loadVideoById({
                videoId:playLists[songList][currentPlay],
                startSeconds:playTimes[songList][currentPlay][0],
                endSeconds:playTimes[songList][currentPlay][1],
                suggestedQuality:"large"
            });
        }else{      //播最後一首歌的時候
            currentPlay=0;
            player.cueVideoById({           //載入 但不播放
                videoId:playLists[songList][currentPlay],
                startSeconds:playTimes[songList][currentPlay][0],
                endSeconds:playTimes[songList][currentPlay][1],
                suggestedQuality:"large"
            });
        }
    }
    $("#songName").text(player.getVideoData().title);
}
