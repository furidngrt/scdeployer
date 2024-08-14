import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Smart Contract Deployer - Deploy EVM Contracts Easily",
  description: "Deploy your Ethereum smart contracts with ease. Choose from various contract templates such as Token, Simple Storage, Crowdfunding, NFT Creator, and DAO.",
  keywords: "Ethereum, Smart Contract, Deployer, Token, Simple Storage, Crowdfunding, NFT, DAO, MetaMask, DApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="https://i.ibb.co.com/1mHFrTn/logo.png" type="image/x-icon" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
