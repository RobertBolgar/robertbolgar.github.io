// Assuming ethers is already included in your HTML
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

async function findNFTsAndCalculatePLRT(userAddress) {
    // Connect to Ethereum provider (e.g., MetaMask)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // NFT contract address and ABI file location
    const NFT_CONTRACT_ADDRESS = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
    const abiLocation = 'abi_nft.json';

    // Load the ABI for the NFT contract
    const response = await fetch(abiLocation);
    const abi = await response.json();

    // Instantiate the NFT contract
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);

    // Check if the user is a Private Sale NFT holder
    const isPrivateSaleHolder = await nftContract.isPrivateSaleNFTHolder(userAddress);

    if (isPrivateSaleHolder) {
        // Fetch NFT details only if the user is a Private Sale NFT holder
        const balance = await nftContract.balanceOf(userAddress);

        // Each NFT is worth 20,000 PLRT
        const plrtEquivalent = balance.toNumber() * 20000;

        // Display the results on the webpage
        const walletInfoDiv = document.getElementById('walletInfo');
        walletInfoDiv.innerHTML += `<div>
            <h3>Private Sale NFT Vesting Details:</h3>
            <p>NFTs Owned: ${balance.toString()}</p>
            <p>PLRT Equivalent: ${plrtEquivalent.toLocaleString()} PLRT</p>
        </div>`;
    } else {
        // If the user is not a Private Sale NFT holder, display a message
        const walletInfoDiv = document.getElementById('walletInfo');
        walletInfoDiv.innerHTML += `<div>
            <p>You are not recognized as a holder of a Private Sale NFT.</p>
        </div>`;
    }
}

export { findNFTsAndCalculatePLRT };
