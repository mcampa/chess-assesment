import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Api } from "./api";
import bodyParser from "body-parser";

dotenv.config();

const DB_URL = process.env.DB_URL || "127.0.0.1";
const DB_NAME = process.env.DB_NAME || "chess";
const port = process.env.PORT || 3000;

(async () => {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
  });

  await mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`);

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", () => {
    console.log("Connected to database.");
  });

  const app: Express = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/:gameId?", (req: Request, res: Response) => {
    res.sendFile("./index.html", { root: __dirname });
  });

  app.use("/api", Api);

  app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
  });
})();
