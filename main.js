// const apiai = require('apiai');

// const app = apiai("e101099bd2ae4bf5a4fcc37458a2eb3d");

// var request = app.textRequest('hi', {
//     sessionId: '2'
// });

// request.on('response', function(response) {
// 	var res = JSON.parse(JSON.stringify(response));
//     console.log(res.result.fulfillment.speech);
// 	const Translate = require('@google-cloud/translate');
// 	const projectId = 'theta-office-199904';
// 	const translate = new Translate({
// 	  projectId: projectId,
// 	});
// 	const text = res.result.fulfillment.speech;
// 	const target = 'hi';
// 	translate
// 	  .translate(text, target)
// 	  .then(results => {
// 	    const translation = results[0];
// 	    console.log(`Text: ${text}`);
// 	    console.log(`Translation: ${translation}`);
// 	  })
// 	  .catch(err => {
// 	    console.error('ERROR:', err);
// 	  });

// });

// request.on('error', function(error) {
//     console.log(error);
// });

// request.end();


var perceptron = require('perceptron');
var express = require('express');
var app = express();
var server = app.listen(3000);
var path = require('path');
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var fs = require('fs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


console.log(111111);
var datas = [];
var count = 0;

io.on('connection', function(socket) {
    var datas = [];
    var count = 0;
    socket.on('data', function(data) {
        count++;
        console.log('Count: ' + count);
        console.log(data.a);
        console.log(data.b);
        console.log(data.c);
        console.log(data.d);
        console.log(data.e);
        console.log(data.f);
        console.log(data.g);
        console.log(data.label);
        console.log('\n');
        datas.push(data);

    });
    socket.on('snap', function(data) {
        var file = require('./test.json');
        var fileData = JSON.parse(JSON.stringify(file));
        fileData.push(datas[datas.length - 1])
        fs.writeFile('test.json', JSON.stringify(fileData), "utf8");
        datas = []
    })
});

// app.get('/predict', function(req, res) {
var and = perceptron();

var train = require('./train.json');
var trainData = JSON.parse(JSON.stringify(train));

trainData.forEach(function(da) {
    and.train([da.a, da.b, da.c, da.d, da.e, da.f, da.g], da.label);
});

console.log(112121);
var test = require('./test.json');
var testData = JSON.parse(JSON.stringify(test));

var str = '';

testData.forEach(function(da) {
    console.log(and.perceive([da.a, da.b, da.c, da.d, da.e, da.f, da.g]));
});

// res.send(str);
// });