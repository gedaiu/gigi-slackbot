var fs = require('fs');
var Bot = require('./src/bot');
var Giphy = require('./src/giphy');

var strSettings = fs.readFileSync("settings.json");

var settings = JSON.parse(strSettings);

Giphy.init(settings);
Bot.init(settings);
