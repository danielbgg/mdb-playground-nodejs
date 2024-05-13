var fs = require('fs');
const { MongoClient } = require("mongodb");
const uri = process.env.ATLAS_URL;
const client = new MongoClient(uri);

var arr = [];
var bufferString;

function csvHandler() {
  var jsonObj = [];
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
      jsonObj.push(obj);
    }
  });
  return jsonObj;
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
    
    // Get the database and collection on which to run the operation
    const database = client.db("TESTS");
    const collection = database.collection("ExportCSV");

    console.log("LENDO ARQUIVO CSV");
    var jsonObj = csvHandler();

      const options = { upsert: true };

      const result = await collection.insertMany(jsonObj, options);

  } finally {
    await client.close();
  }
}
run().catch(console.dir);






