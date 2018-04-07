var perceptron = require('perceptron');
var express = require('express');
var app = express();
var server = app.listen(3000);
var path = require('path');
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var fs = require('fs');
var exphbs = require('express-handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

var datas = [];
var count = 0;

app.get('/', function(req, res) {
    res.render('mainhtml');
});

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
        console.log(data.label);
        console.log('\n');
        datas.push(data);

    });
    socket.on('snap', function(data) {
        var file = require('./train.json');
        var fileData = JSON.parse(JSON.stringify(file));
        fileData.push(datas[datas.length - 1])
        fs.writeFile('train.json', JSON.stringify(fileData), "utf8");
        datas = []
    })
});



app.get('/chatbot', function(req, res) {
    res.render('index');
});

var str = '';
var and = perceptron();

function train() {

    var train = require('./train.json');
    var trainData = JSON.parse(JSON.stringify(train));

    trainData.forEach(function(da) {
        and.train([da.a, da.b, da.c, da.d, da.e, da.f], da.label);
    });
}

var cou = 0;

app.post('/chatbot', function(req, resp) {
    train();
    if (cou == 4) {
        console.log(req.body);
        var pred = and.perceive([req.body.a, req.body.b, req.body.c, req.body.d, req.body.e, req.body.f]);
        console.log('pred: ' + pred);
        if (pred == 0) {
            str = 'weather';
            console.log('The weather outside is 67 F.');
        } else {
            str = 'joke';
        }
        const apiai = require('apiai');
        const app = apiai("11c7a7fad3714ec28643becb17571427");

        var request = app.textRequest(str, {
            sessionId: '2'
        });

        request.on('response', function(response) {
            var res = JSON.parse(JSON.stringify(response));
            const Translate = require('@google-cloud/translate');
            const projectId = 'theta-office-199904';
            const translate = new Translate({
                projectId: projectId,
            });
            const text = res.result.fulfillment.speech;
            console.log(text);
            const target = 'hi';
            translate.translate(text, target).then(results => {
                const translation = results[0];
                console.log(`Text: ${text}`);
                console.log(`Translation: ${translation}`);
                var googleTTS = require('google-tts-api');
                googleTTS(translation, 'hi', 1)
                    .then(function(url) {
                        resp.send(url);
                        console.log(url);
                    })
                    .catch(function(err) {
                        console.error(err.stack);
                    });
            }).catch(err => {
                console.error('ERROR:', err);
            });
        });

        request.on('error', function(error) {
            console.log(error);
        });

        request.end();
        // cou = 0;
    }
    cou++;
});