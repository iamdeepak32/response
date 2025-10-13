import express from "express";
import { mainRouter } from "./router/index.js";

const app = express();

app.use(express.json());
app.use("/", mainRouter);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);
