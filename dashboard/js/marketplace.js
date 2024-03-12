// Connect to the contract and fetch data
async function fetchMarketplaceData() {
    try {
        const provider = await initializeWeb3(); // Initialize Web3
        const contracts = await setupContracts(provider); // Setup contracts
        const nftMarketplace = contracts.NFTMarketplace; // Access NFTMarketplace contract

        // Fetch data from the contract
        const listings = await nftMarketplace.getAllListings();
        displayListings(listings);
    } catch (error) {
        console.error("Error fetching marketplace data:", error);
    }
}

// Display listings on the HTML page
function displayListings(listings) {
    const listingsDiv = document.getElementById("listings");
    listingsDiv.innerHTML = ""; // Clear previous listings

    // Loop through listings and create HTML elements
    listings.forEach(listing => {
        const listingElement = document.createElement("div");
        listingElement.innerHTML = `<p>Token ID: ${listing.tokenId}, Price: ${listing.price}</p>`;
        listingsDiv.appendChild(listingElement);
    });
}

// Fetch marketplace data when the window loads
window.onload = fetchMarketplaceData;
