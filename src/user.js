var Channel = require('./channel');

var users = [];

function User(data) {
  for(var key in data) {
    this[key] = data[key];
  }

  this.tmpAnswer = "";
  this.isAnswering = false;

  this.answers = [];
}

User.prototype.ask = function(message, callback) {
  User.bot.postMessageToUser(this.name, message, User.botParams);
};

User.prototype.askIfIs = function(question, callback) {
  var message = User.bot.getText("are_you") + " " + question;
  var _this = this;

  this.tmpAnswer = "";
  this.isAnswering = true;
  this.answerCallback = callback;

  this.answerTimer = setTimeout(function() {
    _this.isAnswering = false;

    User.bot.postMessageToUser(_this.name, User.bot.getText("ask_you_later"), User.botParams);
    callback(User.bot.getText("did_not_answer"));
  }, 60 * 1000);

  this.ask(message, function(answer) {
    _this.answers[question] = answer;
    callback(answer);
  });
};

User.prototype.gotMessage = function(message, channel) {
  var _this = this;
  channel = Channel.get(channel);

  if(this.isAnswering && !channel) {
    this.tmpAnswer += message + "\n";

    clearTimeout(this.answerTimer);

    this.answerTimer = setTimeout(function() {
      User.bot.postMessageToUser(_this.name, User.bot.getText("thanks"), User.botParams);
      _this.answerCallback(_this.name + " " + User.bot.getText("said") + ": \n" + _this.tmpAnswer);
      isAnswering = false;
    }, 6 * 1000);
  }
};

User.add = function(data) {
  users.push(new User(data));
};

User.getName = function(id) {
  for(var i in users) {
    if(users[i].id === id) {
      return users[i].name;
    }
  }
};

User.get = function(id) {
  for(var i in users) {
    if(users[i].id === id) {
      return users[i];
    }
  }
};

module.exports = User;
