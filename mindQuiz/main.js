var currentQuiz = null;
var questionCount = 30;
var score = new Array(30);
var animalName = ["tiger","peacock","koala","owl","chameleon"];
var animalScore = new Array(5);
var color = ["#FF8282","#FFE5B5","#FFFFB5","#D4FFFF","#F3F3FA"];

$(function() {
    $("#startButton").on("click", function() {
        if(currentQuiz == null)
        {
            $("#result").attr("style","display:none");
            //設定目前作答從第0題開始
            currentQuiz=0;
            //顯示題目
            $("#question").text(questions[0].question);
            //將選項區清空(可以試著先不寫)
            $("#options").empty();
            //將選項逐個加入
            questions[0].answers.forEach(function(element,index,array){
            $("#options").append(`<input name='options' type='radio'
            value='${index}'><label>${element[0]}</label><br><br>`);
            });
            //將按鈕上的文字換成Next
            $("#startButton").attr("value","Next");
            $("#forwardButton").attr("style","display:display");
        }
        else
        {
            //已經開始作答從這邊繼續
            //巡訪哪一個選項有被選取
            var isChecked = false;
            $.each($(":radio"),function(i,val){
                if(val.checked)
                {
                    isChecked = true;
                    if(currentQuiz == questionCount - 1)
                    {
                        score[currentQuiz] = questions[currentQuiz].answers[i][1];

                        animalScore[0] = score[4] + score[9] + score[13] + score[17] + score[23] + score[29];
                        animalScore[1] = score[2] + score[5] + score[12] + score[19] + score[21] + score[28];
                        animalScore[2] = score[1] + score[7] + score[14] + score[16] + score[24] + score[27];
                        animalScore[3] = score[0] + score[6] + score[10] + score[15] + score[20] + score[25];
                        animalScore[4] = score[3] + score[8] + score[11] + score[18] + score[22] + score[26];
                        

                        sort();

                        
                        console.log("animalName: " + animalName);

                        $("#title").text("測驗結果");
                        $("#options").empty();
                        $("#question").text("");

                        document.getElementById("quizBody").setAttribute("style","text-align: center;background-color: #e9f4f7;width:80%;margin:0px auto;border-radius: 30px;")

                        for(var j = 0; j < 5; j++)
                        {   
                            $("#style"+j).text(finalAnswers[animalName[j]][0]);
                            $("#info"+j).text(finalAnswers[animalName[j]][1]);
                            $("#detail"+j).attr("href",finalAnswers[animalName[j]][2]);
                            $("#img"+j).attr("src",finalAnswers[animalName[j]][3]);
                            $("#score"+j).text(animalScore[j]);
                        }
                        
                        setColor();

                        $("#result").attr("style","display:display");
                        currentQuiz = null;
                        $("#startButton").attr("value","重新開始");
                        $("#forwardButton").attr("style","display:none");
                    }
                    else
                    {
                        score[currentQuiz] = questions[currentQuiz].answers[i][1];

                        currentQuiz++;

                        //顯示新的題目
                        if(currentQuiz < questionCount)
                        {
                            $("#question").text(questions[currentQuiz].question);
                            $("#options").empty();
                            questions[currentQuiz].answers.forEach(function(element,index,array){
                                $("#options").append(`<input name='options' type='radio' value='${index}'><label>${element[0]}</label><br><br>`);
                            });
                        }
                    }
                    return false; //跳離迴圈的方式
                }
            });
            

            if(!isChecked)
            {
                alert("請選擇一個答案!");
            }
        }
    });
})

$(function() {
    $("#forwardButton").on("click", function() {
        console.log(currentQuiz);
        if(currentQuiz > 0)
        {
            currentQuiz--;
            $("#question").text(questions[currentQuiz].question);
            $("#options").empty();
            questions[currentQuiz].answers.forEach(function(element,index,array){
                if(index == 5 - score[currentQuiz])
                    $("#options").append(`<input name='options' type='radio' value='${index}' checked><label>${element[0]}</label><br><br>`);
                else 
                    $("#options").append(`<input name='options' type='radio' value='${index}'><label>${element[0]}</label><br><br>`);
            });
        }
        else
        {
            alert("目前是第一題，無法回到前一題!");
        }
    });
})


function sort()
{
    for(var i = questionCount-1; i > 0; i--)
    {
        for(var j = 0; j < i; j++)
        {
            if(animalScore[j] < animalScore[j+1])
            {
                var tmp = animalScore[j];
                animalScore[j] = animalScore[j+1];
                animalScore[j+1] = tmp;

                tmp = animalName[j];
                animalName[j] = animalName[j+1];
                animalName[j+1] = tmp;
            }
        }
    }
}

function setColor()
{
    var colorCount = 0;
    for(var i = 0; i < 5; i++)
    {
        if(i == 0)
        {
            $("#r"+i).attr("style","background:"+color[colorCount]);
            colorCount++;
        }
        else
        {
            if(animalScore[i] == animalScore[i-1])
            {
                $("#r"+i).attr("style","background:"+color[colorCount-1]);
            }
            else
            {
                $("#r"+i).attr("style","background:"+color[colorCount]);
                colorCount++;
            }
        }
    }
}