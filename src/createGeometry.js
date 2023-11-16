export default function createGeometry(fn, subX, subY = subX) {
  const positions = [];
  const triangles = [];
  const quads = [];

  subX++;
  subY++;

  for (let y = 0; y < subY; y++) {
    for (let x = 0; x < subX; x++) {
      positions.push(
        fn([subX <= 1 ? 0.5 : x / (subX - 1), subY <= 1 ? 0.5 : y / (subY - 1)])
      );
    }
  }

  for (let y = 0; y < subY - 1; y++) {
    for (let x = 0; x < subX - 1; x++) {
      const a = x + y * subX;
      const b = x + 1 + y * subX;
      const c = x + 1 + (y + 1) * subX;
      const d = x + (y + 1) * subX;
      triangles.push([a, b, d], [b, c, d]);
      quads.push([a, b, c, d]);
    }
  }

  return [
    positions,
    triangles,
    quads
  ];
}
