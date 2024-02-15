From your description, it appears the "Tokens available for withdrawal:" field is not displaying any value, particularly when the availability is "No" or when no tokens are yet eligible for withdrawal. To address this and ensure a more intuitive display, including showing "0.0 PLRT" (or a similar placeholder) when no tokens are available, you'll need to adjust the logic in the section where these details are set.

Given the structure of your code and the output described, here's an approach to ensure "0.0 PLRT" is displayed when no tokens are available for withdrawal:

1. **Ensure a Default Value**: First, set a default value for tokens available for withdrawal when the page loads or when the details are fetched. This ensures there's always a value displayed, even before any specific calculation takes place.

2. **Adjust the Display Based on Eligibility**: When calculating the tokens available for withdrawal, ensure the calculation accounts for cases where the result is zero or no tokens are available yet. This involves adjusting the logic in `fetchAndDisplayVestingDetails` or wherever the eligibility for withdrawal is determined.

Here's a conceptual adjustment to the `fetchAndDisplayVestingDetails` function to include a default display for "Tokens available for withdrawal:" and adjust it based on the withdrawal eligibility:

```javascript
async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    try {
        const details = await contract.vestingDetails(walletAddress);
        // Other details setup remains the same...

        // Assuming `calculateTokensAvailableForWithdrawal` is a function you need to define based on your contract's logic
        // This should calculate how many tokens are currently available for withdrawal for the connected wallet
        const tokensAvailable = calculateTokensAvailableForWithdrawal(details); // Implement this based on your logic

        // Ensure there's a default value displayed, even if it's zero
        document.getElementById('tokensAvailableForWithdrawal').innerText = `${tokensAvailable.toFixed(2)} PLRT`;

        // If there's no specific function like `calculateTokensAvailableForWithdrawal`, you may need to implement logic to determine
        // the amount based on `details`, the current time, `VESTING_PERIOD`, and any other relevant contract parameters.

    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
}
```

In this adjustment:
- `calculateTokensAvailableForWithdrawal(details)` is a placeholder for your actual logic to determine the amount of tokens available for withdrawal based on the fetched vesting details and possibly other factors like the current time and any vesting periods. You'll need to implement this logic based on the specific rules defined in your smart contract.
- The `.toFixed(2)` ensures numerical values are formatted to two decimal places, so you always have a consistent display format like "0.00 PLRT" even when the value is zero.

Remember, the actual implementation of `calculateTokensAvailableForWithdrawal` will depend on how your smart contract calculates available tokens for withdrawal, including any vesting schedules, periods, and already withdrawn amounts.
