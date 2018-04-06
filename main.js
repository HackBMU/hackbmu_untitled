const apiai = require('apiai');

const app = apiai("e101099bd2ae4bf5a4fcc37458a2eb3d");

var request = app.textRequest('hi', {
    sessionId: '2'
});

request.on('response', function(response) {
	var res = JSON.parse(JSON.stringify(response));
    console.log(res.result.fulfillment.speech);
	const Translate = require('@google-cloud/translate');
	const projectId = 'theta-office-199904';
	const translate = new Translate({
	  projectId: projectId,
	});
	const text = res.result.fulfillment.speech;
	const target = 'hi';
	translate
	  .translate(text, target)
	  .then(results => {
	    const translation = results[0];
	    console.log(`Text: ${text}`);
	    console.log(`Translation: ${translation}`);
	  })
	  .catch(err => {
	    console.error('ERROR:', err);
	  });

});

request.on('error', function(error) {
    console.log(error);
});

request.end();
