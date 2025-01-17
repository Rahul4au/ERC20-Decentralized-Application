const MyTokenA = artifacts.require("MyTokenA");
const MyTokenB = artifacts.require("MyTokenB");

module.exports = async function(deployer, network, accounts) {
  // Deploy TokenA
  await deployer.deploy(MyTokenA);
  const tokenA = await MyTokenA.deployed();

  // Deploy TokenB
  await deployer.deploy(MyTokenB);
  const tokenB = await MyTokenB.deployed();

  console.log("TokenA deployed at:", tokenA.address);
  console.log("TokenB deployed at:", tokenB.address);
};