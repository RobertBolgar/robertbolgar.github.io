import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
import { contractABI, contractAddress } from './contractConfig.js'; // Assume these are defined in your config

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
    team: async (contract, address) => await contract.getTeamMemberVestingDetails(address),
    privateSale: async (contract, address) => await contract.getPrivateSaleNFTVestingDetails(address),
    treasury: async (contract) => await contract.getTreasuryVestingDetails(),
    // Add more functions as necessary
};
