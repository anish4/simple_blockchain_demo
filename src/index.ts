import express, { Response } from "express";
import { block, generateBlock, getBlockChain, addBlock } from "./block";
import dotenv from "dotenv";
import { SHA256 } from "crypto-js";

dotenv.config();
const app = express();
app.use(express.json());
const HTTP_PORT = process.env.HTTP_PORT || 4000;
console.log(
  SHA256(
    18 +
      1643897254202 +
      "07d2f587e93fff09b2fef26a50e28f265419ffb19d7e31ae5561130218f82a15" +
      "Rohan paid Zen 500 bestc\n Noto paid Mane 90 bestc" +
      3 +
      14
  ).toString()
);

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
