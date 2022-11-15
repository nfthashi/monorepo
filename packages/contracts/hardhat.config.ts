import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

import { getMnemonic } from "./lib/mnemonic";
import { getNetworksUserConfigs } from "./lib/network";
import networkJsonFile from "./network.json";

dotenv.config();

const defaultChainId = "5";

const mnemonic = getMnemonic();
const networksUserConfigs = getNetworksUserConfigs(mnemonic);

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.15",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: Number(defaultChainId),
      accounts: {
        mnemonic,
      },
      forking: {
        url: networkJsonFile[defaultChainId].rpc,
      },
    },
    ...networksUserConfigs,
  },
};

export default config;
