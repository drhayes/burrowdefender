// input.js
//
// All things related to getting information from the player.

(function(global, $) {
  
  loki.modules.input = function(env) {
    env.keyboardmanager = function() {
      var that = {};
    
      // This object maps keyCode values to key names for common nonprinting
      // function keys. IE and Firefox use mostly compatible keycodes for these.
      // Note, however that these keycodes may be device-dependent and different
      // keyboard layouts may have different values.
      var keyCodeToFunctionKey = { 
          8:"backspace", 9:"tab", 13:"return", 16:"shift", 17:"control",
          18:"alt", 19:"pause", 27:"escape", 32:"space",
          33:"pageup", 34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up",
          39:"right", 40:"down", 44:"printscreen", 45:"insert", 46:"delete",
          112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7",
          119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
          144:"numlock", 145:"scrolllock"
      };


      // This object maps keydown keycode values to key names for printable 
      // characters.  Alphanumeric characters have their ASCII code, but 
      // punctuation characters do not.  Note that this may be locale-dependent
      // and may not work correctly on international keyboards.
      var keyCodeToPrintableChar = {
          48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8",
          57:"9", 59:";", 61:"=", 65:"a", 66:"b", 67:"c", 68:"d",
          69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m",
          78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v",
          87:"w", 88:"x", 89:"y", 90:"z", 107:"+", 109:"-", 110:".", 188:",",
          190:".", 191:"/", 192:"`", 219:"[", 220:"\\", 221:"]", 222:"\""
      };

      var dispatchCallback = function(event) {
          that.dispatch(event);
      }

      that.keymap = {};

      // latch onto keydown and keyup events of the body element
      that.latch = function() {
          $('body').keydown(dispatchCallback).keyup(dispatchCallback);
      }

      // we are latched on construction
      that.latch();

      that.unlatch = function() {
          $('body').unbind('keydown', dispatchCallback).unbind('keyup', dispatchCallback);
      }

      // function called when receiving a keyboard event
      that.dispatch = function(event) {
          var keyname = '';
          var code = event.keyCode;
          // retrieve keyname from our mapping
          keyname = keyCodeToFunctionKey[code];

          // if this wasn't a function key, check printable
          if (!keyname) {
              keyname = keyCodeToPrintableChar[code];
          }

          // is this a press or a release?
          var val = (event.type === 'keydown');
          // now that we've determined key name, fire
          // the handler function (if present)
          if (keyname) {
            that.keymap[keyname] = val;
          }
      }
      
      return that;
    } // keyboardmanager
  }
  
}(this, jQuery))