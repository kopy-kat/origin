// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract OriginV1 is ERC721 {
    uint256 private _currentTokenId = 0;
    address private owner;
    string private baseUri;

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        string memory _baseUri
    ) ERC721(_name, _symbol) {
        owner = _owner;
        baseUri = _baseUri;
    }

    /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     */
    function mintTo(address _to) public {
        require(msg.sender == owner, "Only owner can mint");
        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        _incrementTokenId();
    }

    function isOwnerOrTokenOwner(uint256 tokenId) public view returns (bool) {
        return msg.sender == owner || msg.sender == ownerOf(tokenId);
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Non-transferable token");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Non-transferable token");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        revert("Non-transferable token");
    }

    /**
     * @dev Burns a specific token
     * @param tokenId integer ID of the token being burned
     */
    function burn(uint256 tokenId) public virtual {
        require(
            isOwnerOrTokenOwner(tokenId),
            "ERC721: caller is not token owner or contract owner"
        );
        _burn(tokenId);
    }

    function burnAll() public {
        require(msg.sender == owner, "Only owner can burn contract");
        address payable payableOwner = payable(owner);
        selfdestruct(payableOwner);
    }

    /**
     * @dev calculates the next token ID based on value of _currentTokenId
     * @return uint256 for the next token ID
     */
    function _getNextTokenId() private view returns (uint256) {
        return _currentTokenId + 1;
    }

    /**
     * @dev increments the value of _currentTokenId
     */
    function _incrementTokenId() private {
        _currentTokenId++;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        string memory baseURI = _baseURI();
        return baseURI;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function changeBaseUri(string memory _baseUri) public {
        require(msg.sender == owner, "Only owner can change base URI");
        baseUri = _baseUri;
    }
}
