// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NationPass is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("Nation Pass", "PASS") Ownable(msg.sender) {}

    function publicMint(address to) external {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}
