import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

async function initWeb3() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            return new Web3(window.ethereum);
        } catch (error) {
            console.error("User denied account access");
            document.getElementById('walletInfo').innerHTML = '<p>Please connect your Ethereum wallet to access vesting details.</p>';
            return null;
        }
    } else if (window.web3) {
        return new Web3(window.web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        document.getElementById('walletInfo').innerHTML = '<p>Please install MetaMask or a compatible Ethereum wallet to access vesting details.</p>';
        return null;
    }
}

async function findNFTsAndCalculatePLRT() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const NFT_CONTRACT_ADDRESS = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
    const response = await fetch('abi_nft.json');
    const abi = await response.json();
    const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);
    const userAddress = await signer.getAddress();
    const balance = await nftContract.balanceOf(userAddress);
    const plrtEquivalent = balance.toNumber() * 20000;

    return { balance: balance.toString(), plrtEquivalent };
}

async function displayNFTDetails() {
    try {
        const { balance, plrtEquivalent } = await findNFTsAndCalculatePLRT();
        document.getElementById('walletInfo').innerHTML += `<div>
            <h3>Private Sale NFT Group Details:</h3>
            <p>NFTs Owned: ${balance}</p>
            <p>PLRT Equivalent: ${plrtEquivalent.toLocaleString()} PLRT</p>
        </div>`;
    } catch (error) {
        console.error("Error finding NFTs or calculating PLRT:", error);
        document.getElementById('walletInfo').innerHTML += '<p>Error loading NFT details or calculating PLRT equivalent.</p>';
    }
}

// Assuming you want this to run when the module is loaded
displayNFTDetails();
