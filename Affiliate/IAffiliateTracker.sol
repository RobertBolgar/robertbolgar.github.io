// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAffiliateTracker {
    // Registers an affiliate if they're not already registered
    function registerAffiliate(address affiliate, uint256 commissionRate) external;

    // Pays commission to an affiliate for a sale, restricted to allowed contracts
    function payCommission(address affiliate, uint256 salePrice, address nft, uint256 tokenId) external;

    // Allows affiliates to withdraw their earned commissions
    function withdrawEarnings() external;

    // Allows setting commission rates for affiliates, with restrictions
    function setCommissionRate(address affiliate, uint256 newRate) external;

    // Allows the owner to authorize a contract to call payCommission
    function allowContract(address _contract) external;

    // Events for significant actions within the contract
    event AffiliateRegistered(address indexed affiliate, uint256 commissionRate);
    event CommissionPaid(address indexed affiliate, uint256 amount, address nft, uint256 tokenId);
    event EarningsWithdrawn(address indexed affiliate, uint256 amount);
    event AffiliateCommissionRateUpdated(address indexed affiliate, uint256 newRate);
    event ContractAllowed(address contractAddress);
}
