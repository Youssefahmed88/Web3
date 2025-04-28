// SPDX-License-Identifier: MIT

pragma solidity 0.8.26;

contract SimpleProxy {
    address public implementation;

    constructor(address _implementation) {
        implementation = _implementation;
    }

    // Payable fallback function
    fallback() external payable {
        (bool success, bytes memory result) = implementation.delegatecall(msg.data);
        require(success);
        assembly {
            return(add(result, 32), mload(result))
        }
    }

    // Adding a receive function to handle direct Ether transfers
    receive() external payable {}

    // Function to upgrade the implementation
    function UpgradeTo(address _newImplementation) public {
        implementation = _newImplementation;
    }
}
