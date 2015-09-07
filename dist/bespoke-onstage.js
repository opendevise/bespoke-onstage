/*!
 * bespoke-onstage v1.0.0-dev
 *
 * Copyright 2015, Dan Allen
 * This content is released under the MIT license
 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.bespoke||(g.bespoke = {}));g=(g.plugins||(g.plugins = {}));g.onstage = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function() {
  return function(deck) {
    var clients = [],
      currentStep = 0,
      broadcast = function() {
        clients.forEach(function(client) {
          client.postMessage(['CURSOR', (deck.slide() + 1) + '.' + currentStep].join(' '), '*');
        });
      },
      getSteps = function(slide) {
        return deck.slides[slide].querySelectorAll('.bespoke-bullet').length;
      },
      hasStep = function(slide, step) {
        return getSteps(slide) >= step;
      },
      getStep = function() {
        var bullets = deck.slides[deck.slide()].querySelectorAll('.bespoke-bullet');
        for (var i = 0, len = bullets.length; i < len; i++) {
          if (bullets[i].classList.contains('bespoke-bullet-current')) return i;
        }
        return 0;
      },
      onMessage = function(e) {
        var argv = e.data.split(' ');
        var client = e.source;
        switch(argv[0]) {
          case 'REGISTER':
            clients.push(client);
            client.postMessage(['REGISTERED', encodeURIComponent(document.title), deck.slides.length].join(' '), '*');
            broadcast();
            break;
          case 'FORWARD':
            deck.next();
            currentStep = getStep();
            broadcast();
            break;
          case 'BACK':
            deck.prev();
            currentStep = getStep();
            broadcast();
            break;
          case 'START':
            deck.slide(0, { preview: true });
            currentStep = 0;
            broadcast();
            break;
          case 'END':
            deck.slide(deck.slides.length - 1, { preview: true });
            currentStep = 0;
            broadcast();
            break;
          case 'SET_CURSOR':
            var cursor = argv[1] || '1', slide, step;
            if (cursor.indexOf('.') !== -1) {
              var cursorv = cursor.split('.', 2).map(function(n) { return ~~n; });
              slide = cursorv[0];
              step = cursorv[1];
            }
            else {
              slide = ~~cursor;
              step = 0;
            }
            if (step > 0 && !hasStep(slide - 1, step)) {
              slide += 1;
              step = 0;
            }
            if (slide < 1) {
              slide = 1;
            }
            else if (slide > deck.slides.length) {
              slide = deck.slides.length;
            }
            // TODO if slide/step only differs by a substep, use next()/prev() to get there
            deck.slide(slide - 1, { preview: true });
            // HACK step through bullets
            for (var i = 0; i < step; i++) deck.next()
            //currentStep = getStep();
            currentStep = step;
            broadcast();
            break;
          case 'GET_NOTES':
            var node = deck.slides[deck.slide()].querySelector('[role=note]'),
              content = node ? encodeURIComponent(node.innerHTML) : '';
            client.postMessage(['NOTES', content].join(' '), '*');
            break;
        }
      };
    window.addEventListener('message', onMessage, false);
  };
};

},{}]},{},[1])(1)
});