// NFTMint.js

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize connection to Ethereum
    let provider;
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
    } else {
        console.error('Ethereum provider is not available');
        return;
    }

    const signer = provider.getSigner();

    // Fetch ABI files asynchronously
    const mintAbiResponse = await fetch('./contracts/ABI/NFTMint_ABI.json');
    const mintAbi = await mintAbiResponse.json();

    // Contract address
    const nftContractAddress = "0xe9Ac226DBC108dAEeba3dbe55B8b1cE3ae52381E";

    // Contract instance
    const nftContract = new ethers.Contract(nftContractAddress, mintAbi, signer);


    // Function to mint an NFT
    async function mintNFT(event) {
        event.preventDefault(); // Prevent form submission

        const name = document.getElementById('name').value;
        const tokenURI = document.getElementById('tokenURI').value;
        const price = document.getElementById('price').value;

        try {
            // Call the mintNFT function from the contract
            const tx = await nftContract.mintNFT(name, tokenURI, price);
            const receipt = await tx.wait(); // Wait for the transaction to be confirmed

            // Get the NFT ID from the transaction receipt
            const nftId = receipt.events[0].args[0].toNumber();

            // Update the HTML to display the NFT ID
            document.getElementById('nftIdDisplay').innerText = `NFT ID: ${nftId}`;

            // Provide feedback to the user
            console.log("NFT minted successfully");
            alert("NFT minted successfully!");
        } catch (error) {
            console.error("Error minting NFT:", error.message);
            alert("Failed to mint NFT. See console for more details.");
        }
    }

    // Add event listener to the mint form submission
    document.getElementById('mintForm').addEventListener('submit', mintNFT);

    // Other event listeners...

});
