<script src="https://cdn.jsdelivr.net/npm/ethers/dist/ethers.min.js"></script>

<script>
    const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";
    const contractABI = [
        {
            "inputs": [
                {"internalType": "contract IERC20", "name": "_tokenAddress", "type": "address"},
                {"internalType": "address", "name": "initialOwner", "type": "address"}
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {"inputs": [{"internalType": "address", "name": "owner", "type": "address"}], "name": "OwnableInvalidOwner", "type": "error"},
        {"inputs": [{"internalType": "address", "name": "account", "type": "address"}], "name": "OwnableUnauthorizedAccount", "type": "error"},
        {"anonymous": false, "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}], "name": "OwnershipTransferred", "type": "event"},
        {"inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
        {"inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
        {"inputs": [{"internalType": "address", "name": "oldAddress", "type": "address"}, {"internalType": "address", "name": "newAddress", "type": "address"}], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
        {"inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function"},
        {"inputs": [], "name": "owner", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
        {"inputs": [], "name": "plrToken", "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
        {"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "name": "teamMembers", "outputs": [{"internalType": "address", "name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
        {"inputs": [], "name": "VESTING_PERIOD", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
        {"inputs": [{"internalType": "address", "name": "", "type": "address"}], "name": "vestingDetails", "outputs": [{"internalType": "uint256", "name": "totalAllocation", "type": "uint256"}, {"internalType": "uint256", "name": "amountWithdrawn", "type": "uint256"}, {"internalType": "uint256", "name": "vestingStart", "type": "uint256"}, {"internalType": "uint256", "name": "lastWithdrawal", "type": "uint256"}], "stateMutability": "view", "type": "function"},
        {"inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"}
    ];

async function detectMetaMask() {
  const provider = await detectEthereumProvider();
  if (provider && provider === window.ethereum) {
    console.log("MetaMask is installed!");
    return true;
  } else {
    console.log("MetaMask is not installed!");
    return false;
  }
}

async function connectToMetaMask() {
  try {
    const provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        document.getElementById('walletAddress').innerText = walletAddress;
        document.getElementById('walletAddressDisplay').style.display = 'block';
        document.getElementById('withdrawTokensButton').style.display = 'block';
      } else {
        console.log('MetaMask is locked or the user has not connected any accounts');
      }
    } else {
      console.log('MetaMask is not installed or not accessible.');
    }
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
  }
}


    async function connectWallet() {
        const provider = await detectEthereumProvider();
        if (provider) {
            try {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                document.getElementById('walletAddress').innerText = account;
                document.getElementById('walletAddressDisplay').style.display = 'block';
                document.getElementById('withdrawTokensButton').style.display = 'block';
            } catch (error) {
                console.error(error);
            }
        } else {
            console.log('Please install MetaMask!');
        }
    }

    async function withdrawTokens() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            const tx = await contract.withdrawTokens();
            await tx.wait();
            document.getElementById('withdrawalStatus').innerText = 'Withdrawal successful!';
        } catch (error) {
            console.error(error);
            document.getElementById('withdrawalStatus').innerText = 'Withdrawal failed. See console for details.';
        }
    }
document.addEventListener('DOMContentLoaded', (event) => {
  const connectWalletButton = document.getElementById('connectWalletButton');
  if(connectWalletButton) {
    connectWalletButton.addEventListener('click', connectToMetaMask);
  }
});

    document.getElementById('connectWalletButton').addEventListener('click', connectWallet);
    document.getElementById('withdrawTokensButton').addEventListener('click', withdrawTokens);

    window.addEventListener('load', async () => {
        // Additional initialization if needed
    });
</script>


// New function to withdraw tokens
async function withdrawTokens() {
    // Ensure MetaMask is detected
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('MetaMask is not installed or not accessible.');
        return;
    }

    const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";
    const contractABI = [ { "inputs": [ { "internalType": "contract IERC20", "name": "_tokenAddress", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "oldAddress", "type": "address" }, { "internalType": "address", "name": "newAddress", "type": "address" } ], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "plrToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teamMembers", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "VESTING_PERIOD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "vestingDetails", "outputs": [ { "internalType": "uint256", "name": "totalAllocation", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "vestingStart", "type": "uint256" }, { "internalType": "uint256", "name": "lastWithdrawal", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.withdrawTokens();
        console.log('Withdrawal transaction:', tx);
        await tx.wait();
        console.log('Tokens withdrawn successfully');
        // Optionally, update UI to reflect the successful withdrawal
    } catch (error) {
        console.error('Error during token withdrawal:', error);
    }
}

// Update your event listener or add an event listener for the withdraw button
document.getElementById('withdrawTokensButton').addEventListener('click', withdrawTokens);
