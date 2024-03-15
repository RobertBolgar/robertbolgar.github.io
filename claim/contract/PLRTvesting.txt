// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract PLRTVesting is Ownable, ReentrancyGuard {
    // Address of the PLRT token contract
    IERC20 public plrtToken;
    IERC721Enumerable public plrMintPassNFT;
    
    // Struct to store vesting schedule details
    struct VestingSchedule {
        uint256 start;
        uint256 totalAllocation;
        uint256 claimedAmount;
        uint256 lastClaimTime;
    }

    // Vesting parameters
    uint256 public cliffDuration = 30 days;
    uint256 public vestingDuration = 7 days;

    // Vesting schedules for team members and private sale NFT group
    mapping(address => VestingSchedule) public teamVestingSchedules;
    mapping(address => VestingSchedule) public privateSaleNFTVestingSchedules;

    // Arrays to store keys for team members and private sale NFT holders
    address[] public teamMemberKeys;
    address[] public privateSaleNFTKeys;

    // Treasury vesting schedule
    VestingSchedule public treasuryVestingSchedule;

    // Treasury wallet address
    address public treasuryWallet;

    // Allocation limits
    uint256 public constant MAX_TREASURY_ALLOCATION = 10_000_000 * (10 ** 18);
    uint256 public constant MAX_TEAM_ALLOCATION = 15_000_000 * (10 ** 18);
    uint256 public constant MAX_PRIVATE_SALE_ALLOCATION = 5_000_000 * (10 ** 18);

    // Event emitted when tokens are claimed
    event TokensClaimed(address indexed recipient, uint256 amount);

    // Event emitted when vesting starts
    event VestingStarted(uint256 startTime);

    // Constructor to initialize contract with PLRT token address
    constructor(address _plrtToken, address _owner) Ownable(_owner) {
        plrtToken = IERC20(_plrtToken);
    }

    // Function to set the treasury wallet address, accessible only by the owner
    function setTreasuryWallet(address _treasuryWallet) external onlyOwner {
        treasuryWallet = _treasuryWallet;
    }

    // Function to set up vesting schedule for the treasury
    function setTreasuryVestingSchedule(uint256 totalAllocation) external onlyOwner {
        require(totalAllocation > 0, "Total allocation must be greater than zero");
        require(treasuryVestingSchedule.totalAllocation == 0, "Treasury vesting schedule already set");

        // Set up vesting schedule
        treasuryVestingSchedule = VestingSchedule({
            start: 0, // Start time will be set when tokens are received
            totalAllocation: totalAllocation,
            claimedAmount: 0,
            lastClaimTime: 0
        });
    }

    // Function to set up vesting schedule for a team member
    function setTeamMemberVestingSchedule(address teamMember, uint256 totalAllocation) external onlyOwner {
        require(totalAllocation <= MAX_TEAM_ALLOCATION, "Exceeds max team member allocation");

        // Set up vesting schedule
        teamVestingSchedules[teamMember] = VestingSchedule({
            start: 0, // Start time will be set when tokens are received
            totalAllocation: totalAllocation,
            claimedAmount: 0,
            lastClaimTime: 0
        });

        // Update keys array
        if (!isTeamMember(teamMember)) {
            teamMemberKeys.push(teamMember);
        }
    }

    // Function to set up vesting schedule for a private sale NFT holder
    function setPrivateSaleNFTVestingSchedule(address nftHolder, uint256 totalAllocation) external onlyOwner {
        require(totalAllocation <= MAX_PRIVATE_SALE_ALLOCATION, "Exceeds max private sale allocation");

        // Set up vesting schedule
        privateSaleNFTVestingSchedules[nftHolder] = VestingSchedule({
            start: 0, // Start time will be set when tokens are received
            totalAllocation: totalAllocation,
            claimedAmount: 0,
            lastClaimTime: 0
        });

        // Update keys array
        if (!isPrivateSaleNFTHolder(nftHolder)) {
            privateSaleNFTKeys.push(nftHolder);
        }
    }

    // Function to check if an address is a team member
    function isTeamMember(address addr) public view returns (bool) {
        for (uint256 i = 0; i < teamMemberKeys.length; i++) {
            if (teamMemberKeys[i] == addr) {
                return true;
            }
        }
        return false;
    }

    // Function to check if an address is a private sale NFT holder
    function isPrivateSaleNFTHolder(address addr) public view returns (bool) {
        for (uint256 i = 0; i < privateSaleNFTKeys.length; i++) {
            if (privateSaleNFTKeys[i] == addr) {
                return true;
            }
        }
        return false;
    }

    // Function to receive PLRT tokens and start vesting schedules for all recipients
    function receiveTokensAndStartVesting(uint256 totalTokens) external onlyOwner {
        require(totalTokens > 0, "Total tokens must be greater than zero");

        // Transfer PLRT tokens to the contract
        require(plrtToken.transferFrom(msg.sender, address(this), totalTokens), "Failed to receive tokens");

        // Start vesting for treasury
        treasuryVestingSchedule.start = block.timestamp;
        emit VestingStarted(treasuryVestingSchedule.start);

        // Start vesting for team members
        for (uint256 i = 0; i < teamMemberKeys.length; i++) {
            teamVestingSchedules[teamMemberKeys[i]].start = block.timestamp;
            emit VestingStarted(teamVestingSchedules[teamMemberKeys[i]].start);
        }

        // Start vesting for private sale NFT holders
        for (uint256 j = 0; j < privateSaleNFTKeys.length; j++) {
            privateSaleNFTVestingSchedules[privateSaleNFTKeys[j]].start = block.timestamp;
            emit VestingStarted(privateSaleNFTVestingSchedules[privateSaleNFTKeys[j]].start);
        }
    }

    // Function to get total allocation, claimed amount, and remaining claimable amount for a team member
    function getTeamMemberVestingDetails(address teamMember) external view returns (uint256, uint256, uint256) {
        VestingSchedule memory schedule = teamVestingSchedules[teamMember];
        return (schedule.totalAllocation, schedule.claimedAmount, calculateRemainingClaimableAmount(schedule));
    }

    // Function to get total allocation, claimed amount, and remaining claimable amount for a private sale NFT holder
    function getPrivateSaleNFTVestingDetails(address nftHolder) external view returns (uint256, uint256, uint256) {
        VestingSchedule memory schedule = privateSaleNFTVestingSchedules[nftHolder];
        return (schedule.totalAllocation, schedule.claimedAmount, calculateRemainingClaimableAmount(schedule));
    }

    // Function to get total allocation, claimed amount, and remaining claimable amount for the treasury
    function getTreasuryVestingDetails() external view returns (uint256, uint256, uint256) {
        return (treasuryVestingSchedule.totalAllocation, treasuryVestingSchedule.claimedAmount, calculateRemainingClaimableAmount(treasuryVestingSchedule));
    }

    // Function to calculate remaining claimable amount for a vesting schedule
    function calculateRemainingClaimableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.start + cliffDuration) {
            return 0;
        }

        uint256 elapsedTime = block.timestamp - (schedule.start + cliffDuration);
        uint256 elapsedWeeks = elapsedTime / vestingDuration;
        uint256 claimableAmount = (schedule.totalAllocation / 10) * elapsedWeeks;

        // Ensure claimable amount does not exceed total allocation
        if (claimableAmount > schedule.totalAllocation) {
            claimableAmount = schedule.totalAllocation;
        }

        uint256 remainingBalance = schedule.totalAllocation - schedule.claimedAmount;
        if (claimableAmount > remainingBalance) {
            claimableAmount = remainingBalance;
        }

        return claimableAmount;
    }
}
