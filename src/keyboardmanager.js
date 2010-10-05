// keyboardmanager.js
//
// much of the design of this class is taken from JavaScript: The Definitive Guide
// with some modifications to work with the rest of the framework and with
// the knowledge that this is inside an AIR app.
// does not detect modifier keys themselves, only in combination with
// printable characters.
// depends: eventer.js

(function(global, $) {

  var KeyboardManager = function() {
      // This object maps keyCode values to key names for common nonprinting
      // function keys. IE and Firefox use mostly compatible keycodes for these.
      // Note, however that these keycodes may be device-dependent and different
      // keyboard layouts may have different values.
      var keyCodeToFunctionKey = { 
          8:"backspace", 9:"tab", 13:"return", 19:"pause", 27:"escape", 32:"space",
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

      // used for callbacks and such
      var me = this;
      this.eventer = new Eventer();

      var dispatchCallback = function(event) {
          me.dispatch(event);
      }

      this.keyMap = {};

      // latch onto keydown and keyup events of the body element
      this.latch = function() {
          $('body').keydown(dispatchCallback);
          $('body').keypress(dispatchCallback);
      }

      // we are latched on construction
      this.latch();

      this.unlatch = function() {
          $('body').unbind('keydown', dispatchCallback);
          $('body').unbind('keypress', dispatchCallback);
      }

      // function called when receiving a keyboard event
      this.dispatch = function(event) {
          var modifiers = '';
          var keyname = '';
          if (event.type === 'keydown') {
              var code = event.keyCode;
              // ignore keydown events for shift, ctrl, and alt
              if (code === 16 || code === 17 || code === 18) {
                  return;
              }
              // retrieve keyname from our mapping
              keyname = keyCodeToFunctionKey[code];

              // if this wasn't a function key, but the ctrl or alt modifiers are
              // down, we want to treat it like a function key
              if (!keyname && (event.altKey || event.ctrlKey)) {
                  keyname = keyCodeToPrintableChar[code];
              }

              // if we found a name for this key, figure out its modifiers
              // otherwise, return and ignore this keydown event
              if (keyname) {
                  if (event.altKey) {
                      modifiers += 'alt_';
                  }
                  if (event.ctrlKey) {
                      modifiers += 'ctrl_';
                  }
                  if (event.shiftKey) {
                      modifiers += 'shift_';
                  }
              }
              else {
                  return;
              }
          }
          else if (event.type === 'keypress') {
              // if ctrl or alt are down, we already handled it
              if (event.altKey || event.ctrlKey) {
                  return;
              }

              // TODO: do we get keypress events for nonprinting keys in AIR?
              if (event.charCode != undefined && event.charCode === 0) {
                  return;
              }

              // the code is an ASCII code, so just convert it to a string
              keyname = String.fromCharCode(event.charCode);

              // if the name of the key is uppercase, conver to lower and add shift
              // we do it this way to handle CAPS LOCK; it sends capital letters
              // without having the shift modifier set
              var lowercase = keyname.toLowerCase();
              if (keyname != lowercase) {
                  keyname = lowercase;
                  modifiers += 'shift_';
              }
          }

          // now that we've determined modifiers and key name, fire
          // the handler function (if present)
          var resultKey = modifiers + keyname;
          var eventArg = {};
          eventArg['key'] = resultKey;
          this.eventer.fire(resultKey, eventArg);
      }

      this.bind = function(key, handler) {
          // using the eventer means we can handle multiple events per keypress
          this.eventer.subscribe(key, handler);
      }    
  }
  
  global.KeyboardManager = KeyboardManager;
  
})(window, jQuery)

