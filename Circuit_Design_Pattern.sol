// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.26;

contract Circuit_DesginPattern{
    enum States {deposite, withdraw}
    States state = States.deposite;
    mapping(address => uint256) balances;
    uint creationTime  = block.timestamp;

    function Deposit() public payable{
        require(state==States.deposite && msg.value > 0);
        balances[msg.sender] += msg.value;
    }

    function Withdraw(uint256 amount) public payable{
        if (state == States.deposite && creationTime + block.timestamp > 30 && msg.sender != address(this)){
            state = States.withdraw;
        }
        require(state == States.withdraw && balances[msg.sender] >= amount);
        balances[msg.sender] -= amount;
        address payable recipient = payable(msg.sender);
        recipient.transfer(amount);
    }

    function Balance() public view returns (uint256){
        return balances[msg.sender];
    }

}