pragma solidity 0.8.0;

contract DGlovo {

    uint public lastId;

    struct Order {
      string petition;
      uint creationTime;
      address requester;
      address worker;
      uint timeLimit;
      bool completed;
      uint price;
    }

    mapping(uint => Order) public orders;
    uint[] public orderids;

    // Constructor
    constructor() {
        lastId = 0;
    }

    modifier isRequester(uint orderId) { require(orders[orderId].requester == msg.sender); _; }

    function createOrder(string memory petition) public {
      orders[lastId] = Order({
          petition: petition,
          creationTime: block.timestamp,
          requester: msg.sender,
          worker: address(0),
          timeLimit: 100,
          completed: false,
          price: 10
        });
      orderids.push(lastId);
      lastId += 1;
    }

    function assignOrder(uint orderId) public {
      orders[orderId].worker = msg.sender;
      //TODO: pay some tokens
    }

    function completeOrder(uint orderId) isRequester(orderId) public {
      orders[orderId].completed = true;
      //TODO: return tokens to worker + payout
    }
}
