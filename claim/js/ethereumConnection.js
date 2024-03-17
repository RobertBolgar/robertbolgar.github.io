import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.2/dist/ethers.umd.min.js';

export async function connectWallet() {
    if (window.ethereum) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            return signer;
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            // You can provide more specific error messages based on the error type
            if (error.code === 4001) {
                console.error("User denied account access");
            } else {
                console.error("An unknown error occurred");
            }
            throw error; // Rethrow the error to propagate it to the caller if needed
        }
    } else {
        console.error("No Ethereum provider found. Install MetaMask.");
        throw new Error("No Ethereum provider found. Install MetaMask."); // Throw an error to indicate the lack of Ethereum provider
    }
}
