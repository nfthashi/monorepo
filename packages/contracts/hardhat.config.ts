import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks/__faucet/deploy";
import "./tasks/cmd/deploy-bridge";
import "./tasks/cmd/deploy-wrapped-nft-impl";
import "./tasks/cmd/register";
import "./tasks/cmd/upgrade-bridge";
import "./tasks/cmd/upgrade-wrapped-nft-impl";
import "./tasks/integration/register";
import "./tasks/integration/deploy";
import "./tasks/integration/upgrade-bridge";
import "./tasks/integration/upgrade-wrapped-nft-impl";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

import networks from "./networks.json";

dotenv.config();

const accounts = process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.11" }, { version: "0.8.15" }],
  },
  networks: {
    hardhat: process.env.FORK_GOERLI
      ? {
          forking: {
            url: networks.goerli.rpc,
          },
        }
      : {},
    goerli: {
      url: networks.goerli.rpc,
      accounts,
    },
    polygonMumbai: {
      url: networks.polygonMumbai.rpc,
      accounts,
    },
    optimisticGoerli: {
      url: networks.optimisticGoerli.rpc,
      accounts,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
      optimisticGoerli: process.env.OPTIMISM_ETHERSCAN_API_KEY || "",
    },
  },
};

export default config;
