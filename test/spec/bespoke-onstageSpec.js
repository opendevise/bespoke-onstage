Function.prototype.bind = Function.prototype.bind || require('function-bind');

var bespoke = require('bespoke'),
  onstage = require('../../lib/bespoke-onstage.js');

describe("bespoke-onstage", function() {

  var deck,
    createDeck = function() {
      var parent = document.createElement('article');
      for (var i = 0; i < 5; i++) {
        var section = document.createElement('section');
        parent.appendChild(section);
      }

      document.body.appendChild(parent);

      deck = bespoke.from(parent, [
        onstage()
      ]);
    },
    destroyDeck = function() {
      deck.fire('destroy');
      deck.parent.parentNode.removeChild(deck.parent);
      deck = null;
    };

  beforeEach(createDeck);
  afterEach(destroyDeck);

  describe("behavior xyz", function() {

    beforeEach(function() {
      deck.slide(0);
    });

    it("should do something", function() {
    });
  });
});
