import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.2/dist/ethers.umd.min.js';
import { contractABI, contractAddress, nftContractABI, nftContractAddress } from './contractConfig.js'; // Import NFT contract details

// Create a new ethers contract instance for the main contract
const contract = new ethers.Contract(contractAddress, contractABI);

// Create a new ethers contract instance for the NFT contract
const nftContract = new ethers.Contract(nftContractAddress, nftContractABI);

export async function initContract(signer) {
    return new ethers.Contract(contractAddress, contractABI, signer);
}

export async function initiateVestingForNFTHolder() {
    const signer = await connectWallet();
    const contractWithSigner = contract.connect(signer);
    await contractWithSigner.initiateVestingForNFTHolder();
}

export async function claimTokens() {
    const signer = await connectWallet();
    const contractWithSigner = contract.connect(signer);
    await contractWithSigner.claimTokens();
}

export async function sendPLRTToContract(signer, plrtAmount) {
    try {
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contract.receiveTokensAndStartVesting(plrtAmount);
        await tx.wait();
        console.log('PLRT tokens sent to contract successfully.');
        return true;
    } catch (error) {
        console.error('Error sending PLRT tokens to contract:', error);
        return false;
    }
}

export const vestingFunctions = {
    getTeamMemberVestingDetails: async (address) => {
        try {
            // Call the contract function to get team member vesting details
            return await contract.getTeamMemberVestingDetails(address);
        } catch (error) {
            console.error('Error fetching team member vesting details:', error);
            throw error; // Propagate the error
        }
    },
    getPrivateSaleNFTVestingDetails: async (address) => {
        try {
            // Call the contract function to get private sale NFT vesting details
            return await contract.getPrivateSaleNFTVestingDetails(address);
        } catch (error) {
            console.error('Error fetching private sale NFT vesting details:', error);
            throw error; // Propagate the error
        }
    },
    getTreasuryVestingDetails: async () => {
        try {
            // Call the contract function to get treasury vesting details
            return await contract.getTreasuryVestingDetails();
        } catch (error) {
            console.error('Error fetching treasury vesting details:', error);
            throw error; // Propagate the error
        }
    }
};
