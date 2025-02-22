# MultiNetwork Auto Transaction Bot

Automated wallet creation, faucet claiming, and token transfer bot for Somnia and Nexus Networks.

## Features

- Multi-network support (Somnia, Nexus)
- Automatic wallet generation
- Faucet claiming for Somnia network
- Automated token transfers
- Wallet management and storage
- Transaction tracking with explorer links

## Networks Supported

1. Somnia Testnet
   - RPC: https://dream-rpc.somnia.network
   - Chain ID: 50312
   - Symbol: STT
   - Explorer: https://somnia-testnet.socialscan.io

2. Nexus Network
   - RPC: https://rpc.nexus.xyz/http
   - Chain ID: 392
   - Symbol: NEX
   - Explorer: https://explorer.nexus.xyz

## Installation

1. Clone the repository:
```bash
git clone https://github.com/airdropinsiders/MultiNetwork-Auto-Tx.git
cd MultiNetwork-Auto-Tx
```

2. Install dependencies:
```bash
npm install
npm install axios ethers readline-sync https-proxy-agent
```

3. Create a `pk.txt` file in the root directory and add your private key:
```bash
echo "your_private_key_here" > pk.txt
```

4. Creat a proxies.txt file and add your proxies like that
'''bash

http://username:password@ip:port
http://ip:port
```

## Usage

1. Start the bot:
```bash
node index.js
```

2. Choose from available options:
   - Generate Wallets & Claim Faucet (Somnia)
   - Transfer STT Tokens (Somnia)
   - Transfer NEX Tokens (Nexus)

3. Follow the prompts to:
   - Specify number of wallets to generate
   - Set token amount per transaction
   - Define number of transactions

## Generated Files

- `wallets.txt`: Contains generated wallet addresses and private keys
- Format: `address:privateKey`

## Configuration

All network configurations are defined in the code:
- RPC endpoints
- Chain IDs
- Network symbols
- Explorer URLs

## Dependencies

- ethers: Ethereum wallet and contract interactions
- axios: HTTP requests for faucet claims

## Security

- Never share your private key
- Keep your `pk.txt` file secure
- Regularly backup your `wallets.txt` file
- Use testnet tokens for testing

## Disclaimer

This tool is for educational and testing purposes only. Use at your own risk.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License
