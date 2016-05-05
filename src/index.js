'use strict';

require('./index.html');

var Elm = require('./Main.elm');
var mountNode = document.getElementById('main');

var inboundPorts = {
  getConfirmation: 0
};
var app = Elm.embed(Elm.Main, mountNode, inboundPorts);

app.ports.askConfirmation.subscribe(function (args) {
  console.log('askConfirmation', args);
  var id = args[0];
  var message = args[1];
  var response = window.confirm(message);
  if (response) {
    app.ports.getConfirmation.send(id);
  }
});
