// adminFunctions.js
import { ethers } from 'ethers'; // Make sure to import ethers if it's not globally available

export async function approveUser(nftContract, userAddress) {
    // Function implementation
}

export async function revokeUser(nftContract, userAddress) {
    // Function implementation
}

export async function approveAndRegisterAffiliate(nftContract, affiliateAddress, commissionRate) {
    // Validate inputs
    if (!ethers.utils.isAddress(affiliateAddress)) {
        throw new Error("Invalid affiliate address");
    }
    if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
        throw new Error("Invalid commission rate");
    }

    // Call the contract function
    const tx = await nftContract.approveAndRegisterAffiliate(affiliateAddress, commissionRate);
    await tx.wait();
    console.log("Affiliate approved and registered successfully");
}

export async function revokeAffiliate(nftContract, affiliateAddress) {
    // Function implementation
}

export async function setCommissionRate(nftContract, newRate) {
    // Validate commission rate input
    if (isNaN(newRate) || newRate < 0 || newRate > 100) {
        throw new Error("Invalid commission rate. Please provide a value between 0 and 100.");
    }

    // Convert commission rate to BigNumber if necessary
    const commissionRate = ethers.utils.parseUnits(newRate.toString(), 0); // Assuming rate is passed as a percentage

    // Call the contract function
    const tx = await nftContract.setCommissionRate(commissionRate);
    await tx.wait();
    console.log("Commission rate set successfully");
}

// Continue with other functions like withdrawFunds, toggleDirectPayment, etc.
