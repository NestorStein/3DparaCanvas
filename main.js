// Import utilities
import createApp from "./src/createApp.js";
import createCamera from "./src/createCamera.js";
import createGeometry from "./src/createGeometry.js";

// Get our <canvas> tag
const canvas = document.querySelector("#canvas");

// Here is our 'sketch' function that wraps the artwork
function sketch() {
  // A simple parametric sine wave function
  function parametric([u, v]) {
    const y = Math.sin(u * Math.PI * 2) * 0.5;
    return [u * 2 - 1, y, v * 2 - 1];
  }

  // Number of X and Y subdivisions on the surface
  const subdivisions = 16;

  // Create a parametric geometry from the above function
  const [vertices, triangles, quads] = createGeometry(
    parametric,
    subdivisions,
    subdivisions
  );

  // You can turn this off to render triangles
  const renderWithQuads = true;
  const cells = renderWithQuads ? quads : triangles;

  // Return a 'render' function that determines how to show the artwork
  return ({ context, width, height, time }) => {
    // Clear buffer
    context.clearRect(0, 0, width, height);

    // Draw background
    context.fillStyle = "hsl(0, 0%, 95%)";
    context.fillRect(0, 0, width, height);

    // Set fill/stroke color
    context.fillStyle = context.strokeStyle = "black";

    // Min dimension of screen
    const dim = Math.min(width, height);

    // Determine the new position of our camera in 3D space
    const curTime = time + 2.5;
    const orbitAngle = curTime * 0.5;
    const orbitDistance = 2;
    const u = Math.cos(orbitAngle) * orbitDistance;
    const v = Math.sin(orbitAngle) * orbitDistance;
    const y = orbitDistance;
    const position = [u, y, v];

    // Setup a camera projection function
    const project = createCamera({
      // You can also try using different projection methods
      // mode: "isometric",
      position,
      width,
      height
    });

    // Project 3D points to 2D screen-space positions
    const vertices2D = vertices.map((v) => project(v));

    // Draw each cell in the mesh
    cells.forEach((cell) => {
      // A cell is a list of indices into our vertex array
      // So we map each index to its corresponding 2D point
      const points = cell.map((i) => vertices2D[i]);

      // Draw the quad as line segments
      context.beginPath();
      points.forEach((p) => {
        const [x, y] = p;
        context.lineTo(x, y);
      });
      context.closePath();
      context.lineJoin = "round";
      context.lineWidth = dim * 0.0025;
      context.stroke();
    });
  };
}

// Create our canvas application
createApp(sketch, canvas);
