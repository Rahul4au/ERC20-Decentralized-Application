const MyTokenA = artifacts.require("MyTokenA");
const MyTokenB = artifacts.require("MyTokenB");
const LiquidityPool = artifacts.require("LiquidityPool");

module.exports = async function(deployer, network, accounts) {
  // Get deployed token instances
  const tokenA = await MyTokenA.deployed();
  const tokenB = await MyTokenB.deployed();

  // Deploy Liquidity Pool
  await deployer.deploy(LiquidityPool, tokenA.address, tokenB.address);
  const liquidityPool = await LiquidityPool.deployed();

  console.log("Liquidity Pool deployed at:", liquidityPool.address);
};