
const contractABI = [ { "inputs": [ { "internalType": "contract IERC20", "name": "_tokenAddress", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "oldAddress", "type": "address" }, { "internalType": "address", "name": "newAddress", "type": "address" } ], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "plrToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teamMembers", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "VESTING_PERIOD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "vestingDetails", "outputs": [ { "internalType": "uint256", "name": "totalAllocation", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "vestingStart", "type": "uint256" }, { "internalType": "uint256", "name": "lastWithdrawal", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];
const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";

async function detectAndConnectMetaMask() {
    const provider = await detectEthereumProvider();
    if (provider && provider === window.ethereum) {
        console.log("MetaMask is installed!");
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                const walletAddress = accounts[0];
                document.getElementById('walletAddress').innerText = walletAddress;
                document.getElementById('walletAddressDisplay').style.display = 'block';
                document.getElementById('withdrawTokensButton').style.display = 'block';
                // Fetch and display vesting details
                await fetchAndDisplayVestingDetails(walletAddress);
            }
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log("MetaMask is not installed or not accessible.");
    }
}

async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
        const details = await contract.vestingDetails(walletAddress);
        console.log('Vesting details:', details);
        // Assuming you have HTML elements with IDs to display these details
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation);
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn);
        document.getElementById('vestingStart').innerText = new Date(details.vestingStart * 1000).toLocaleString();
        document.getElementById('lastWithdrawal').innerText = new Date(details.lastWithdrawal * 1000).toLocaleString();
        document.getElementById('vestingDetailsDisplay').style.display = 'block';
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }
}

async function withdrawTokens() {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('MetaMask is not installed or not accessible.');
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const tx = await contract.withdrawTokens();
        console.log('Withdrawal transaction:', tx);
        await tx.wait();
        document.getElementById('withdrawalStatus').innerText = 'Withdrawal successful!';
        // Optionally, refresh the vesting details display here after withdrawal
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await fetchAndDisplayVestingDetails(accounts[0]);
        }
    } catch (error) {
        console.error('Error during token withdrawal:', error);
        document.getElementById('withdrawalStatus').innerText = 'Withdrawal failed. See console for details.';
    }
}

document.addEventListener('DOMContentLoaded', detectAndConnectMetaMask);
