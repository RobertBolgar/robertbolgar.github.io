import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
import { contractABI, contractAddress, nftContractABI, nftContractAddress } from './contractConfig.js';

let contract;
let nftContract;

export async function initContracts() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    nftContract = new ethers.Contract(nftContractAddress, nftContractABI, signer);
}

export async function initiateVestingForNFTHolder() {
    await contract.initiateVestingForNFTHolder();
}

export async function claimTokens() {
    await contract.claimTokens();
}

export async function sendPLRTToContract(plrtAmount) {
    try {
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
            return await contract.getTeamMemberVestingDetails(address);
        } catch (error) {
            console.error('Error fetching team member vesting details:', error);
            throw error;
        }
    },
    getPrivateSaleNFTVestingDetails: async (address) => {
        try {
            return await contract.getPrivateSaleNFTVestingDetails(address);
        } catch (error) {
            console.error('Error fetching private sale NFT vesting details:', error);
            throw error;
        }
    },
    getTreasuryVestingDetails: async () => {
        try {
            return await contract.getTreasuryVestingDetails();
        } catch (error) {
            console.error('Error fetching treasury vesting details:', error);
            throw error;
        }
    }
};

export const treasuryFunctions = {
    getTreasuryWallet: async () => {
        try {
            return await contract.treasuryWallet();
        } catch (error) {
            console.error('Error fetching treasury wallet address:', error);
            throw error;
        }
    },
    // Additional treasury-related functions can be added here as needed.
};

// Initialize contracts upon application start or user wallet connection.
initContracts().catch(console.error);
