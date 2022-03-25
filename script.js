// var backgroundcolors=[
//     "#F3E0EC","#EAD5E6","#D798C0","#F2BEFC",'#EB9EFA','#fec5bb','#fcd5ce','#fae1dd','#e8e8e4','#d8e2dc','#ece4db','#e9f5db','#e0c3fc'
// ]

var circlebgs=[
    '#5465ff','#788bff','#fe938c','#f20089','#e500a4','#db00b6','#d100d1','#8900f2','#1a535c','#1be7ff','#6eeb83','#ffb800','#ff5714','#ef8354',
    '#2d3142','#1a535c'
]
var diacritics = {
    "\u0B82": true,
    "\u0BBE": true,
    "\u0BBF": true,
    "\u0BC0": true,
    "\u0BC1": true,
    "\u0BC2": true,
    "\u0BC6": true,
    "\u0BC7": true,
    "\u0BC8": true,
    "\u0BCA": true,
    "\u0BCB": true,
    "\u0BCC": true,
    "\u0BCD": true,
    "\u0BD7": true,
  };

  
var selectedWord= [];
var wordlee={};
wordlee.wordsCombinations=[];
wordlee.totalLevels=8;
var score=0;
var totalLevels=10;
var remainingtime=60;
var timerInterval;
$(document).ready(function(){
    $('.addedScore').on('animationend',function(){
        $('.score').text(score);
        $('.addedScore').removeClass('show');
    })
    $(document).on('click','.circle',function(){
        var $currentCircle =$(this);
        var currentWord = $currentCircle.data('word');
        var isSelected = $currentCircle.attr('data-isselected');
        if(isSelected=="false"){
            selectedWord.push(currentWord);
            $currentCircle.attr('data-isselected',true);
        }
        else{
           if(selectedWord[selectedWord.length-1] == currentWord){
            selectedWord.pop();
            $currentCircle.attr('data-isselected',false);
           }
        }
        var outputCircles=$('.outputCircle');
        outputCircles.text('').css('background-color','transparent');
        for(var i=0;i<selectedWord.length;i++){
            outputCircles.eq(i).text(selectedWord[i]).css('background-color',circlebgs[ wordlee.circleBgIndex]);
        }
        if(selectedWord.length == wordlee.randomWord.length){
            if( wordlee.wordsCombinations.includes(selectedWord.join(''))){
                $('.scoreLevel').css('visibility','visible');
                score++;
                $('.addedScore').addClass('show');
                if(score == 10){
                    var clearedLevelsStr=localStorage.getItem('wordlee_clearedlevels');
                    if(clearedLevelsStr!=null){
                        var clearedLevels = JSON.parse(clearedLevelsStr);
                        clearedLevels.push(wordlee.currentLevel);
                    }
                    else{
                        var clearedLevels=[wordlee.currentLevel];
                        var cleardLevelsStr=JSON.stringify(clearedLevels);
                        localStorage.setItem('wordlee_clearedLevels',cleardLevelsStr);
                    }
                    if(parseInt(wordlee.currentLevel) < wordlee.totalLevels){
                        $('.freezelayer').show();
                        $('.levelcompletedPopup').addClass('show');
                    }
                    else{
                        gotoHomePage();
                    }
                }
                else{
                    remainingtime+= parseInt(wordlee.currentLevel * 1.5);
                    // var completedLevelPercentage = (score/totalLevels)*100;
                    // $('.bar').css('width',completedLevelPercentage+'%');
                    getNewWord(wordlee.currentLevel);
                }
            }
            else{
                getNewWord(wordlee.currentLevel,wordlee.randomWord);
            }
        }
    })
    $(document).on('click','.outputCircle',function(){
        var $currentCircle =$(this);
        var currentWord=$currentCircle.text();
        if($currentCircle.text()==selectedWord[selectedWord.length-1] ){
            $('.circle').each(function(index,el){
                var $el=$(el);
                if(currentWord==$el.data('word')){
                    $el.attr('data-isselected',false);
                    return;
                }
            });
            $currentCircle.css('background-color','transparent').text('');
            selectedWord.pop();
        }
    });
    var cleardLevelsStr=localStorage.getItem('wordlee_clearedLevels');
    if(cleardLevelsStr){
        var clearedLevels=JSON.parse(cleardLevelsStr);
        var currentLevel=clearedLevels[clearedLevels.length - 1];
        $('.level').each(function(index,elem){
            if(parseInt(elem.dataset.level) > parseInt(currentLevel)+1){
                $(elem).css({'pointer-events':'none','cursor':'not-allowed'});
                $(elem).append('<i class="fa-solid fa-lock"></i>');
            }
        });
    }
});
function gotoHomePage(){
    // $('.freezelayer').hide();
    // $('.levelcompletedPopup').removeClass('show');
    // $('.timerAlert').hide();
    // $('.welcomescreen').show();
    // $('.container').hide();
    // $('.score').text(0);
    location.reload();
}
function closePopup(){
    $('.freezelayer').hide();
    $('.levelcompletedPopup').removeClass('show');
}
function gotoLevel(level){
    $('.freezelayer').hide();
    $('.levelcompletedPopup').removeClass('show');
    remainingtime= level >5 ? 60 +((level - 5) *10) : 60;
    clearInterval(timerInterval);
    wordlee.currentLevel=level;
    $('.welcomescreen,.timerAlert').hide();
    $('.container').css('display','flex');
    $('.score').text(0);
    score=0;
    getNewWord(level);
    localStorage.setItem('wordlee_level',level);
}
function gotoNextLevel(){
    gotoLevel(parseInt(wordlee.currentLevel) + 1);
}
function getRandomNumber(limit){
    return Math.floor(Math.random() * limit);
}
function getNewWord(level,word){
    $('#input').html('');
    $('.timer').text(remainingtime);
    var outputContainer=$('#output');
    outputContainer.html('');
    selectedWord.splice(0,selectedWord.length);
    if(word){
       wordlee.randomWord= word.slice();
       convertedWord = word.slice();
       if( !wordlee.circleBgIndex){
            var circleBgRandomIndex = getRandomNumber(circlebgs.length);
            wordlee.circleBgIndex = circleBgRandomIndex;
       }
    }
    else{
        var circleBgRandomIndex = getRandomNumber(circlebgs.length);
        wordlee.circleBgIndex = circleBgRandomIndex;
        var wordsForThisLevel=words[level];
        wordlee.wordsCombinations=[];
        var randomWords = wordsForThisLevel[ getRandomNumber(wordsForThisLevel.length)];
        for(var l=0;l<randomWords.length;l++){
            var randomWord = randomWords[l];
            var convertedWord = [];
            for (var i = 0; i != randomWord.length; i++) {
                var ch = randomWord[i];
                diacritics[ch]  ? (convertedWord[convertedWord.length - 1] += ch) : convertedWord.push(ch);
            }
            wordlee.wordsCombinations.push(convertedWord.slice().join(''));
        }
        wordlee.randomWord= convertedWord.slice();
       
    }
    // var bg = backgroundcolors[getRandomNumber(backgroundcolors.length)]
    // $('.container').css('background-color',bg);
    var angle =360/convertedWord.length;
    var i=0;
    
    while(convertedWord.length > 0){
        i++;
        var rIndex = getRandomNumber(convertedWord.length);
        var randomChar = convertedWord[rIndex];
        convertedWord.splice(rIndex,1);
        var circle=$('<div class="circle" data-word="'+randomChar+'" data-isselected='+false+'>'+randomChar+'</div>');
        var rotateAngle = angle * i;
        circle.css('transform',"rotate("+rotateAngle+"deg) translate(-100px) rotate(-"+rotateAngle+"deg)");
        circle.css('background-color',circlebgs[ wordlee.circleBgIndex]);
        outputContainer.append('<div class="outputCircle"></div>')
        $('#input').append(circle);
    }
    clearInterval(timerInterval);
    timerInterval=setInterval(function(){
        remainingtime--;
        $('.timer').text(remainingtime);
        if(remainingtime==0){
            showTimerAlert();
        }
    },1000)
}
function showTimerAlert(){
    clearInterval(timerInterval)
    $('.timerAlert').css('display','flex');
    $('.correctWord').text(wordlee.randomWord.join(''));
    $('.container').hide();
}