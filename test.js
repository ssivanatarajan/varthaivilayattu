var fs=require('fs');
// var s=[];
// console.log(c.length);
// for(var i=0;i<c.length;i++){
//     s.push("'"+c[i].trim()+"'");
// }
// fs.writeFileSync('./testop.text',s.join(","));
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
var data=fs.readFileSync('./8.text','utf-8');
var s=data.split("\n");
//s=["காரம்","ராகம்"];
var output=[];
for(i=0;i<s.length;i++){
    var baseWord=convertToArray(s[i])
    var sameWords=[];
    if(baseWord[0]!="*"){
        sameWords.push(s[i].trim());
        for(j=i+1;j<s.length;j++){
            var comparetoWord=convertToArray(s[j]);
            if(baseWord.length == comparetoWord.length && comparetoWord[0]!='*'){
                for(var l=0;l<baseWord.length;l++){
                    var baseChar=baseWord[l];
                    for(var k=0;k<comparetoWord.length;k++){
                        if(baseChar==comparetoWord[k]){
                            comparetoWord[k]="*";
                            break;
                        }
                    }
                }
                if(comparetoWord.length==0){
                    sameWords.push(s[j].trim());
                    s[j]="*".repeat(baseWord.length);
                }
            }
        }
        output.push(sameWords);
}
}
console.log(output);
fs.writeFileSync('./test.txt',JSON.stringify(output));

function convertToArray(randomWord){
    var convertedWord = [];
    for (var i = 0; i != randomWord.length; i++) {
        var ch = randomWord[i];
        diacritics[ch]  ? (convertedWord[convertedWord.length - 1] += ch) : convertedWord.push(ch);
    } 
    return convertedWord.slice();
}