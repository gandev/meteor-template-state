Template.timeTravelOverlay.onCreated(function() {
  this.isResizing = new ReactiveVar(false);
  this.clientRect = new ReactiveVar(null);
  this.moveStart = new ReactiveVar(null);
  this.moveCurrent = new ReactiveVar(null);
});

Template.timeTravelOverlay.onRendered(function() {
  var self = this;

  self.autorun(function () {
    if(self.isResizing.get()) {
      var start = self.moveStart.get();
      var current = self.moveCurrent.get();
      var rect = self.clientRect.get();

      var newWidth = rect.width;
      if(start.x > current.x) {
        newWidth -= current.x - start.x;
      } else if(start.x < current.x) {
        newWidth += current.x - start.x;
      }

      var newHeight = rect.height;
      if(start.y > current.y) {
        newHeight -= current.y - start.y;
      } else if(start.y < current.y) {
        newHeight += current.y - start.y;
      }

      console.log('new', newWidth, newHeight);
    }
  });
});

Template.timeTravelOverlay.events({
  'mousedown .time-travel-overlay': function(evt, tmpl) {
    var clientRect = evt.target.getBoundingClientRect();

    tmpl.isResizing.set(true);
    tmpl.clientRect.set(clientRect);
    tmpl.moveStart.set({
      x: evt.pageX,
      y: evt.pageY
    });

    console.log('old', clientRect.width, clientRect.height);
  },
  'mouseup': function (evt, tmpl) {
    tmpl.isResizing.set(false);
    tmpl.clientRect.set(null);
    tmpl.clientRect.set(null);
  },
  'mousemove .time-travel-overlay': function (evt, tmpl) {
    tmpl.moveCurrent.set({
      x: evt.pageX,
      y: evt.pageY
    });
  }
});
