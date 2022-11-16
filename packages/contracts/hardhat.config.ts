import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

import { getMnemonic } from "./lib/mnemonic";
import { getNetworksUserConfigs } from "./lib/network";
import networkJsonFile from "./network.json";
import { ChainId } from "./types/ChainId";

dotenv.config();

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
    hardhat:
      process.env.IS_INTEGRATION_TEST === "true"
        ? {
            chainId: Number(process.env.FORK_CHAIN_ID),
            accounts: {
              mnemonic,
            },
            forking: {
              url: networkJsonFile[process.env.FORK_CHAIN_ID as ChainId].rpc,
            },
          }
        : {},
    ...networksUserConfigs,
  },
};

export default config;
