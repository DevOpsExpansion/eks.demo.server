import express from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import morgan from "morgan";

import postRoutes from "./routes/posts.js";
import userRouter from "./routes/user.js";
import { readFileSync } from "fs";

dotenv.config();

const app = express();

app.use(morgan("[:date[clf]] :status :url | :total-time[3] ms"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRouter);
const token = readFileSync(process.env.AWS_WEB_IDENTITY_TOKEN_FILE, {
  encoding: "utf8",
  flag: "r",
});
const CONNECTION_URL = `${process.env.CONNECTION_URL}?retryWrites=true&w=majority&authMechanism=MONGODB-AWS&authMechanismProperties=AWS_SESSION_TOKEN:${token}`;
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server Running on Port: http://:${PORT}`));

mongoose
  .connect(CONNECTION_URL, {
    dbName: process.env.DATABASE_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);
