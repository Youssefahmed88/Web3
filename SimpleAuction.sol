// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.26;

contract SimpleAuction {
    enum Stages {
        AcceptingBids,
        RevealWinner,
        Finished
    }

    address public owner;
    Stages public currentStage;
    uint public creationTime;
    uint public highestBid;
    address public highestBidder;

    error FunctionInvalidAtThisStage();
    error NotEnoughEther();
    error NotOwner();

    constructor() {
        owner = msg.sender;
        currentStage = Stages.AcceptingBids;
        creationTime = block.timestamp;
    }

    modifier atStage(Stages stage_) {
        if (currentStage != stage_)
            revert FunctionInvalidAtThisStage();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner)
            revert NotOwner();
        _;
    }

    modifier timedTransitions() {
        if (currentStage == Stages.AcceptingBids && block.timestamp >= creationTime + 5 days)
            currentStage = Stages.RevealWinner;
        _;
    }

    function bid()
        public
        payable
        timedTransitions
        atStage(Stages.AcceptingBids)
    {
        if (msg.value <= highestBid)
            revert NotEnoughEther();
        
        if (highestBidder != address(0))
            payable(highestBidder).transfer(highestBid);
        
        highestBid = msg.value;
        highestBidder = msg.sender;
    }

    function revealWinner()
        public
        timedTransitions
        atStage(Stages.RevealWinner)
        onlyOwner
    {
        currentStage = Stages.Finished;
    }

    function withdraw()
        public
        onlyOwner
        atStage(Stages.Finished)
    {
        payable(owner).transfer(address(this).balance);
    }
}