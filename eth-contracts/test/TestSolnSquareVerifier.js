var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var SquareVerifier = artifacts.require("Verifier");

contract("SolnSquareVerifier", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  // - use the contents from proof.json generated from zokrates steps
  const proof = require("../../zokrates/code/square/proof.json");

  beforeEach(async function () {
    this.verifier = await SquareVerifier.new({ from: account_one });
    this.contract = await SolnSquareVerifier.new(this.verifier.address, {
      from: account_one,
    });
  });

  // Test if a new solution can be added for contract - SolnSquareVerifier
  it("Test if a new solution can be added for contract - SolnSquareVerifier", async function () {
    let key = await this.contract.generateKey.call(
      proof.proof.a,
      proof.proof.b,
      proof.proof.c,
      proof.inputs
    );
    let result = await this.contract.addSolution(1, account_two, key);
    assert.equal(
      result.logs[0].event,
      "SolutionAdded",
      "SolutionAdded event wasnt emmited!"
    );
  });

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it("Test if an ERC721 token can be minted for contract - SolnSquareVerifier", async function () {
    await this.contract.mintToken(account_two, 2, proof.proof, proof.inputs, {
      from: account_one,
    });
    let supplyCount = (await this.contract.totalSupply.call()).toNumber();
    assert.equal(supplyCount, 1, "Token cannot be minted");
  });
});
