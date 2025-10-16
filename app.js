import express from "express";
import { mainRouter } from "./router/mainRouter.js";

const app = express();
app.use(express.json());

app.use("/api", mainRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
