// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {CountersUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

interface INftCollection {
    function initialize(string calldata name_, string calldata symbol_)
        external;

    function mint(address to, string calldata tokenUri)
        external
        returns (uint256 tokenId);
}

contract NftCollection is INftCollection, ERC721Upgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    address private factory;
    CountersUpgradeable.Counter private _tokenIdTracker;

    mapping(uint256 => string) private _tokenURI;

    function initialize(string calldata name_, string calldata symbol_)
        external
        override
        initializer
    {
        ERC721Upgradeable.__ERC721_init_unchained(name_, symbol_);
        factory = msg.sender;
        _tokenIdTracker.increment(); // id starts from 1
    }

    /**
     * @dev Mints a new token id for uri specified
     * Only factory can call this method
     * @param to The address mint to
     * @param tokenUri Uri string for a new token
     * @return tokenId of minted token
     */
    function mint(address to, string calldata tokenUri)
        external
        returns (uint256 tokenId)
    {
        require(msg.sender == factory, "!factory only");
        require(to != address(0) && bytes(tokenUri).length > 0, "!input");
        tokenId = _tokenIdTracker.current();
        _mint(to, tokenId);
        _tokenURI[tokenId] = tokenUri;
        _tokenIdTracker.increment();
    }

    /**
     * @dev Gets token uri string by token id
     * @param tokenId Token id
     * @return Uri string
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return _tokenURI[tokenId];
    }
}
