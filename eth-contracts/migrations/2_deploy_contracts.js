// migrating the appropriate contracts
//var CustomERC721Token = artifacts.require("CustomERC721Token.sol");
var SquareVerifier = artifacts.require("Verifier.sol");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier.sol");
//const Proof = require("../../zokrates/code/square/proof.json");

module.exports = async function (deployer) {
  //await deployer.deploy(CustomERC721Token, "Name", "SYM");
  await deployer.deploy(SquareVerifier);
  SolnSquareVerifierContract = await deployer.deploy(
    SolnSquareVerifier,
    SquareVerifier.address
  );

  //Mint 10 NTFs
  let contractOwner = await SolnSquareVerifierContract.owner();
  for (let id = 20; id < 30; id++) {
    await SolnSquareVerifierContract.mint(contractOwner, id, {
      from: contractOwner,
    });
  }
};
