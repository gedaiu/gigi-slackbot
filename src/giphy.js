var giphy = null;

function Giphy() {}

Giphy.init = function(settings) {
  giphy = require('giphy-api')(settings.giphy);
};

Giphy.send = function(channel, message) {
  giphy.search(message, function(err, res) {
    if(res && res.data.length) {
      var index = Math.ceil(Math.random() * res.data.length);

      Giphy.bot.postMessage(channel, '<' + res.data[index].url + '|' + message + '>');
    }
  });
};

module.exports = Giphy;
