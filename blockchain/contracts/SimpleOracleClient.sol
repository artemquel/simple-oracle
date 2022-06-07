pragma solidity ^0.8.0;

import "./Oracle/utils/OracleExtensions.sol";
import "./Oracle/OracleClient.sol";

contract SimpleOracleClient is OracleClient{
    using OracleExtensions for OracleExtensions.Request;

    constructor (address _oracle) OracleClient(_oracle) {}

    string private fulfillResult;

    function testRequest() public {
        OracleExtensions.Request memory request = OracleExtensions.newRequest("https://my-json-server.typicode.com/typicode/demo/profile");
        request.jsonPath = "$.name";

        send(request, address(this), this.setFulfillResult.selector);
    }

    function setFulfillResult(string memory _result) external onlyOracle {
        fulfillResult = _result;
    }

    function getFulfillResult() public view returns(string memory){
        return fulfillResult;
    }
}
