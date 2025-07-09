document.addEventListener('DOMContentLoaded', () => {
    const cryptoContainer = document.getElementById('crypto-container');
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

    async function fetchCryptoData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }
            const coins = await response.json();
            displayCryptoData(coins);
        } catch (error) {
            console.error("Error fetching crypto data:", error);
            cryptoContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
        }
    }

    function displayCryptoData(coins) {
        cryptoContainer.innerHTML = ''; // Clear previous data or loading message

        if (!coins || coins.length === 0) {
            cryptoContainer.innerHTML = '<p>No cryptocurrency data available.</p>';
            return;
        }

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table header
        const headerRow = document.createElement('tr');
        const headers = ['Rank', 'Name', 'Symbol', 'Price (USD)', 'Market Cap (USD)', '24h Change (%)'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        coins.forEach((coin, index) => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = coin.market_cap_rank || (index + 1); // Use market_cap_rank if available

            const nameCell = document.createElement('td');
            const nameLink = document.createElement('a');
            nameLink.href = `https://www.coingecko.com/en/coins/${coin.id}`;
            nameLink.textContent = coin.name;
            nameLink.target = '_blank'; // Open in new tab
            nameCell.appendChild(nameLink);

            // Display coin image
            const image = document.createElement('img');
            image.src = coin.image;
            image.alt = coin.name;
            image.style.width = '20px';
            image.style.height = '20px';
            image.style.marginRight = '8px';
            nameCell.prepend(image);


            const symbolCell = document.createElement('td');
            symbolCell.textContent = coin.symbol.toUpperCase();

            const priceCell = document.createElement('td');
            priceCell.textContent = coin.current_price ? `$${coin.current_price.toLocaleString()}` : 'N/A';

            const marketCapCell = document.createElement('td');
            marketCapCell.textContent = coin.market_cap ? `$${coin.market_cap.toLocaleString()}` : 'N/A';

            const priceChange24hCell = document.createElement('td');
            const change = coin.price_change_percentage_24h;
            if (change != null) {
                priceChange24hCell.textContent = `${change.toFixed(2)}%`;
                priceChange24hCell.style.color = change >= 0 ? 'green' : 'red';
            } else {
                priceChange24hCell.textContent = 'N/A';
            }

            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(symbolCell);
            row.appendChild(priceCell);
            row.appendChild(marketCapCell);
            row.appendChild(priceChange24hCell);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        cryptoContainer.appendChild(table);
    }

    fetchCryptoData();
    // Refresh data every 60 seconds (as per CoinGecko's public API update frequency)
    setInterval(fetchCryptoData, 60000);
});
