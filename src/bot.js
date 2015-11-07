var SlackBot = require('slackbots');
var User = require('./user');
var Channel = require('./channel');
var Giphy = require('./giphy');

var bot = null;
var params = {};

var Bot = {};

Bot.init = function(settings) {
  User.bot = this;
  Giphy.bot = this;

  // create a bot
  bot = new SlackBot({
      token: settings.token,
      name: settings.name
  });

  params = {
      icon_emoji: settings.icon_emoji,
      as_user: true
  };

  bot.on('start', function() {
    bot.getUsers().then(function(data) {
      for(var i in data.members) {
        User.add(data.members[i]);
      }
    });

    bot.getChannels().then(function(data) {
      for(var i in data.channels) {
        Channel.add(data.channels[i]);
      }
    });

    Giphy.send('general', 'hello');
  });

  bot.on('message', function(data) {
    data.name = User.getName(data.user);

    if(data.type === 'message' && data.name != settings.name) {
      if(matchIsSometing(data.text)) {

        bot.postMessage(data.channel, "Let me check...", params);
        var result = parseQuestion(data.text);
          result.user.askIfIs(result.question, function(response) {
          bot.postMessage(data.channel, response, params);
        });

      } else if(matchIsSometingInvalidUser(data.text)) {
        bot.postMessage(data.channel, settings.messages.user_not_found, params);
      } else {
        var user = User.get(data.user);
        if(user) {
          user.gotMessage(data.text, data.channel);
        }
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

  function parseQuestion(text) {
    var pieces = text.split(' ');
    var user = pieces[1].slice(2, -1);

    var question = pieces.slice(2, pieces.length).join(' ');

    return {
      user: User.get(user),
      question: question
    };
  }
};

Bot.postMessageToUser = function(name, message, callback) {
  bot.postMessageToUser(name, message, params, callback);
};

Bot.postMessage = function(channel, message) {
  bot.postMessageToChannel(channel, message, params);
};

module.exports = Bot;
