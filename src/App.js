import "./App.css";
import { ethers } from "ethers";
import { abi, contractAddress } from "./constants.js";

function App() {
  async function connectButton() {
    //let signer = null;
    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      console.log(provider);

      //signer = await provider.getSigner();
    }
    console.log("Wallet Connected..........................");
  }

  // async function disconnectButton() {
  //   console.log("Wallet Disconnected.......................");
  // }

  async function Deposit() {
    let signer = null;
    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      console.log(provider);
      signer = await provider.getSigner();
    }

    try {
      const newDeposit = document.getElementById("depositAmount").value;
      const contract = new ethers.Contract(contractAddress, abi, signer);
      // const formatedDeposit = new ethers.parseUnits(`${newDeposit}`, "6");
      const transaction = await contract.Deposit(newDeposit);
      await transaction.wait();
      console.log("Amount Deposited!", transaction);
    } catch (error) {
      console.log(error);
    }
  }
  let addressesArray = [];
  let amountArray = [];

  function addAddress() {
    try {
      const newPayoutAdderss = document.getElementById("payoutAddress").value;

      addressesArray = newPayoutAdderss.split(/\s+/);

      console.log("Addresses Added :", addressesArray);
    } catch (error) {
      console.log(error);
    }
  }

  function addAmount() {
    try {
      const newPayoutAmount = document.getElementById("payoutAmount").value;
      // amountArray.push(newPayoutAmount);
      amountArray = newPayoutAmount.split(/\s+/);
      console.log("Amounts Added :", amountArray);
    } catch (error) {
      console.log(error);
    }
  }
  //Upda

  async function Payout() {
    addAddress();
    addAmount();
    let signer = null;
    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      console.log(provider);
      signer = await provider.getSigner();
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      // const formatedDeposit = new ethers.parseUnits(`${newDeposit}`, "6");
      const transaction = await contract.sendUSDC(addressesArray, amountArray);
      await transaction.wait();
      console.log("Payout Transaction!", transaction);
    } catch (error) {
      console.log(error);
    }
  }

  async function viewDetails() {
    let provider;
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      console.log(provider);
      await provider.send("eth_requestAccounts", []);

      try {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const transaction = await contract.Administrators(0);
        const transaction1 = await contract.Administrators(1);
        const transaction2 = await contract.Administrators(2);
        console.log(transaction);
        console.log(transaction1);
        console.log(transaction2);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function PayoutV2() {
    // const jsonData = {
    //   addresses: [
    //     "0x2fd1AFA939eFD359a302D757740d6eC15b820bC2",
    //     "0x725b33A7d6344744bb1bAbbF8D11F204d018a586",
    //     "0xF7c371Ea75F648cC3070B3f538e0Bd68359FEDc2",
    //   ],
    //   amounts: [1000000, 4000000, 2000000],
    // };

    try {
      // Fetch JSON data from an external source
      const response = await fetch(
        "https://raw.githubusercontent.com/AbelOsaretin/Payout-Frontend-V3/main/src/data.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();

      // Extract addresses and amounts from JSON
      const addresses = jsonData.addresses;
      const amounts = jsonData.amounts;
      console.log("Address and amount", addresses, amounts);

      let signer = null;
      let provider;
      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider();
      } else {
        provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        signer = await provider.getSigner();
      }

      try {
        const contract = new ethers.Contract(contractAddress, abi, signer);
        // const formatedDeposit = new ethers.parseUnits(`${newDeposit}`, "6");
        const transaction = await contract.sendUSDC(addresses, amounts);
        await transaction.wait();
        console.log("Payout Transaction!", transaction);
      } catch (error) {
        console.log(error);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <br />
        <div>Sample Implementation</div>
        <button onClick={connectButton}>Connect Wallet</button>
        <br />
        {/* <button onClick={disconnectButton}>Disconnect Wallet</button> */}
        <label for="depositAmount">Enter Deposit Amount</label>
        <input id="depositAmount"></input>

        <button onClick={Deposit}>Deposit</button>
        <br />
        <h1> Payout </h1>

        <button onClick={PayoutV2}>Payout</button>
        <br />
        <button onClick={viewDetails}>View ADMINS</button>
      </header>
    </div>
  );
}

export default App;
