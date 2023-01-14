import config from "./config";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app: express.Application = express();

app.use(bodyParser.json());

app.listen(config.port, () => {
  console.log(`${config.appName} running on port ${config.port}`);
});
