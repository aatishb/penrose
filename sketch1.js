// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name
    // p5 sketch goes here
    let canvas;

    p.setup = function() {
      let target = parent.$el;
      let width = target.clientWidth;
      let height = target.clientHeight;

      canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);

      p.stroke(255,0,0);
      p.noLoop();
      drawLines(parent.data);
    };

    p.draw = function() {
    };

    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(data, oldData) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
      drawLines(data);
    };

    // uses some logic from https://stackoverflow.com/a/33558386
    p.windowResized = function() {
      // Hide the canvas so we can get the parent's responsive bounds
      let displayBackup = canvas.elt.style.display;
      canvas.elt.style.display = 'none';

      // measure parent without canvas
      let target = parent.$el;
      let width = target.clientWidth;
      let height = target.clientHeight;

      // resize canvas
      p.resizeCanvas(width, height);

      // restore canvas visibility
      canvas.elt.style.display = displayBackup;

      drawLines(parent.data);
    };

    function drawLines(data) {
      let grid = data.grid;
      let steps = data.steps;
      let multiplier = data.multiplier;
      let spacing = p.min(p.width, p.height) / (2 * steps + 1);
      spacing = spacing * data.zoom; // zoom out to show parallel lines

      p.push();
      p.background(0, 0, 0.2 * 255);
      p.translate(p.width / 2, p.height / 2);

      for (let [angle, index] of grid) {
        drawLine(multiplier * angle, spacing * index);
      }

      if (data.showIntersections) {
        for (let pt of Object.values(data.intersectionPoints)) {
          p.ellipse(pt.x * spacing, pt.y * spacing, 5);
        }
      }
      
      p.pop();
    }

    // angle, index
    function drawLine(angle, index) {
      let x0 = getXVal(angle, index, -p.height/2);
      let x1 = getXVal(angle, index, p.height/2);
      if (!isNaN(x0) && !isNaN(x1)) {
        p.line(x0, -p.height/2, x1, p.height/2);
      } else {
        let y0 = getYVal(angle, index, -p.width/2);
        let y1 = getYVal(angle, index, p.width/2);
        p.line(-p.width/2, y0, p.width/2, y1);
      }
    }

    // angle, index
    function getXVal(angle, index, y) {
      return (index - y * p.sin(angle))/p.cos(angle);
    }

    // angle, index
    function getYVal(angle, index, x) {
      return (index - x * p.cos(angle))/p.sin(angle);
    }

  };
}
