import { SHA256 } from "crypto-js";
import { hexToBinary } from "./utils";

//seconds
const BLOCK_GENERATION_INTERVAL: number = 20000;

//blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 5;

class block {
  public index: number;
  public hash: string;
  public timestamps: number;
  public prevHash: string;
  public data: string;
  public difficulty: number;
  public nonce: number;

  constructor(
    index: number,
    hash: string,
    timestamps: number,
    prevHash: string,
    data: string,
    difficulty: number,
    nonce: number
  ) {
    this.index = index;
    this.hash = hash;
    this.timestamps = timestamps;
    this.prevHash = prevHash;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }
}

const calculateHash = (
  index: number,
  timestamps: number,
  prevHash: string,
  data: string,
  difficulty: number,
  nonce: number
): string =>
  SHA256(index + timestamps + prevHash + data + difficulty + nonce).toString();

const calculateHashOfBlock = (block: block): string =>
  SHA256(
    block.index +
      block.timestamps +
      block.prevHash +
      block.data +
      block.difficulty +
      block.nonce
  ).toString();

const genesisBlock: block = new block(
  0,
  "ec9ab4c9833cd03c924da228cd574bbdec0f220b3a805dec3fecc32636833db9",
  1643539434835,
  null,
  "first block!!",
  0,
  0
);

let blockChain: block[] = [genesisBlock];

const getBlockChain = (): block[] => blockChain;

const getCurrentBlock = (): block => blockChain[blockChain.length - 1];

const addBlock = (newBlock: block): boolean => {
  if (isValidBlock(newBlock, getCurrentBlock())) {
    blockChain.push(newBlock);
    return true;
  }
  return false;
};

const generateBlock = (blockData: string): block => {
  const currentBlock = getCurrentBlock();
  const index = currentBlock.index + 1;
  const timestamps = new Date().getTime();
  const prevHash = currentBlock.hash;
  const difficulty = getDifficulty(getBlockChain());
  const block = findBlock(index, timestamps, prevHash, blockData, difficulty);
  addBlock(block);
  return block;
};

const findBlock = (
  index: number,
  timestamps: number,
  prevHash: string,
  blockData: string,
  difficulty: number
) => {
  let nonce = 0;
  while (true) {
    const hash = calculateHash(
      index,
      timestamps,
      prevHash,
      blockData,
      difficulty,
      nonce
    );
    if (hashMatchDifficulty(hash, difficulty)) {
      return new block(
        index,
        hash,
        timestamps,
        prevHash,
        blockData,
        difficulty,
        nonce
      );
    }
    nonce++;
  }
};

const isValidBlockStructure = (block: block): boolean =>
  typeof block.index === "number" &&
  typeof block.hash === "string" &&
  typeof block.data === "string" &&
  typeof block.prevHash === "string" &&
  typeof block.timestamps === "number";

const isValidBlock = (newBlock: block, previousBlock: block): boolean => {
  if (!isValidBlockStructure(newBlock)) {
    console.log("invalid block structure");
    return false;
  }

  if (newBlock.index !== previousBlock.index + 1) {
    console.log("invalid index!!");
    return false;
  } else if (newBlock.prevHash !== previousBlock.hash) {
    console.log("invalid hash1");
    return false;
  } else if (calculateHashOfBlock(newBlock) !== newBlock.hash) {
    console.log("invalid hash2");
    return false;
  }
  return true;
};

const isValidChain = (chain: block[]): boolean => {
  const isValidGenesis = (block: block): boolean =>
    JSON.stringify(block) === JSON.stringify(genesisBlock);

  if (isValidGenesis(chain[0])) {
    console.log("invalid genesis");
    return false;
  }

  for (let i = 1; i < chain.length; i++) {
    if (!isValidBlock(chain[i], chain[i - 1])) {
      console.log("invalid chain");
      return false;
    }
  }
  return true;
};

const replaceChain = (newBlock: block[]) => {
  if (isValidChain(newBlock) && newBlock.length > getBlockChain().length) {
    console.log(
      "Received chain is valid!!!Replacing the current blockchain with received chain"
    );
    blockChain = newBlock;
  } else {
    console.log("invalid chain");
  }
};

const hashMatchDifficulty = (hash: string, difficulty: number) => {
  const hashToBinary: string = hexToBinary(hash);
  console.log(difficulty);
  const prefix = "0".repeat(difficulty);
  return hashToBinary.startsWith(prefix);
};

const getDifficulty = (chain: block[]): number => {
  const latestBlock = chain[chain.length - 1];
  if (
    latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 &&
    latestBlock.index !== 0
  ) {
    console.log("hi");
    return adjustedDifficulty(latestBlock, chain);
  } else return latestBlock.difficulty;
};

const adjustedDifficulty = (latestBlock: block, chain: block[]): number => {
  const prevAdjustmentBlock: block =
    chain[blockChain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
  const expectedTime =
    BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
  const timeTaken = latestBlock.timestamps - prevAdjustmentBlock.timestamps;
  if (timeTaken > expectedTime * 2) {
    return prevAdjustmentBlock.difficulty - 1;
  } else if (timeTaken < expectedTime / 2) {
    return prevAdjustmentBlock.difficulty + 1;
  } else {
    return latestBlock.difficulty;
  }
};

export {
  block,
  getBlockChain,
  getCurrentBlock,
  generateBlock,
  isValidBlockStructure,
  replaceChain,
  addBlock,
};
