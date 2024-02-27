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
        
        // Assuming _tokenURIs mapping is publicly accessible or there's a function to set it
        // and price setting functionality is implemented
        // This is a placeholder for actual logic, as listing directly for sale might not be directly supported
        displayMessage('Listing NFT action initiated...', 'listMessage');
    }

    async function handleBuyFormSubmit(e) {
        e.preventDefault();
        const tokenId = document.getElementById('tokenId').value;
        const affiliateAddress = await getAffiliateAddressFromURL();
        const nftPriceWei = await nftContract.tokenPrices(tokenId); // Ensure this method exists to fetch price
        
        try {
            const tx = await nftContract.buyNFT(tokenId, affiliateAddress, { value: nftPriceWei });
            await tx.wait();
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
