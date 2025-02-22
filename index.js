const ethers = require('ethers');
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

const networks = {
    somnia: {
        name: 'Somnia Testnet',
        chainId: 50312,
        rpc: 'https://dream-rpc.somnia.network',
        symbol: 'STT',
        explorer: 'https://somnia-testnet.socialscan.io'
    },
    nexus: {
        name: 'Nexus Network',
        chainId: 392,
        rpc: 'https://rpc.nexus.xyz/http',
        symbol: 'NEX',
        explorer: 'https://explorer.nexus.xyz'
    }
};

const WALLET_FILE = 'wallets.txt';
const FAUCET_API = 'https://testnet.somnia.network/api/faucet';
const PROXY_FILE = 'proxies.txt';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

function getProxies() {
    try {
        const data = fs.readFileSync(PROXY_FILE, 'utf8');
        return data.split('\n').map(proxy => proxy.trim()).filter(proxy => proxy);
    } catch (err) {
        console.error('Error reading proxies.txt:', err.message);
        return [];
    }
}

function getRandomProxy() {
    const proxies = getProxies();
    if (proxies.length === 0) return null;
    return proxies[Math.floor(Math.random() * proxies.length)];
}

function saveWalletToFile(address, privateKey) {
    const walletData = `${address}:${privateKey}\n`;
    fs.appendFileSync(WALLET_FILE, walletData);
}

function generateNewWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

async function claimFaucet(address) {
    try {
        const proxy = getRandomProxy();
        const agent = proxy ? new HttpsProxyAgent(proxy) : null;

        console.log(`Using proxy: ${proxy || 'No proxy'}`);

        const response = await axios.post(FAUCET_API, { address: address }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
            },
            httpsAgent: agent
        });

        if (response.data.success) {
            return {
                success: true,
                hash: response.data.data.hash,
                amount: response.data.data.amount
            };
        }
        return { success: false, error: 'Faucet claim failed' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function handleFaucetClaims() {
    try {
        const numWallets = parseInt(await askQuestion('How many wallets do you want to generate for faucet claims? '));

        if (isNaN(numWallets) || numWallets <= 0) {
            console.error('Number of wallets must be a positive number!');
            return;
        }

        console.log('\nStarting wallet generation and faucet claim process...');
        console.log(`Wallets will be saved to: ${WALLET_FILE}\n`);

        for (let i = 0; i < numWallets; i++) {
            const wallet = generateNewWallet();
            console.log(`\nWallet ${i + 1}/${numWallets}:`);
            console.log(`Address: ${wallet.address}`);

            saveWalletToFile(wallet.address, wallet.privateKey);

            console.log('Attempting to claim faucet...');
            const result = await claimFaucet(wallet.address);

            if (result.success) {
                console.log(`✅ Claim successful! TX Hash: ${result.hash}`);
                console.log(`Amount: ${ethers.formatEther(result.amount)} ${networks.somnia.symbol}`);
            } else {
                console.log(`❌ Claim failed: ${result.error}`);
            }

            if (i < numWallets - 1) {
                console.log('\nWaiting 5 seconds before next wallet...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        console.log('\nProcess completed!');
        console.log(`Total wallets generated: ${numWallets}`);
        console.log(`Wallets saved to: ${WALLET_FILE}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function showMenu() {
    while (true) {
        console.log('\n=== MULTI-NETWORK CRYPTO BOT | AIRDROP INSIDERS ===');
        console.log('1. Generate Wallets & Claim Faucet (Somnia)');
        console.log('2. Exit');

        const choice = await askQuestion('\nSelect menu (1-2): ');

        switch (choice) {
            case '1':
                await handleFaucetClaims();
                break;
            case '2':
                console.log('Thank you for using this bot!');
                rl.close();
                process.exit(0);
            default:
                console.log('Invalid choice!');
        }
    }
}

console.log('Starting Multi-Network Bot...');
showMenu().catch(console.error);
