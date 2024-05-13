var fs = require('fs');

var arr = [];
var bufferString;

function csvHandler() {
  fs.readFile('fileToRead.csv', function (err, data) {
    if (err) {
      return console.log(err);
    }

    //Convert and store csv information into a buffer. 
    bufferString = data.toString();
    arr = bufferString.split('\n');

    //Store information for each individual person in an array index. Split it by every newline in the csv file. 
    var headers = arr[0].split('|');

    for (var i = 1; i < arr.length; i++) {
      console.log('LINHA ' + (i + 1) + ': ');
      var data = arr[i].split('|');
      var obj = {};
      for (var j = 0; j < data.length; j++) {
        var h = headers[j].trim().slice(1, -1);
        var d = data[j].trim().slice(1, -1);

        if (h == 'Extras') {
          var obj2 = breakKeyValue(d);
          obj['NovoExtras'] = obj2;
        }

        obj[h] = d;
      }
      JSON.stringify(obj);
      console.log(obj);
    }
  });
}

function breakKeyValue(content) {
  var obj = {};
  var data = content.split(';');
  for (var i = 0; i < data.length; i++) {
    var token = data[i];
    var data2 = token.split('=');
    for (var j = 0; j < data2.length; j += 2) {
      var k = data2[j];
      var v = data2[j + 1];
      obj[k] = v;
    }
  }
  return obj;
}


async function run() {
  try {

    console.log("LENDO ARQUIVO CSV");
    csvHandler();

  } finally {
  }
}
run().catch(console.dir);
