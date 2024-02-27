document.addEventListener('DOMContentLoaded', async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // Update these with your actual deployed contracts
    const nftMintContractAddress = "Your_NFTMint_Contract_Address";
    const affiliateTrackerContractAddress = "Your_AffiliateTracker_Contract_Address";
    const nftMintABI = [...]; // Your NFTMint Contract ABI
    const affiliateTrackerABI = [...]; // Your AffiliateTracker Contract ABI

    // Contract instances
    const nftContract = new ethers.Contract(nftMintContractAddress, nftMintABI, signer);
    const affiliateTrackerContract = new ethers.Contract(affiliateTrackerContractAddress, affiliateTrackerABI, signer);

    // DOM Elements
    const listForm = document.getElementById('listForm');
    const buyForm = document.getElementById('buyForm');
    const withdrawButton = document.getElementById('withdrawCommission');

    async function getAffiliateAddressFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('affiliate') || await nftContract.defaultAffiliate();
    }

    async function handleListFormSubmit(e) {
    e.preventDefault();
    const nftName = document.getElementById('nftName').value;
    const nftDescription = document.getElementById('nftDescription').value;
    const nftPrice = document.getElementById('nftPrice').value;
    // Assume mintNFT is a function in your smart contract that mints the NFT and returns the token ID
    try {
        // Call the minting function and wait for the transaction to complete
        const txResponse = await nftContract.mintNFT(signer.getAddress(), "tokenURI", { /* transaction parameters */ });
        const receipt = await txResponse.wait(); // Wait for transaction to be mined

        // Extract the token ID from the transaction receipt (if an event is emitted)
        // OR if the function directly returns the token ID, adjust accordingly
        let tokenId;
        for (const event of receipt.events) {
            if (event.event === "NFTListed" /* Replace with your actual event name */) {
                tokenId = event.args.tokenId.toString();
                break;
            }
        }

        // Display the token ID on the webpage
        displayMessage(`NFT listed successfully with Token ID: ${tokenId}`, 'listMessage');
    } catch (error) {
        displayErrorMessage(`Error listing NFT: ${error.message}`, 'listMessage');
    }
}


// Example function to add a new NFT to the displayed listings
function addNFTToListing(tokenId, nftName, nftDescription) {
    const nftListingsDiv = document.getElementById('nftListings');
    
    // Create elements for the NFT listing
    const listingElement = document.createElement('div');
    listingElement.classList.add('nft-listing');
    listingElement.innerHTML = `
        <h3>${nftName}</h3>
        <p>${nftDescription}</p>
        <p>Token ID: ${tokenId}</p>
    `;
    
    // Append the new listing to the listings container
    nftListingsDiv.appendChild(listingElement);
}

    // Assuming this is within the handleListFormSubmit function or a similar context
// after successfully listing an NFT and obtaining its token ID
addNFTToListing(newTokenId, nftName, nftDescription);

    

    async function handleBuyFormSubmit(e) {
    e.preventDefault();
    const tokenId = document.getElementById('tokenId').value;
    
    // Attempt to retrieve an affiliate address from the URL, defaulting to a zero address if not found
    let affiliateAddress = await getAffiliateAddressFromURL();
    if (!affiliateAddress) {
        affiliateAddress = '0x0000000000000000000000000000000000000000'; // Fallback to a zero address
    }

    try {
        // Fetch the NFT's price. Ensure your smart contract has a function to get the price by token ID.
        const nftPriceWei = await nftContract.tokenPrices(tokenId);

        // Ensure the user has a connected wallet and sufficient balance (this check is optional and can be more complex)
        const signer = await nftContract.signer;
        const userAddress = await signer.getAddress();
        const userBalance = await signer.getBalance();
        
        if (userBalance.lt(nftPriceWei)) {
            displayErrorMessage("Insufficient balance for this transaction.", 'buyMessage');
            return;
        }

        // Execute the transaction with the appropriate value and affiliate address
        const tx = await nftContract.buyNFT(tokenId, affiliateAddress, { value: nftPriceWei });
        await tx.wait(); // Wait for the transaction to be mined

        displayMessage('NFT purchased successfully!', 'buyMessage');
    } catch (error) {
        displayErrorMessage(`Error buying NFT: ${error.message}`, 'buyMessage');
    }
}


    async function handleWithdrawButtonClick() {
        try {
            const tx = await affiliateTrackerContract.withdrawEarnings();
            await tx.wait();
            displayMessage('Commission withdrawn successfully!', 'withdrawMessage');
        } catch (error) {
            displayErrorMessage(`Error withdrawing commission: ${error.message}`, 'withdrawMessage');
        }
    }

    function displayMessage(message, elementId) {
        const messageDiv = document.getElementById(elementId);
        messageDiv.innerText = message;
        messageDiv.className = 'message-success';
    }

    function displayErrorMessage(message, elementId) {
        const messageDiv = document.getElementById(elementId);
        messageDiv.innerText = message;
        messageDiv.className = 'message-error';
    }

    // Attach event listeners
    listForm.addEventListener('submit', handleListFormSubmit);
    buyForm.addEventListener('submit', handleBuyFormSubmit);
    withdrawButton.addEventListener('click', handleWithdrawButtonClick);
});
