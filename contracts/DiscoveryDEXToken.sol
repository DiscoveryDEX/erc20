pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// SPDX-License-Identifier: UNLICENSED

contract DiscoveryDEXToken is ERC20, Ownable {

    constructor(uint crowdsaleReservesAmount) ERC20("DiscoveryDEX", "DISCD") {
        _mint(msg.sender, crowdsaleReservesAmount);
    }
    
    function claimTick(uint amount, bytes memory sig) public {
        // compute hash
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 hash = keccak256(abi.encodePacked(amount, msg.sender));
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, hash));
    
        // compute r, s, v from signature bytes
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := and(mload(add(sig, 65)), 255)
        }
        if (v < 27) v += 27;
        require(v >= 27 || v <= 30, "invalid v in sig");
        
        address signer = ecrecover(prefixedHashMessage, v, r, s);
        require(signer == owner(), "invalid claim signature");
        
        _mint(msg.sender, amount);
    }
     
}
