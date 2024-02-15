Reviewing your JavaScript code and considering the scenario where only the wallet address is displayed upon connection, without updating other details, let's address a few potential issues directly related to your `fetchAndDisplayVestingDetails` function and overall script setup:

### Review and Potential Fixes

1. **Contract Interaction and BigNumber Handling**:
   - Your code correctly uses ethers.js for interaction with the Ethereum blockchain. However, when dealing with Smart Contract functions that return `BigNumber` types (like `totalAllocation`, `amountWithdrawn`), ensure all BigNumber operations are handled properly.
   - When calculating `availableToWithdraw`, your code snippet within the catch block seems misplaced or potentially incorrect due to direct arithmetic operations on BigNumbers without using ethers.js BigNumber methods. JavaScript doesn't directly support these operations on BigNumbers returned by ethers.js.

2. **Ensuring BigNumber Arithmetic**:
   - Use ethers.js BigNumber methods for calculations. For example, to add or subtract BigNumbers, use `.add()` or `.sub()` methods provided by ethers.js.

3. **Duplicate Variable Declaration**:
   - You have declared `const now` twice in the same scope within `fetchAndDisplayVestingDetails`. This can cause syntax errors or unexpected behavior. Ensure each variable is declared only once within the same functional scope.

4. **Displaying Available Tokens Correctly**:
   - To display "Tokens available for withdrawal", you must calculate this based on the vesting details and withdrawal rules defined in your Smart Contract. This involves understanding the vesting schedule, the withdrawal rate, and how much has already been withdrawn.

### Corrected Approach for Calculating and Displaying Available Tokens

Here's a simplified and corrected approach for calculating and displaying "Tokens available for withdrawal", assuming you need to make a correction for BigNumber handling and avoid duplicating variable declarations:

```javascript
// Assuming fetchAndDisplayVestingDetails function is called correctly after connecting wallet
async function fetchAndDisplayVestingDetails(walletAddress) {
    // Existing setup code for provider, signer, and contract...

    try {
        const details = await contract.vestingDetails(walletAddress);
        // Formatting and displaying vesting details as before...

        // Use BigNumber methods for any arithmetic operations involving BigNumbers
        const now = Math.floor(Date.now() / 1000); // Current time in seconds, only declared once
        const timeSinceLastWithdrawal = ethers.BigNumber.from(now).sub(details.lastWithdrawal);
        const VESTING_PERIOD = await contract.VESTING_PERIOD();
        const isEligibleToWithdraw = timeSinceLastWithdrawal.gte(VESTING_PERIOD);

        // Determine the correct logic to calculate availableToWithdraw based on your contract's rules
        // This logic will depend on how your smart contract calculates available amounts
        // Example placeholder logic:
        let availableToWithdraw; // Calculate based on contract logic
        // Example: If no tokens are available to withdraw, ensure it defaults to "0.0"
        availableToWithdraw = availableToWithdraw || ethers.utils.parseEther("0");

        document.getElementById('tokensAvailableForWithdrawal').innerText = ethers.utils.formatEther(availableToWithdraw) + ' PLRT';

        // Update the rest of the UI elements as needed...
    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
}
```

### Key Points
- **BigNumber Arithmetic**: Ensure you're using ethers.js BigNumber arithmetic for operations involving contract return values.
- **Single Declaration**: Make sure variables like `now` are declared once per scope to avoid errors.
- **Logic for Available Tokens**: You'll need to implement logic matching your contract's rules to calculate `availableToWithdraw` correctly. The above example assumes a placeholder for this calculation.

By following these guidelines and ensuring correct BigNumber handling, you should be able to display all relevant details, including "Tokens available for withdrawal", upon successfully connecting a wallet.
