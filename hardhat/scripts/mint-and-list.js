const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("0.1")

const mintAndList = async () => {
  const nftMarketplace = await ethers.getContract("NftMarketplace")
  const basicNft = await ethers.getContract("BasicNft")
  console.log("Minting...")
  const mintTrx = await basicNft.mintNFT()
  const mintTrxReceipt = await mintTrx.wait(1)
  const tokenId = mintTrxReceipt.events[0].args.tokenId
  console.log("Approving Nft...")
  const approvalTrx = await basicNft.approve(nftMarketplace.address, tokenId)
  await approvalTrx.wait(1)
  console.log("Listing Nft...")
  const trx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
  await trx.wait(1)
  console.log("Listed!")
}

mintAndList()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
