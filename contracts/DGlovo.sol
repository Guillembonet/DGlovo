pragma solidity 0.8.0;

import "./interfaces/IERC20.sol";

contract DGlovo is IERC20{

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

  string public constant name = "DGlovo";
  string public constant symbol = "DGL";
  uint8 public constant decimals = 18;

  uint256 public stakeAmount;

  mapping(address => uint256) balances;

  mapping(address => mapping (address => uint256)) allowed;

  mapping(address => uint256) locked;

  uint256 totalSupply_;

  using SafeMath for uint256;

  mapping(uint => Order) public orders;

  uint[] public orderids;

  // Constructor
  constructor(uint256 total) {
      lastId = 0;
      stakeAmount = 10000000000000000000;
      totalSupply_ = total;
    	balances[msg.sender] = totalSupply_;
  }

  function totalSupply() public view virtual override returns (uint256) {
  	return totalSupply_;
  }

  function balanceOf(address tokenOwner) public view virtual override returns (uint) {
    return balances[tokenOwner] + locked[tokenOwner];
  }

  function transfer(address receiver, uint numTokens) public virtual override returns (bool) {
    require(numTokens <= balances[msg.sender]);
    balances[msg.sender] = balances[msg.sender].sub(numTokens);
    balances[receiver] = balances[receiver].add(numTokens);
    emit Transfer(msg.sender, receiver, numTokens);
    return true;
  }

  function approve(address delegate, uint numTokens) public virtual override returns (bool) {
    allowed[msg.sender][delegate] = numTokens;
    Approval(msg.sender, delegate, numTokens);
    return true;
  }

  function allowance(address owner, address delegate) public virtual override view returns (uint) {
    return allowed[owner][delegate];
  }

  function transferFrom(address owner, address buyer, uint numTokens) public virtual override returns (bool) {
    require(numTokens <= balances[owner]);
    require(numTokens <= allowed[owner][msg.sender]);

    balances[owner] = balances[owner].sub(numTokens);
    allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
    balances[buyer] = balances[buyer].add(numTokens);
    Transfer(owner, buyer, numTokens);
    return true;
  }

  function lockStake() hasEnoughToStake(msg.sender) public returns (bool) {
    require(locked[msg.sender] < stakeAmount);

    uint quantity = stakeAmount - locked[msg.sender];
    locked[msg.sender] = locked[msg.sender].add(quantity);
    balances[msg.sender] = balances[msg.sender].sub(quantity);
    return true;
  }

  function lockedAmountOf(address stakeOwner) public view virtual returns (uint) {
    return locked[stakeOwner];
  }

  function unlockStake() public returns (bool) {
    require(locked[msg.sender] > 0);

    balances[msg.sender] = balances[msg.sender].add(locked[msg.sender]);
    locked[msg.sender] = 0;
    return true;
  }

  function mint(uint256 amount) public returns (bool) {
    totalSupply_ = totalSupply_.add(amount);
    balances[msg.sender] = balances[msg.sender].add(amount);
    return true;
  }

  modifier isRequester(uint orderId) { require(orders[orderId].requester == msg.sender); _; }

  modifier hasEnoughToStake(address stakeOwner) { require(balances[stakeOwner] >= (stakeAmount - locked[stakeOwner])); _; }

  modifier isStaking(address stakeOwner) { require(locked[stakeOwner] >= stakeAmount); _; }

  function createOrder(string memory petition, uint256 timeLimit, uint256 price) public {
    orders[lastId] = Order({
        petition: petition,
        creationTime: block.timestamp,
        requester: msg.sender,
        worker: address(0),
        timeLimit: timeLimit,
        completed: false,
        price: price
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

library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}
