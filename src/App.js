import * as React from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const contractAddress = "0xc7F98E1C3020f1A7fd36bD75084EF88D0AfC3924";

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

  const [message, setMessage] = React.useState("");

  const [count, setCount] = React.useState(null);
  const [allWaves, setAllWaves] = React.useState([]);

  const [countReadError, setCountReadError] = React.useState(false);
  const [wavesReadError, setWavesReadError] = React.useState(false);

  const [isWaving, setIsWaving] = React.useState(false);
  const [waved, setWaved] = React.useState(false);

  const getTotalWaves = async () => {
    try {
      const contract = getContract();

      const count = await contract.getTotalWaves();
      setCount(count.toNumber());
    } catch (error) {
      console.error(error);
      setCountReadError(true);
    }
  };

  const getAllWaves = async () => {
    try {
      const contract = getContract();

      const waves = await contract.getAllWaves();
      setAllWaves(
        waves
          .map((w) => ({
            address: w.waver,
            timestamp: new Date(w.timestamp * 1000),
            message: w.message,
          }))
          .sort((w1, w2) => w2.timestamp - w1.timestamp)
      );
    } catch (error) {
      console.error(error);
      setWavesReadError(true);
    }
  };

  const wave = async () => {
    try {
      const contract = getContract();

      setIsWaving(true);
      const waveTxn = await contract.wave(message, { gasLimit: 300000 });
      await waveTxn.wait();
      await Promise.all([getTotalWaves(), getAllWaves()]);

      setIsWaving(false);
      setWaved(true);
    } catch (error) {
      window.alert("Error occured while trying to wave, try again.");
      console.error(error);
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
    getAllWaves();
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
              <input
                type="text"
                className="messageInput"
                placeholder="Type message to wave!"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <button
                className="button"
                onClick={wave}
                disabled={message.length === 0}
              >
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

        {wavesReadError ? (
          <div className="error">
            Error reading waves. make sure you use Goerli test network
          </div>
        ) : (
          <div className="waveDetail">
            <h2>All waves</h2>
            {allWaves.map((wave) => {
              return (
                <dl key={wave.timestamp}>
                  <dt>Address</dt>
                  <dd>
                    <a
                      href={`https://goerli.etherscan.io/address/${wave.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {wave.address}
                    </a>
                  </dd>
                  <dt>Time</dt>
                  <dd>{wave.timestamp.toString()}</dd>
                  <dt>Message</dt>
                  <dd>{wave.message}</dd>
                </dl>
              );
            })}
          </div>
        )}

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
