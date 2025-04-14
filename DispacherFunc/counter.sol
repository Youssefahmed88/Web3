// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter{
    uint256 public number;

    function setNumber(uint256 newNumber) public{
        assembly {
            sstore(number.slot, newNumber)
        }
    }
    function getNumber() public view returns(uint256){
        assembly{
            let value:= sload(number.slot)
            mstore(0, value)
            return(0, 0x20)
        }
    }
}