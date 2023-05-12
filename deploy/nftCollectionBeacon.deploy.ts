import { deployments, ethers, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name === "polygon" || hre.network.name === "goerli") {
    console.log(
      `Deploying NftCollectionBeacon to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(10000);
  }

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = [(await ethers.getContract("NftCollection")).address];
  const tx = await deploy("NftCollectionBeacon", {
    from: deployer,
    args: args,
    log: hre.network.name != "hardhat" ? true : false,
  });
  console.log(
    `NftCollectionBeacon deployed to ${hre.network.name} with address ${tx.receipt?.contractAddress}
      and args [${args}]`
  );
};

export default func;

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const shouldSkip = hre.network.name === "polygon";
  return shouldSkip ? true : false;
};
func.tags = ["NftCollectionBeacon"];
func.dependencies = ["NftCollection"];
