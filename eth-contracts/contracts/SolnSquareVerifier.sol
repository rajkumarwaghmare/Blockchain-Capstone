pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";


//define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    //define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    Verifier private squareVerifier;

    constructor (address verifierAddress) CustomERC721Token("PTOK", "SYM") public {
        squareVerifier = Verifier(verifierAddress);
    }

    //define a solutions struct that can hold an index & an address
    struct Solution{
        uint256 index;
        address to;
    }

    //define an array of the above struct
    Solution[] solutions;

    //define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutionsMapping;

    //Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address to, bytes32 key);

    //Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 index, address to, bytes32 key) public {
        Solution memory solution = Solution(index, to);
        solutions.push(solution);
        solutionsMapping[key] = solution;
        emit SolutionAdded(index, to, key );
    }

    //Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address to, uint256 tokenId,
        Verifier.Proof memory proof, uint[1] memory inputs)
    public
    {
        bytes32 soluitonKey = generateKey([proof.a.X, proof.a.Y], [proof.b.X, proof.b.Y], [proof.c.X, proof.c.Y], inputs);
        require(solutionsMapping[soluitonKey].to == address(0));//make sure the solution is unique (has not been used before)
        require(squareVerifier.verifyTx(proof,inputs));
        addSolution(tokenId, to, soluitonKey);
        mint(to, tokenId);
    }

    //Generate an unique key per solution
    function generateKey(uint[2] memory a,
        uint[2][2] memory b, uint[2] memory c,
        uint[1] memory inputs) pure public returns(bytes32) {
        return keccak256(abi.encodePacked(a, b, c, inputs));
    }

}






  


























