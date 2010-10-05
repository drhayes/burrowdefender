// updater.js
//
// runs on a timer and updates stuff

(function(global, $) {

  var Updater = function() {
      this.processes = [];
      this.currentFrame = 0;

      this.add = function(updateMe) {
        if (typeof(updateMe) !== 'function') {
          throw new Error('must pass in function');
        }
        if (!updateMe.hasOwnProperty('frequency')) {
          updateMe.frequency = 1;
        }
        this.processes.push(updateMe);
      }

      this.remove = function(removeMe) {
        this.processes = $.grep(this.processes, function(process) {
          return process !== removeMe;
        })
      }

      this.update = function() {
        var me = this;
        $.each(this.processes, function(index, process) {
          if ((me.currentFrame % process.frequency) === 0) {
            process();
          }
        });
        this.currentFrame++;
      }

      this.start = function() {
        if (!this.timer) {
          var me = this;
          this.timer = setInterval(function() {
              me.update();
            }, 20);
        }
      }

      this.stop = function() {
        if (this.timer) {
          clearTimeout(this.timer);
          delete(this.timer);
        }
      }
    };

  global.Updater = Updater;
  
})(window, jQuery)

