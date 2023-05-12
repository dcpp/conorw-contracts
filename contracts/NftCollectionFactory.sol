// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

import {BeaconProxy, IBeacon} from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import {INftCollection} from "./NftCollection.sol";

contract NftCollectionFactory {
    IBeacon public beacon;

    mapping(address => bool) public wasCreated;

    event CollectionCreated(address collection, string name, string symbol);
    event TokenMinted(
        address collection,
        address recipient,
        uint256 tokenId,
        string tokenUri
    );

    constructor(address _beacon) {
        beacon = IBeacon(_beacon);
    }

    /**
     * @dev Creates a new collection as a proxy for beacon contract
     * @param name Colelction name
     * @param symbol Collection symbol
     * @return collection address
     */
    function createCollection(string calldata name, string calldata symbol)
        external
        returns (address collection)
    {
        bytes memory data = abi.encodeWithSelector(
            INftCollection.initialize.selector,
            name,
            symbol
        );

        bytes32 salt = keccak256(
            abi.encodePacked(tx.origin, block.number, data)
        );

        collection = address(
            new BeaconProxy{salt: salt}(address(beacon), data)
        );
        wasCreated[collection] = true;

        emit CollectionCreated(collection, name, symbol);
    }

    /**
     * @dev Mints a new token id of the collection for uri specified
     * @param collection The collection address created by this factory
     * @param recipient The address mint to
     * @param tokenUri Uri string for a new token
     * @return tokenId of minted token
     */
    function mintToken(
        address collection,
        address recipient,
        string calldata tokenUri
    ) external returns (uint256 tokenId) {
        require(wasCreated[collection], "!bad collection");
        tokenId = INftCollection(collection).mint(recipient, tokenUri);
        emit TokenMinted(collection, recipient, tokenId, tokenUri);
    }
}
