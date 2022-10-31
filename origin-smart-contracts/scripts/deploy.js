// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const name = "Origin";
  const symbol = "O_O";
  const tokenUri = "ipfs://QmacHh4buJxFNKHVcsMaQYxrqkbLosDGAscXG4ffAncGeM"
  const ownerAddress = "0x861a811Fa3E8A7bf395e5B22002661f3d4356F0e";

  const OriginV1 = await hre.ethers.getContractFactory("OriginV1");
  const origin = await OriginV1.deploy(name, symbol, ownerAddress, tokenUri);

  await origin.deployed();

  console.log(
    `NFT contract deployed to ${origin.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
