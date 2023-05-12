import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { sleep } from "../src/utils";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name === "polygon" || hre.network.name === "goerli") {
    console.log(
      `Deploying NftCollection to ${hre.network.name}. Hit ctrl + c to abort`
    );
    await sleep(10000);
  }

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const tx = await deploy("NftCollection", {
    from: deployer,
    log: hre.network.name != "hardhat" ? true : false,
  });
  console.log(
    `NftCollection deployed to ${hre.network.name} with address ${tx.receipt?.contractAddress}`
  );
};

export default func;

func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const shouldSkip = hre.network.name === "polygon";
  return shouldSkip ? true : false;
};
func.tags = ["NftCollection"];
