// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Blokkat is ERC20, Ownable {
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) Ownable(msg.sender) {}

    // mint token == Generate Token == Issue Token == اصدار عملة == صك عملة
    function mint(address account, uint256 value) public onlyOwner{
        _mint(account, value);
    }

}