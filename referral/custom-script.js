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

function updateReferralLink(walletAddress) {
  const referralLink = generateReferralLink(walletAddress);
  const referralLinkElement = document.getElementById("referral-link");
  referralLinkElement.value = referralLink; // Use value for input fields
}

function generateReferralLink(walletAddress) {
  return `https://www.plrtoken.com/referral?wallet=${walletAddress}`;
}

async function generateOrDisplayReferralLink() {
  const baseUrl = "https://www.yourdapp.com/referral";
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
