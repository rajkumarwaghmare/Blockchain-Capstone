var ERC721MintableComplete = artifacts.require("CustomERC721Token");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new("Name", "SYM", {
        from: account_one,
      });

      await this.contract.mint(account_two, 1);
      await this.contract.mint(account_two, 2);
      await this.contract.mint(account_two, 3);
      await this.contract.mint(account_three, 4);
      await this.contract.mint(account_three, 5);
    });

    it("should return total supply", async function () {
      let totalSupply = await this.contract.totalSupply.call();
      // ASSERT
      assert.equal(
        totalSupply.toNumber(),
        5,
        "Total supply count doesnt match"
      );
    });

    it("should get token balance", async function () {
      let accountTwoBalance = await this.contract.balanceOf.call(account_two);
      let accountThreeBalance = await this.contract.balanceOf.call(
        account_three
      );

      assert.equal(
        accountTwoBalance,
        3,
        "Does not match balance of account_two"
      );
      assert.equal(
        accountThreeBalance,
        2,
        "Does not match balance of account_three"
      );
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let testTokenId = 5;
      let baseURI =
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
      let tokenURI = await this.contract.tokenURI.call(testTokenId);
      assert.equal(
        tokenURI,
        baseURI + testTokenId,
        "Does not match with the given tokenURI"
      );
    });

    it("should transfer token from one owner to another", async function () {
      let testTokenId = 1; //account_two is owner of this tokenId
      await this.contract.transferFrom(
        account_two,
        account_three,
        testTokenId,
        {
          from: account_two,
        }
      );
      let newOwner = await this.contract.ownerOf(testTokenId);
      assert.equal(
        newOwner,
        account_three,
        "Error in transferring token from account two to three."
      );
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new("Name", "SYM", {
        from: account_one,
      });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let mintingFailed = false;
      try {
        await this.contract.mint(account_two, 1, { from: account_two });
      } catch (e) {
        mintingFailed = true;
      }
      assert.equal(
        mintingFailed,
        true,
        "account_two which is not contract owner, should not be able to mint"
      );
    });

    it("should return contract owner", async function () {
      let contractOwner = await this.contract.owner.call();
      assert.equal(
        contractOwner,
        account_one,
        "account_one is the contract owner!"
      );
    });
  });
});
