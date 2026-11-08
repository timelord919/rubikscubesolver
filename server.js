const express = require("express");
const path = require("path");
const Cube = require("cubejs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let solverReady = false;

app.post("/solve", (req, res) => {
  try {
    const facelets = req.body.facelets;

    if (typeof facelets !== "string") {
      return res.status(400).json({ error: "Enter the cube state." });
    }

    const state = facelets.replace(/\s/g, "").toUpperCase();

    if (state.length !== 54 || !/^[URFDLB]{54}$/.test(state)) {
      return res.status(400).json({
        error: "Enter exactly 54 letters: U, R, F, D, L, B."
      });
    }

    for (const face of "URFDLB") {
      const count = [...state].filter((letter) => letter === face).length;
      if (count !== 9) {
        return res.status(400).json({
          error: `Use exactly 9 ${face} letters.`
        });
      }
    }

    if (!solverReady) {
      Cube.initSolver();
      solverReady = true;
    }

    const cube = Cube.fromString(state);
    const solution = cube.solve();

    const check = cube.clone();
    check.move(solution);

    if (!check.isSolved()) {
      throw new Error("Could not verify the solution.");
    }

    res.json({ solution: solution || "(already solved)", verified: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Solver running on port ${port}`);
});
