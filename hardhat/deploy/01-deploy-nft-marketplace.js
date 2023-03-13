const { network } = require("hardhat")
const { verify } = require("../hardhat.config")
const { devChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  let args = []

  const nftMarketplace = await deploy("NftMarketplace", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(nftMarketplace.address, args)
  }

  log("----------------------------------------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
