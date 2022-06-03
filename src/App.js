import * as React from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const contractAddress = "0xd90F03580359daB989Dc2cd9877EFFbC5aBEb3a4";

const getContract = () => {
  const { ethereum } = window;

  if (!ethereum) return;

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(
    contractAddress,
    abi.abi,
    signer
  );

  return wavePortalContract;
};

export default function App() {
  const [accounts, setAccounts] = React.useState([]);
  const [count, setCount] = React.useState(null);
  const [countReadError, setCountReadError] = React.useState(false);

  const [isWaving, setIsWaving] = React.useState(false);
  const [waved, setWaved] = React.useState(false);

  const getTotalWaves = async () => {
    try {
      const contract = getContract();

      const count = await contract.getTotalWaves();
      setCount(count.toNumber());
    } catch (error) {
      setCountReadError(true);
    }
  };

  const wave = async () => {
    try {
      const contract = getContract();

      setIsWaving(true);
      const waveTxn = await contract.wave();
      await waveTxn.wait();
      await getTotalWaves();

      setIsWaving(false);
      setWaved(true);
    } catch (error) {
      window.alert("Error occured while trying to wave, try again.");
      setIsWaving(false);
    }

    await checkWallet();
  };

  const checkWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    const accounts = await ethereum.request({ method: "eth_accounts" });
    setAccounts(accounts);
  };

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) return;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAccounts(accounts);
  };

  React.useEffect(() => {
    checkWallet();
    getTotalWaves();
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
          I am nakaakist. Connect your Ethereum wallet and wave at me!
        </div>

        <div className="totalWaves">
          <h3>Total waves</h3>
          {countReadError ? (
            <div className="error">
              Error reading waves. make sure you use Goerli test network
            </div>
          ) : (
            <h1>
              {count == null ? (
                <FontAwesomeIcon icon={faSpinner} className="spinner" />
              ) : (
                count
              )}
            </h1>
          )}
        </div>

        <div className="operationArea">
          {!waved && !isWaving && accounts.length === 0 && (
            <button className="button" onClick={connectWallet}>
              Connect your wallet
            </button>
          )}

          {!waved && !isWaving && accounts.length > 0 && (
            <>
              <button className="button" onClick={wave}>
                Wave at Me
              </button>
              <div className="address">
                <h4>your wallet address</h4>
                <div>{accounts[0]}</div>
              </div>
            </>
          )}

          {isWaving && (
            <h2>
              Wave in progress...{" "}
              <span>
                <FontAwesomeIcon icon={faSpinner} className="spinner" />
              </span>
            </h2>
          )}
          {waved && !isWaving && (
            <h2>
              Thank you for waving!!{" "}
              <span role="img" aria-label="wave">
                🎉
              </span>
            </h2>
          )}
        </div>
        <a
          href="https://github.com/nakaakist/waveportal-starter-project"
          target="_blank"
          rel="noopener noreferrer"
          className="codelink"
        >
          <FontAwesomeIcon icon={faGithub} /> source code
        </a>
      </div>
    </div>
  );
}
