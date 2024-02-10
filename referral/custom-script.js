// custom-script.js

// Assuming detectEthereumProvider is defined or imported from a library like '@metamask/detect-provider'
async function detectMetaMask() {
  if (window.ethereum && window.ethereum.isMetaMask) {
      // MetaMask is installed
      return true;
  } else {
      // MetaMask is not installed or not accessible
      return false;
  }
}

async function connectToMetaMask() {
  try {
      const provider = window.ethereum;
      if (provider) {
          const accounts = await provider.request({ method: 'eth_requestAccounts' });
          const walletAddress = accounts[0];
          updateReferralLink(walletAddress);
      } else {
          console.error('MetaMask is not installed or not accessible.');
      }
  } catch (error) {
      console.error('Error connecting to MetaMask:', error);
  }
}

// Assuming Web3 has been initialized and the user has MetaMask installed

// Add your smart contract ABI and address here
const contractABI = YOUR_ABI;
const contractAddress = "YOUR_CONTRACT_ADDRESS";

// Creating the contract instance with Web3
const contract = new web3.eth.Contract(contractABI, contractAddress);

// The claimRewards function to be called on button click
async function claimRewards() {
    try {
        // Get the user's account address
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];

        if (!userAccount) {
            throw new Error("No Ethereum account found. Please ensure MetaMask is connected.");
        }

        // Call the claimRewards function from the smart contract
        await contract.methods.claimRewards().send({ from: userAccount });

        // If no error occurs, update the status message
        document.getElementById('claim-status-message').innerText = 'Rewards claimed successfully!';
    } catch (error) {
        console.error("Error claiming rewards:", error);
        document.getElementById('claim-status-message').innerText = 'Error claiming rewards. See console for details.';
    }
}

// Ensure the window.ethereum object is available and request account access
if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' });
} else {
    console.error('MetaMask is not installed. Please install it to use this feature.');
    document.getElementById('claim-status-message').innerText = 'MetaMask is not installed.';
}


function followOnTwitter() {
    window.open('https://twitter.com/plrtoken', '_blank');
}

function shareOnTwitter() {
    const text = "Unlock rewards with a single click! 🌟 Join me on PLRT, where we're transforming the game of content monetization and ownership through innovative NFTs. Connect now and start earning! #PLRT #NFTs #EarnRewards";
    const url = document.getElementById('referral-link').value;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function updateReferralLink(walletAddress) {
  const referralLink = generateReferralLink(walletAddress);
  const referralLinkElement = document.getElementById("referral-link");
  referralLinkElement.value = referralLink; // Use value for input fields
}

function generateReferralLink(walletAddress) {
  return `https://www.plrtoken.com/referral?wallet=${walletAddress}`;
}

async function generateOrDisplayReferralLink() {
  const baseUrl = "https://www.plrtoken.com/referral";
  let referralLink;

  if (window.ethereum) {
      try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
              referralLink = `${baseUrl}?referrer=${accounts[0]}`;
          } else {
              referralLink = `${baseUrl}?referrer=example`;
          }
      } catch (error) {
          console.error("Error fetching accounts:", error);
          referralLink = `${baseUrl}?referrer=error`;
      }
  } else {
      referralLink = `${baseUrl}?referrer=example`;
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
  }

  document.getElementById("referral-link").value = referralLink;
}

// Function to copy referral link and display "Copied!" message
function copyLink() {
    const copyText = document.getElementById("referral-link");
    copyText.select();
    document.execCommand("copy");
    const copiedMessage = document.createElement("span");
    copiedMessage.textContent = "Copied!";
    copiedMessage.classList.add("copied-message");
    const button = document.querySelector(".button");
    button.parentNode.appendChild(copiedMessage);
    setTimeout(() => {
        copiedMessage.remove();
    }, 2000); // Remove the message after 2 seconds
}

// Integrate the newly added function within the window load event listener
window.addEventListener("load", async () => {
  const isMetaMaskInstalled = await detectMetaMask();
  if (isMetaMaskInstalled) {
      await connectToMetaMask();
  }
  // Generate or display referral link regardless of MetaMask installation
  generateOrDisplayReferralLink();
});

