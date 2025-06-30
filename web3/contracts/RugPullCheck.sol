// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract RugPullCheckConsumer is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // Store the final result
    bool public isRugPull;

    error UnexpectedRequestID(bytes32 requestId);

    event RugPullCheckResponse(
        bytes32 indexed requestId,
        bool rugPull,
        bytes response,
        bytes err
    );

    address router = 0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0;

    // This script calls your API and returns the rugPull boolean
    string source =
        "const apiResponse = await Functions.makeHttpRequest({"
        "  url: 'https://nova-protocol.vercel.app/api/rugPull'"
        "});"
        "if (apiResponse.error) {"
        "  throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeUint256(data.rugPull ? 1 : 0);";

    uint32 gasLimit = 300000;

    bytes32 donID =
        0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;

    constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    function sendRugPullCheckRequest(
        uint64 subscriptionId
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);

        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return s_lastRequestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }

        s_lastResponse = response;
        s_lastError = err;

        uint256 decoded = abi.decode(response, (uint256));
        isRugPull = (decoded == 1);

        emit RugPullCheckResponse(requestId, isRugPull, response, err);
    }
}
