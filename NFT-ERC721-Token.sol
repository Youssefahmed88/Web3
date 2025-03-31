//SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract BlokkatNFT is ERC721URIStorage{
    uint256 private _tokenidCntr;
    address owner;
    event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI);
    constructor() ERC721("Obsidian Stone", "OBST"){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    function mintNFT(string memory _jsonURI) public onlyOwner returns (uint256){
        _mint(msg.sender, _tokenidCntr);
        _setTokenURI(_tokenidCntr, _jsonURI);
        _tokenidCntr++;
        emit NFTMinted(msg.sender, _tokenidCntr-1, _jsonURI);
        return (_tokenidCntr - 1);
    }

    function totalMinted() public view returns(uint256){
        return _tokenidCntr;
    }

}