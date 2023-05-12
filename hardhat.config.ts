import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "solidity-coverage";
import "hardhat-gas-reporter";

import { ethers } from "ethers";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
const POLYGON_ALCHEMY_ID = process.env.POLYGON_ALCHEMY_ID;
const GOERLI_ALCHEMY_ID = process.env.GOERLI_ALCHEMY_ID;
const PK = process.env.PK;
const TEST_PK = process.env.TEST_PK;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",

  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  networks: {
    hardhat: {
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_ALCHEMY_ID}`,
        blockNumber: 25594591, // ether price $4,168.96
      },
      accounts: {
        accountsBalance: ethers.utils.parseEther("10000").toString(),
      },
    },
    polygon: {
      accounts: PK ? [PK] : [],
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_ALCHEMY_ID}`,
      timeout: 300000,
    },
    goerli: {
      accounts: TEST_PK ? [TEST_PK] : [],
      chainId: 5,
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_ALCHEMY_ID}`,
      timeout: 300000,
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: { enabled: true, runs: 2235 },
        },
      },
    ],
  },

  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
    }
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },

  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};

export default config;
