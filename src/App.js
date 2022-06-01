import * as React from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const [accounts, setAccounts] = React.useState([]);

  const wave = () => {};

  const checkWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) return;

    console.log("ethereum", ethereum);

    const accounts = ethereum.request({ method: "eth_accounts" });

    console.log(accounts);
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) return;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    console.log("accounts", accounts);

    setAccounts(accounts);
  };

  React.useEffect(() => {
    checkWallet();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        <button className="waveButton" onClick={connectWallet}>
          Connect your wallet
        </button>

        <div>your wallet addresses: {accounts}</div>
      </div>
    </div>
  );
}
