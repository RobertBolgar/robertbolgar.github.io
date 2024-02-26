// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAffiliateTracker {
    // Registers an affiliate if they're not already registered
    function registerAffiliate(address affiliate, uint256 commissionRate) external;

    // Pays commission to an affiliate for a sale
    function payCommission(address affiliate, uint256 salePrice, address nft, uint256 tokenId) external;

    // Allows affiliates to withdraw their earned commissions
    function withdrawCommissions() external;

    // Returns the total commission owed to an affiliate
    function getOwedCommissions(address affiliate) external view returns (uint256);

    // Checks if an address is an approved affiliate
    function isAffiliate(address affiliate) external view returns (bool);

    // Optionally, set commission rates for affiliates
    function setCommissionRate(address affiliate, uint256 newRate) external;

    // Events for significant actions within the contract
    event AffiliateRegistered(address affiliate, uint256 commissionRate);
    event CommissionPaid(address affiliate, uint256 amount);
    event CommissionWithdrawn(address affiliate, uint256 amount);
}
