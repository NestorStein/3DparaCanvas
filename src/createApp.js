/**
  A utility for creating <canvas> app in a fashion similar
  to the canvas-sketch framework.
*/

export default function createApp(sketch, canvas) {
  let width, height, pixelRatio;

  // Run the sketch function to get back a renderer
  const render = sketch();

  let lastTime = Date.now();
  let time = 0;

  // Get 2D context
  const context = canvas.getContext("2d");

  // Resize canvas and redraw a frame
  resize();

  // Attach listener
  window.addEventListener("resize", resize);
  let raf = null;
  const autoplay = true;

  if (autoplay) start();
  else {
    window.addEventListener("touchstart", start);
    window.addEventListener("mousedown", start);
    window.addEventListener("touchend", stop);
    window.addEventListener("mouseup", stop);
  }

  // Return a detach function
  return () => {
    stop();

    if (autoplay) {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("mousedown", start);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("mouseup", stop);
    }

    window.removeEventListener("resize", resize);
  };

  function start() {
    lastTime = Date.now();
    raf = window.requestAnimationFrame(animate);
  }

  function stop() {
    window.cancelAnimationFrame(raf);
    raf = null;
  }

  function animate() {
    raf = window.requestAnimationFrame(animate);
    const now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    time += dt;
    redraw(dt);
  }

  function resize() {
    // Resize the canvas to size * pixelRatio
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = window.devicePixelRatio;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    // Redraw frame now that size has changed
    redraw();
  }

  function redraw(deltaTime = 0) {
    // When drawing, we scale context by pixel ratio
    context.save();
    context.scale(pixelRatio, pixelRatio);
    // Call user render function
    render({ canvas, context, width, height, pixelRatio, time, deltaTime });
    context.restore();
  }
}
