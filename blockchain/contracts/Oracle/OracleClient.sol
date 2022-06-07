pragma solidity ^0.8.0;

import "./utils/OracleExtensions.sol";
import "./Oracle.sol";

abstract contract OracleClient {
    using OracleExtensions for OracleExtensions.Request;
    using OracleExtensions for OracleExtensions.Task;

    address private oracle;

    constructor(address _oracle){
        oracle = _oracle;
    }

    modifier onlyOracle() {
        require(msg.sender==oracle, "Only oracle contract call this method");
        _;
    }

    /**
     * @dev Method for create request task for oracle
     */

    function send(OracleExtensions.Request memory _request, address _callbackAddress, bytes4 _callbackSelector) internal {
        OracleExtensions.Task memory task = OracleExtensions.newTask(_request, _callbackAddress, _callbackSelector);
        Oracle(oracle).addToQueue(task);
    }
}
