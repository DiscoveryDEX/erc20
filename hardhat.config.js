require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: "poverty wall lady unveil trophy control still medal alien giraffe message fine",
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10,
        passphrase: ""
      }
    }
  },
  namedAccounts: {
    account_owner: {
      default: 0
    },
    account_user: {
      default: 1
    },
    account_invalid_user: {
      default: 2
    }
  }
};
