pragma solidity ^0.8.0;

import "./utils/OracleExtensions.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Oracle{
    using OracleExtensions for OracleExtensions.Task;

    using Counters for Counters.Counter;

    Counters.Counter private taskIds;

    address private owner;

    /**
     * @dev Task ID => Task
     */
    mapping(uint256=>OracleExtensions.Task) private tasks;

    /**
     * @dev Task ID => OracleClient contract address
     */
    mapping(uint256=>address) private taskCreators;

    /**
     * @dev Address => Boolean address allowance to fulfill tasks
     */
    mapping(address=>bool) private fulfillAllowed;

    event TaskQueued(uint256 taskId);
    event TaskCompleted(uint256 taskId);
    event TransferOwnership(address indexed from, address indexed to);

    constructor() {
        owner = msg.sender;
        fulfillAllowed[owner] = true;
    }

    modifier onlyOwner() {
        require(msg.sender==owner, "Only owner can call this method");
        _;
    }

    modifier onlyFulfillAllowed() {
        require(fulfillAllowed[msg.sender]==true, "This address cannot call this method");
        _;
    }

    function transferOwnership(address _owner) public onlyOwner {
        require(_owner!=address(0), "Cannot set zero address as owner");
        emit TransferOwnership(owner, _owner);
        owner = _owner;
    }

    function setFulfillAllowance(address _address, bool _allowance) public onlyOwner {
        fulfillAllowed[_address] = _allowance;
    }

    function addToQueue(OracleExtensions.Task memory _task) external returns(uint256){
        taskIds.increment();
        uint256 taskId = taskIds.current();
        tasks[taskId] = _task;

        emit TaskQueued(taskId);

        return taskId;
    }

    function getTask(uint256 _taskId) public view onlyFulfillAllowed returns (OracleExtensions.Task memory){
        return tasks[_taskId];
    }

    function fulfill(uint256 _taskId, string memory _result) public onlyFulfillAllowed {
        (bool success,) = address(tasks[_taskId].callbackAddress).call(abi.encodeWithSelector(tasks[_taskId].callbackSelector, _result));
        require(success==true, "Fulfillment error");

        tasks[_taskId].completed = true;

        emit TaskCompleted(_taskId);
    }
}