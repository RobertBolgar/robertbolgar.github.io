import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
import { contractABI, contractAddress } from './contractConfig.js'; // Assume these are defined in your config

export async function initContract(signer) {
    return new ethers.Contract(contractAddress, contractABI, signer);
}

export const vestingFunctions = {
    team: async (contract, address) => await contract.getTeamMemberVestingDetails(address),
    privateSale: async (contract, address) => await contract.getPrivateSaleNFTVestingDetails(address),
    treasury: async (contract) => await contract.getTreasuryVestingDetails(),
    // Add more functions as necessary
};
