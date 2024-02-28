// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAffiliateTracker {
    /**
     * @dev Registers a new affiliate. Only callable by the contract owner or designated admin.
     * @param affiliate The address of the affiliate to register.
     * @param commissionRate The commission rate for the affiliate in percentage points.
     */
    function registerAffiliate(address affiliate, uint256 commissionRate) external;

    /**
     * @dev Pays commission to an affiliate for a sale. This function can be called by allowed contracts only.
     * @param affiliate The address of the affiliate to pay.
     * @param salePrice The total sale price from which the commission is calculated.
     * @param nft The address of the NFT involved in the transaction.
     * @param tokenId The ID of the NFT token involved in the sale.
     */
    function payCommission(address affiliate, uint256 salePrice, address nft, uint256 tokenId) external;

    /**
     * @dev Sets or updates the commission rate for an affiliate. Only callable by the contract owner or designated admin.
     * @param affiliate The address of the affiliate whose commission rate is to be set or updated.
     * @param newRate The new commission rate for the affiliate in percentage points.
     */
    function setCommissionRate(address affiliate, uint256 newRate) external;

    /**
     * @dev Allows a contract to call the `payCommission` function. Only callable by the contract owner or designated admin.
     * @param _contract The address of the contract to allow.
     */
    function allowContract(address _contract) external;

    /**
     * @dev Returns the total amount of commissions earned by a specific affiliate.
     * @param affiliate The address of the affiliate.
     * @return The total amount of commissions earned by the affiliate.
     */
    function getAffiliateEarnings(address affiliate) external view returns (uint256);

    // Events

    /**
     * @dev Emitted when a new affiliate is registered.
     * @param affiliate The address of the registered affiliate.
     * @param commissionRate The commission rate of the affiliate in percentage points.
     */
    event AffiliateRegistered(address indexed affiliate, uint256 commissionRate);

    /**
     * @dev Emitted when a commission is paid to an affiliate.
     * @param affiliate The address of the affiliate receiving the commission.
     * @param amount The amount of commission paid.
     * @param nft The address of the NFT involved in the transaction.
     * @param tokenId The ID of the NFT token involved in the sale.
     */
    event CommissionPaid(address indexed affiliate, uint256 amount, address nft, uint256 tokenId);

    /**
     * @dev Emitted when an affiliate's commission rate is updated.
     * @param affiliate The address of the affiliate whose commission rate was updated.
     * @param newRate The new commission rate for the affiliate in percentage points.
     */
    event AffiliateCommissionRateUpdated(address indexed affiliate, uint256 newRate);

    /**
     * @dev Emitted when a contract is allowed to call `payCommission`.
     * @param contractAddress The address of the contract that was allowed.
     */
    event ContractAllowed(address contractAddress);

    /**
     * @dev Toggles the ability to allow or disallow direct payments.
     */
    function toggleDirectPayment() external;
}
