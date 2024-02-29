// web3Setup.js
export async function initializeWeb3() {
    let provider;
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        return provider;
    } else {
        console.error('Ethereum provider is not available');
        throw new Error('Ethereum provider is not available');
    }
}

