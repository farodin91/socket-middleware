
var cache = {}

function Cookies(handshake) {
  //console.log(handshake)
  this.handshake = handshake;
}


Cookies.prototype = {
  get: function(name, opts) {
    //console.log(name,opts)
    var sigName = name + ".sig"
      , header, match, value, remote, data, index
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys


    header = this.handshake.headers["cookie"];
    //console.log(header);
    if (!header) return;

    match = header.match(getPattern(name))
    if (!match) return;
    //console.log(match);

    value = match[1];
    return value;
    //need to sign;
    //if (!opts || !signed)

    //remote = this.get(sigName)
    //if (!remote) return

    //data = name + "=" + value
    ////sign
    //return value;
  },
  set: function(name, value, opts){
    console.log(name, value, opts);
    return this;
  }
}

function getPattern(name) {
  if (cache[name]) return cache[name]

  return cache[name] = new RegExp(
    "(?:^|;) *" +
    name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
    "=([^;]*)"
  )
}

module.exports = Cookies
