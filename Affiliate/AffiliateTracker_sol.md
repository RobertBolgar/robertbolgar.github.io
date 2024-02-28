// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AffiliateTracker is Ownable, ReentrancyGuard {
    struct Affiliate {
        bool isRegistered;
        uint256 commissionRate; // Commission rate in percentage points
    }

    bool public directPaymentEnabled = true; // Controls direct payment feature

    mapping(address => Affiliate) public affiliates;
    mapping(address => uint256) public affiliateEarnings; // Tracks earnings of each affiliate
    mapping(address => bool) public canSetCommissionRate;
    mapping(address => bool) private allowedContracts; // Tracks contracts allowed to call payCommission

    event AffiliateRegistered(address indexed affiliate, uint256 commissionRate);
    event CommissionPaid(address indexed affiliate, uint256 amount, address nft, uint256 tokenId);
    event EarningsWithdrawn(address indexed affiliate, uint256 amount);
    event AffiliateCommissionRateUpdated(address indexed affiliate, uint256 newRate);
    event ContractAllowed(address contractAddress);
    event DirectPaymentToggled(bool isEnabled);

    modifier onlyAllowedContracts() {
        require(allowedContracts[msg.sender], "Caller is not an allowed contract");
        _;
    }

constructor() Ownable(msg.sender) {}

    function registerAffiliate(address _affiliate, uint256 _commissionRate) external onlyOwner {
        require(!affiliates[_affiliate].isRegistered, "Affiliate already registered");
        require(_commissionRate >= 1 && _commissionRate <= 100, "Invalid commission rate");
        affiliates[_affiliate] = Affiliate(true, _commissionRate);
        emit AffiliateRegistered(_affiliate, _commissionRate);
    }

    function payCommission(address _affiliate, uint256 _salePrice, address _nft, uint256 _tokenId) external onlyAllowedContracts {
        require(affiliates[_affiliate].isRegistered, "Affiliate not registered");
        uint256 commission = calculateCommission(_salePrice, affiliates[_affiliate].commissionRate);
        affiliateEarnings[_affiliate] += commission;
        emit CommissionPaid(_affiliate, commission, _nft, _tokenId);
    }

    function calculateCommission(uint256 _salePrice, uint256 _rate) public pure returns (uint256) {
        return (_salePrice * _rate) / 100;
    }

    function withdrawEarnings() external nonReentrant {
        require(directPaymentEnabled, "Direct payment is currently disabled.");
        uint256 earnings = affiliateEarnings[msg.sender];
        require(earnings > 0, "No earnings to withdraw");
        affiliateEarnings[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: earnings}("");
        require(success, "Failed to send Ether");
        emit EarningsWithdrawn(msg.sender, earnings);
    }

    function allowSettingCommissionRate(address minter, bool allowed) external onlyOwner {
        canSetCommissionRate[minter] = allowed;
    }

    function setCommissionRate(address affiliate, uint256 newRate) external {
        require(canSetCommissionRate[msg.sender] || msg.sender == owner(), "Not authorized");
        require(affiliates[affiliate].isRegistered, "Affiliate not registered");
        require(newRate >= 1 && newRate <= 100, "Invalid commission rate");
        affiliates[affiliate].commissionRate = newRate;
        emit AffiliateCommissionRateUpdated(affiliate, newRate);
    }

    function allowContract(address _contract) external onlyOwner {
        allowedContracts[_contract] = true;
        emit ContractAllowed(_contract);
    }

    function toggleDirectPayment() external onlyOwner {
        directPaymentEnabled = !directPaymentEnabled;
        emit DirectPaymentToggled(directPaymentEnabled);
    }

    function getAffiliateEarnings(address affiliate) external view returns (uint256) {
        return affiliateEarnings[affiliate];
    }

    receive() external payable {
        // Logic for receiving Ether, if necessary
    }
}
