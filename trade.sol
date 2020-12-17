pragma solidity ^0.7.0;
contract trade{
    address owner;
    address buyer;
    address courier;
    uint256 itemPrice;
    bool sent = false;
    bool delivered = false;
    
    constructor(address _buyer, uint256 price){
        require(msg.sender != _buyer); // the addresses must be different
        owner = msg.sender;
        buyer = _buyer;
        itemPrice = price * 1000000000000000000; // in ether
    }
    
   function payOut(address payable _owner) public payable {
        require(delivered); // the item must be delivered
        require(_owner == owner); // the sent address must be owner's
        require(msg.sender == buyer); // the function must be triggered by the buyer
        require(address(this).balance >= itemPrice); // there must be enough money to pay for the item
        _owner.transfer(itemPrice); // the money for the item go to the owner
        msg.sender.transfer(address(this).balance); // the rest return to the buyer
    }
    
    function pay() public payable{
        require(msg.sender == buyer); // only the buyer pays
    }
    
    function send(address _courier) public {
        require(address(this).balance >= itemPrice); // the item can only be picked up if the buyer can pay for it
        courier = _courier;
        sent = true;
    }
    
    function deliver() public {
        require(msg.sender == courier); // the courier delivers the item
        delivered = true;
    }
}
