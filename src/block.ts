import { SHA256 } from "crypto-js";

class block {
  public index: number;
  public hash: string;
  public timestamps: number;
  public prevHash: string;
  public data: string;

  constructor(
    index: number,
    hash: string,
    timestamps: number,
    prevHash: string,
    data: string
  ) {
    this.index = index;
    this.hash = hash;
    this.timestamps = timestamps;
    this.prevHash = prevHash;
    this.data = data;
  }
}

const calculateHash = (
  index: number,
  timestamps: number,
  prevHash: string,
  data: string
): string => SHA256(index + timestamps + prevHash + data).toString();

const calculateHashOfBlock = (block: block): string =>
  SHA256(
    block.index + block.timestamps + block.prevHash + block.data
  ).toString();

const genesisBlock: block = new block(
  0,
  "ec9ab4c9833cd03c924da228cd574bbdec0f220b3a805dec3fecc32636833db9",
  1643539434835,
  null,
  "my genesis block!!"
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
  const hash = calculateHash(index, timestamps, prevHash, blockData);
  const newBlock = new block(index, hash, timestamps, prevHash, blockData);
  return newBlock;
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
    console.log("invalid hash");
    return false;
  } else if (calculateHashOfBlock(newBlock) !== newBlock.hash) {
    console.log("invalid hash");
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

export {
  block,
  getBlockChain,
  getCurrentBlock,
  generateBlock,
  isValidBlockStructure,
  replaceChain,
  addBlock,
};
