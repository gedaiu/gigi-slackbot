var users = [];


function User(data) {
  for(var key in data) {
    this[key] = data[key];
  }
}

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
