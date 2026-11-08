const express = require("express");
const Cube = require("cubejs");

const app = express();
app.use(express.json());

let solverReady = false;

app.get("/", (_req, res) => {
  res.send("Rubik's Cube Solver is running.");
});

app.post("/solve", (req, res) => {
  try {
    const facelets = req.body.facelets;

    if (typeof facelets !== "string") {
      return res.status(400).json({ error: 'Send {"facelets":"..."} in JSON.' });
    }

    const state = facelets.replace(/\s/g, "").toUpperCase();

    if (state.length !== 54 || !/^[URFDLB]{54}$/.test(state)) {
      return res.status(400).json({
        error: "Enter exactly 54 face letters: U, R, F, D, L, B."
      });
    }

    for (const face of "URFDLB") {
      if ([...state].filter((letter) => letter === face).length !== 9) {
        return res.status(400).json({ error: `Use exactly 9 ${face}'s.` });
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
