// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAffiliateTracker {
    // Registers an affiliate if they're not already registered
    function registerAffiliate(address affiliate, uint256 commissionRate) external;

    // Pays commission to an affiliate for a sale, restricted to allowed contracts
    function payCommission(address affiliate, uint256 salePrice, address nft, uint256 tokenId) external;

    // Allows setting commission rates for affiliates, with restrictions
    function setCommissionRate(address affiliate, uint256 newRate) external;

    // Allows the owner to authorize a contract to call payCommission
    function allowContract(address _contract) external;

    // Returns the amount of commissions earned by a specific affiliate
    function getAffiliateEarnings(address affiliate) external view returns (uint256);

    // Returns the earnings of a specific affiliate
    function affiliateEarnings(address affiliate) external view returns (uint256);

    // Events for significant actions within the contract
    event AffiliateRegistered(address indexed affiliate, uint256 commissionRate);
    event CommissionPaid(address indexed affiliate, uint256 amount, address nft, uint256 tokenId);
    event AffiliateCommissionRateUpdated(address indexed affiliate, uint256 newRate);
    event ContractAllowed(address contractAddress);
}
