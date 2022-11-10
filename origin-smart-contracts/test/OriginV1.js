const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { expect } = require("chai");
  require("@nomiclabs/hardhat-ethers");
  
  describe("origin", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployOneYearLockFixture() {
      const [owner, otherAccount] = await ethers.getSigners();
  
      const name = "Origin";
      const symbol = "O_O";
      const tokenUri = "ipfs://QmekQNwrUp6AScN1x9JWz4yriBrXujRefVmMZwca9hb443"
  
      const OriginV1 = await ethers.getContractFactory("OriginV1");
      const origin = await OriginV1.deploy(name, symbol, owner.address, tokenUri);
  
      return { origin, owner, otherAccount, name, symbol, tokenUri };
    }
  
    describe("Deployment", function () {
      it("Should set the right name and symbol", async function () {
        const { origin, name, symbol } = await loadFixture(deployOneYearLockFixture);
  
        expect(await origin.name()).to.equal(name);
        expect(await origin.symbol()).to.equal(symbol);
      });
    });

    describe("Regular ERC721 functions", function () {
      it("Should mint a token", async function () {
        const { origin, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await origin.mintTo(otherAccount.address);
  
        expect(await origin.ownerOf(1)).to.equal(otherAccount.address);
        expect(await origin.balanceOf(otherAccount.address)).to.equal(1);
      });
      it("Should be unable to mint a token", async function () {
        const { origin, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await expect(
            origin.connect(otherAccount).mintTo(otherAccount.address)
        ).to.be.revertedWith("Only owner can mint");
      });
      it("Should fail to transfer token", async function () {
        const { origin, otherAccount, owner } = await loadFixture(deployOneYearLockFixture);
        await origin.mintTo(otherAccount.address);
        await expect(
            origin.connect(otherAccount).transferFrom(otherAccount.address, owner.address, 1)
        ).to.be.revertedWith("Non-transferable token");
      });
      it("Should mint and burn a token by owner", async function () {
        const { origin, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await origin.mintTo(otherAccount.address);
        await origin.burn(1);
  
        await expect(
            origin.ownerOf(1)
        ).to.be.revertedWith("ERC721: invalid token ID");
        
      });
      it("Should mint and burn a token by token owner", async function () {
        const { origin, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await origin.mintTo(otherAccount.address);
        await origin.connect(otherAccount).burn(1);
  
        await expect(
            origin.ownerOf(1)
        ).to.be.revertedWith("ERC721: invalid token ID");
      });
      it("Should mint and fail to burn token", async function () {
        const { origin, otherAccount, owner } = await loadFixture(deployOneYearLockFixture);
        await origin.mintTo(owner.address);

        await expect(
            origin.connect(otherAccount).burn(1)
        ).to.be.revertedWith("ERC721: caller is not token owner or contract owner");
      });
      it("Should get the token URI", async function () {
        const { origin, tokenUri } = await loadFixture(deployOneYearLockFixture);
  
        expect(await origin.tokenURI(1)).to.equal(tokenUri);
      });
      it("Should be able to change baseUri", async function () {
        const { origin, tokenUri } = await loadFixture(deployOneYearLockFixture);
        await origin.changeBaseUri("xyz");
  
        expect(await origin.tokenURI(1)).to.equal("xyz");
      });
      it("Should be unable to change baseUri", async function () {
        const { origin, tokenUri, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await expect(
          origin.connect(otherAccount).changeBaseUri("xzy")
      ).to.be.revertedWith("Only owner can change base URI");
      });
      it("Should self destruct", async function () {
        const { origin, tokenUri, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await origin.burnAll();
      });
      it("Should self destruct", async function () {
        const { origin, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await expect(
          origin.connect(otherAccount).burnAll()
      ).to.be.revertedWith("Only owner can burn contract");
      });
    });
  });
  