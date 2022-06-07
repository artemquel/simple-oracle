pragma solidity ^0.8.0;

library OracleExtensions {
    enum RequestMethod{
        GET,
        POST
    }

    struct Request{
        string url;
        string jsonPath;
        string payload;
        RequestMethod method;
    }

    struct Task{
        Request request;
        bytes4 callbackSelector;
        address callbackAddress;
        bool completed;
        uint256 gasUsed;
    }

    function newRequest(string memory _url) public pure returns(Request memory) {
        return Request(_url, "", "", RequestMethod.GET);
    }

    function newTask(Request memory _request, address _callbackAddress, bytes4 _callbackSelector) public pure returns(Task memory){
        return Task(_request, _callbackSelector, _callbackAddress, false, 0);
    }
}
