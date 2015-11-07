var channels = [];

function Channel(data) {
  for(var key in data) {
    this[key] = data[key];
  }
}

Channel.add = function(data) {
  channels.push(new Channel(data));
};

Channel.getName = function(id) {
  for(var i in channels) {
    if(channels[i].id === id) {
      return channels[i].name;
    }
  }
};

Channel.get = function(id) {
  for(var i in channels) {
    if(channels[i].id === id) {
      return channels[i];
    }
  }
};

module.exports = Channel;
