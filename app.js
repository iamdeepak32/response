import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { mainRouter } from "./router/mainRouter.js";
import "./controller/utils/emailSchedule.js"; 

const app = express();
app.use(express.json());
app.use(express.static("frontend"));
app.use("/api", mainRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
