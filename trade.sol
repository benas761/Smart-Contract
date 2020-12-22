pragma solidity ^0.7.0;
contract trade{
    address payable owner;
    address payable buyer;
    address payable courier;
    uint256 itemPrice;
    uint256 courierFee;
    bool delivered = false;
    
    event TradeStarted(address owner, address sender, uint256 price);
    event BuyerPaid(uint256 totalAmount);
    event ItemSent(address courier, uint256 totalAmount, uint256 totalPrice);
    
    function register(address _buyer, uint256 price) public {
        require(msg.sender != _buyer); // the addresses must be different
        owner = msg.sender;
        buyer = payable(_buyer);
        itemPrice = price;
        courierFee = itemPrice / 10;
        emit TradeStarted(owner, buyer, itemPrice);
    }
    
   function payOut() public payable {
        require(delivered); // the item must be delivered
        require(msg.sender == buyer); // the function must be triggered by the buyer
        require(address(this).balance >= itemPrice + courierFee); // there must be enough money to pay for the item
        owner.transfer(itemPrice); // the money for the item go to the owner
        courier.transfer(courierFee); // pay the fee to the courier
        msg.sender.transfer(address(this).balance); // the rest return to the buyer
    }
    
    function pay() public payable{
        require(msg.sender == buyer); // only the buyer pays
        require(!delivered); // buyer cannot pay for something he has already gotten
        emit BuyerPaid(address(this).balance);
    }
    
    function send(address _courier) public {
        require(msg.sender == owner); // only the owner can send out the item
        require(address(this).balance >= itemPrice + courierFee); // the item can only be picked up if the buyer can pay for it
        courier = payable(_courier);
        emit ItemSent(courier, address(this).balance, itemPrice + courierFee);
    }
    
    function deliver() public {
        require(msg.sender == courier); // the courier delivers the item
        require(!delivered);
        delivered = true;
    }
    function getAddresses() public view returns(address, address, address) {
        return(owner, buyer, courier);
    }
}
