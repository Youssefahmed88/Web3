# Web3Counter-dApp

A decentralized application (DApp) built with Next.js and Wagmi to interact with a smart contract counter deployed on the Ethereum Sepolia testnet. This project showcases the integration of Web3 technologies, providing a user-friendly interface for connecting to a wallet, fetching counter values, and incrementing the counter via blockchain transactions.

## Features

- **Wallet Connection**: Seamlessly connect to a wallet (e.g., MetaMask) using Web3Modal, with a toast notification upon successful connection.
- **Smart Contract Interaction**: Fetch and display counter values (`number` and `doubledNumber`) from the deployed smart contract.
- **Increment Counter**: Send a transaction to increment the counter value on the blockchain.
- **Network Validation**: Ensures the user is on the correct network (Sepolia testnet, Chain ID: 11155111).
- **User Feedback**: Displays toast notifications for successful actions, errors, and transaction status.

## Tech Stack

- **Next.js**: React framework for building the frontend.
- **Wagmi**: React hooks library for Ethereum blockchain interaction.
- **React-Hot-Toast**: For displaying user-friendly toast notifications.
- **Web3Modal**: For wallet connection and network switching.
- **Ethereum Sepolia Testnet**: The blockchain network used for deploying and interacting with the smart contract.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Youssefahmed88/Web3.git
   cd Web3/Web3Counter-dApp
   ```
2. run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Usage

    Connect Wallet: Click the "Connect Wallet" button to connect your wallet (e.g., MetaMask). A toast notification will confirm the connection.

    Switch Network: Ensure you're on the Sepolia testnet (Chain ID: 11155111).

    Fetch Counter Values: Use the "Get Counter" and "Get Number" buttons to fetch the current values from the smart contract.

    Increment Counter: Click the "Increment" button to send a transaction and increase the counter value.

## Demo Video

You can watch the demo video of the Web3 Counter DApp here:
[`Watch the Demo on Google Drive`](https://drive.google.com/file/d/1s_Vu_kGjbFiEUII_ZsEwnkr-RQaVvHQ0/view?usp=drive_link)

## License

This project is licensed under the MIT License

## Contact

- GitHub: [Youssefahmed88](https://github.com/Youssefahmed88)
- LinkedIn: [www.linkedin.com/in/youssefahmed70](https://www.linkedin.com/in/youssefahmed70)


Built by Youssef Ahmed