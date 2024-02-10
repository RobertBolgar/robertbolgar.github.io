<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unlock the Future of Crypto with $PLRT</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Discover the Next Frontier in Crypto: $PLRT</h1>
    </header>

    <main>
        <section class="user-info">
            <h2>Turn the Digital World Upside Down with $PLRT</h2>
            <p>Imagine being at the forefront of a revolution where content isn't just created—it's owned, traded, and exponentially valued. Welcome to $PLRT, the crypto sensation that's rewriting the rules:</p>
<ul>
    <li><strong>Instant Gratification:</strong> Connect your wallet and instantly get rewarded. The future doesn't wait, and neither should you.</li>
    <li><strong>Your Influence Pays Off:</strong> Share the revolution with your network, and watch as your digital wallet grows with each connection.</li>
</ul>

            <div class="info-item">
                <label>🚀 Your Launchpad to Crypto Greatness - Your Referral Link:</label>
                <input type="text" id="referral-link" value="https://www.plrtoken.com/ref?user=example" readonly>
                <button onclick="copyLink()" class="button">Copy & Share</button>
            </div>
            <p>Join a league of pioneers in a community that's setting the digital world ablaze with innovation and rewards.</p>
            <button onclick="followOnTwitter()" class="button">Be Part of the Movement</button>
            <button onclick="shareOnTwitter()" class="button">Spread the Fire</button>
            <p class="share-incentive"><strong>Carpe Diem:</strong> Dive into a 3 million token reserve exclusively for our vanguards. Your actions today sculpt your tomorrow in the $PLRT ecosystem.</p>
        </section>
        
        <section class="referral-stats">
            <h2>Your Influence, Quantified</h2>
            <div class="stats-item">
                <p>🌍 Digital Expansion:</p>
                <span>0</span> <!-- This will be dynamically updated -->
            </div>
            <div class="stats-item">
                <p>🏦 Treasure Trove:</p>
                <span>0 PLRT</span> <!-- This will be dynamically updated -->
            </div>
        </section>

        <section class="tips">
            <h2>Forge Your Legacy in the $PLRT Universe</h2>
            <ul>
                <li>Share your journey; let your network know how $PLRT is revolutionizing digital ownership and earning through groundbreaking NFT technology.</li>
                <li>Embrace the digital age; use every platform at your disposal to herald the dawn of a new era in content and crypto.</li>
                <li>Stay engaged; your insights could ignite the spark of participation and investment among your peers.</li>
            </ul>
        </section>
        <script src="custom-script.js"></script>
        <script>
            window.addEventListener("load", async () => {
                const isMetaMaskInstalled = await detectMetaMask();
                if (isMetaMaskInstalled) {
                    await connectToMetaMask();
                }
                generateOrDisplayReferralLink();
            });
        </script>
    </main>

    <footer>
        <p>&copy; 2024 PLRT Token. Pioneer the New Digital Economy.</p>
    </footer>
</body>
</html>
