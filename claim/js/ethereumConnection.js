import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

export async function connectWallet() {
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            return signer;
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.error("No Ethereum provider found. Install MetaMask.");
    }
}
