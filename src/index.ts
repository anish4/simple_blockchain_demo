import express, { Response } from "express";
import { block, generateBlock, getBlockChain, addBlock } from "./block";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
const HTTP_PORT = process.env.HTTP_PORT || 4000;

app.get("/blocks", (_, res: Response) => {
  res.send(getBlockChain());
});

app.post("/mineBlock", (req, res) => {
  res.send(generateBlock(req.body.data));
});
app.post("/addBlock", (req, res) => {
  res.send(addBlock(req.body.block));
});
app.listen(HTTP_PORT, () => console.log(`Running on port ${HTTP_PORT}`));
