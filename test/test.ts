import { expect } from "chai";
import { ethers } from "hardhat";
import {
  NftCollection,
  NftCollectionFactory,
  UpgradeableBeacon,
} from "../typechain";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("NftCollectionFactory", function () {
  this.timeout(0);

  let nftCollectionFactory: NftCollectionFactory;
  let nftCollection: NftCollection;

  let admin: SignerWithAddress;
  let user0: SignerWithAddress;
  let user0Address: string;

  before(async function () {
    [admin, user0] = await ethers.getSigners();
    user0Address = await user0.getAddress();

    const nftCollectionF = await ethers.getContractFactory("NftCollection");
    nftCollection = (await nftCollectionF.deploy()) as NftCollection;

    const beaconF = await ethers.getContractFactory("NftCollectionBeacon");
    const beacon = (await beaconF.deploy(
      nftCollection.address
    )) as UpgradeableBeacon;

    const nftCollectionFactoryF = await ethers.getContractFactory(
      "NftCollectionFactory"
    );
    nftCollectionFactory = (await nftCollectionFactoryF.deploy(
      beacon.address
    )) as NftCollectionFactory;

    const tx = await nftCollectionFactory.createCollection(
      "TEST NAME",
      "TSTSYM"
    );

    const rc = await tx.wait();
    const event = rc?.events?.find(
      (event) => event.event === "CollectionCreated"
    );
    const result = event?.args;

    nftCollection = (await ethers.getContractAt(
      "NftCollection",
      result?.collection
    )) as NftCollection;
  });

  it("initial check", async function () {
    expect(await nftCollection.name()).to.be.eq("TEST NAME");
    expect(await nftCollection.symbol()).to.be.eq("TSTSYM");

    await expect(
      nftCollection.mint(user0Address, "https://example.io/1.json")
    ).to.be.revertedWith("!factory only");

    await expect(
      nftCollectionFactory.mintToken(
        ethers.constants.AddressZero,
        user0Address,
        "https://example.io/1.json"
      )
    ).to.be.revertedWith("!bad collection");
  });

  it("should mint a new token", async function () {
    const tx = await nftCollectionFactory.mintToken(
      nftCollection.address,
      user0Address,
      "https://example.io/1.json"
    );

    const rc = await tx.wait();
    const event = rc?.events?.find((event) => event.event === "TokenMinted");
    const result = event?.args;
    const tokenId = result?.tokenId;

    expect(tokenId).to.be.eq(1);
    expect(await nftCollection.tokenURI(tokenId)).to.be.eq(
      "https://example.io/1.json"
    );
    expect(await nftCollection.ownerOf(tokenId)).to.be.eq(user0Address);
  });
});
