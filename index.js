var SlackBot = require('slackbots');
var fs = require('fs');
var User = require('./src/user');

var strSettings = fs.readFileSync("settings.json");
var settings = JSON.parse(strSettings);

var giphy = require('giphy-api')(settings.giphy);

// create a bot
var bot = new SlackBot({
    token: settings.token,
    name: settings.name
});

var params = {
    icon_emoji: settings.icon_emoji,
    as_user: true
};

bot.on('start', function() {
  bot.getUsers().then(function(data) {
    for(var i in data.members) {
      User.add(data.members[i]);
    }
  });

  giphy.search('hello', function(err, res) {
    if(res.data.length) {
      var index = Math.ceil(Math.random() * res.data.length);
      //bot.postMessageToChannel('general', '<' + res.data[index].url + '|Hello>', params);
    }
  });
});

bot.on('message', function(data) {
  data.name = User.getName(data.user);

  console.log("=>", data.text, "=", data.channel);

  if(data.type === 'message' && data.name != settings.name) {
    console.log("data.text=", data.text);
    if(matchIsSometing(data.text)) {
      bot.postMessage(data.channel, data.text, params);
    }

    if(matchIsSometingInvalidUser(data.text)) {
      bot.postMessage(data.channel, settings.messages.user_not_found, params);
    }
  }
});

function matchIsSometing(text) {
  var patt = /is <@[a-z0-9]+> .*/i;
  return patt.test(text);
}

function matchIsSometingInvalidUser(text) {
  var patt = /is @[a-z0-9]+ .*/i;
  return patt.test(text);
}
