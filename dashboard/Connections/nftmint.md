Here's a summary of some of the key functions and events available in the NFTMint contract.

### Functions:
1. `allowContract(address _contract)`: Allows a contract to interact with the NFTMint contract.
2. `listNFTForSale(string uri, uint256 price)`: Lists an NFT for sale with the given URI and price.
3. `buyNFT(uint256 tokenId, address affiliate, address paymentToken)`: Allows purchasing an NFT with the specified token ID, affiliate, and payment token.
4. `registerAffiliate(address newAffiliateAddress, uint256 newCommissionRate)`: Registers a new affiliate with a commission rate.
5. `revokeAffiliate(address affiliate)`: Revokes affiliate status for the specified address.
6. `safeTransferFrom(address from, address to, uint256 tokenId)`: Safely transfers the ownership of a token from one address to another.
7. `setAffiliateCommissionRate(address affiliate, uint256 newRate)`: Sets a new commission rate for a specific affiliate.
8. `setDefaultCommissionRate(uint256 newRate)`: Sets the default commission rate for affiliates.
9. `setDefaultAffiliate(address affiliate)`: Sets the default affiliate.
10. `toggleDirectPaymentGlobal()`: Toggles global direct payment settings.
11. `toggleDirectPaymentUser(address affiliate)`: Toggles direct payment for a specific user.
12. `transferOwnership(address newOwner)`: Transfers ownership of the contract to a new address.

### Events:
1. `NFTListed(uint256 tokenId, string uri, uint256 price)`: Triggered when an NFT is listed for sale.
2. `NFTMinted(uint256 tokenId, address creator, string tokenURI)`: Triggered when a new NFT is minted.
3. `TokenSold(uint256 tokenId, address buyer, uint256 salePrice)`: Triggered when an NFT is sold.
4. `Transfer(address from, address to, uint256 tokenId)`: Triggered when ownership of an NFT is transferred.

These functions and events facilitate the listing, selling, and management of NFTs within the NFTMint contract.
