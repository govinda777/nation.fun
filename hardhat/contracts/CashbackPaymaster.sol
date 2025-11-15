// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {PackedUserOperation} from "@account-abstraction/contracts/interfaces/PackedUserOperation.sol";
import {BasePaymaster} from "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CashbackPaymaster is BasePaymaster {
    IERC20 public govindasCoin;

    constructor(address _govindasCoinAddress, IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {
        govindasCoin = IERC20(_govindasCoinAddress);
    }

    function _validatePaymasterUserOp(PackedUserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
        internal
        view
        override
        returns (bytes memory context, uint256 validationData)
    {
        // Pass the user's address to postOp via the context.
        return (abi.encode(userOp.sender), 0);
    }

    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost, uint256 actualUserOpFeePerGas) internal override {
        // Decode the user's address from the context.
        address userAddress = abi.decode(context, (address));

        // Simple cashback logic: send 1 GVC for every transaction.
        // Note: The paymaster must own enough GVC to distribute.
        govindasCoin.transfer(userAddress, 1 * 10**18);
    }

    // Function to fund the paymaster with GVC tokens
    function depositGVC(uint256 amount) public {
        govindasCoin.transferFrom(msg.sender, address(this), amount);
    }

    // Helper to allow the owner to withdraw ETH sent directly to this contract.
    function withdrawEth(address payable to, uint256 amount) public payable onlyOwner {
        to.transfer(amount);
    }

    receive() external payable {}
}
