const cube = Cube.fromString(state);
const solution = cube.solve();
const moves = solution.trim() ? solution.trim().split(/\s+/) : [];
const steps = [];

for (const move of moves) {
  cube.move(move);
  steps.push({
    move,
    facelets: cube.asString()
  });
}

if (!cube.isSolved()) {
  throw new Error("Could not verify the solution.");
}

res.json({
  solution: solution || "(already solved)",
  verified: true,
  steps
});
