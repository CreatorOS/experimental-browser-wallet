import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import Mnemonic from 'mnemonic-browser';
import axios from 'axios';
import { useState } from 'react';


function App() {
  const [ tx, setTx ] = useState();


  const createWallet = async function () {
    setTx("creating new wallet")
    const wallet = ethers.Wallet.createRandom()
    await new Promise((r,x) => setTimeout(r(), 3000));
    //todo: move gas estimation to backend, won't require this key on front end
    const provider = new ethers.providers.InfuraProvider("maticmum", "f22f7a7918244c1ba50f5ce922c6ef10");
    console.log("address", wallet.address);
    const data = {
      from: wallet.address,
      to: wallet.address,
      value: 0,
      chainId: 1,     
    };
    data.gasLimit = parseInt(await (await provider.estimateGas(data)).toString());
    data.gasPrice = Math.ceil((await provider.getGasPrice()) * 2);
    data.nonce = 6;//(await provider.getTransactionCount(wallet.address)) + 3;
    console.log("nonce", data.nonce);
    console.log(data);
    const signed = await wallet.signTransaction(
      data
    );
    setTx("Submitting gasless transaction ...");
    await new Promise((r,x) => setTimeout(r(), 3000));
    const parsedTx = ethers.utils.parseTransaction(signed);
    console.log(parsedTx);  

    console.log(signed);

    const txHash = await axios.post('http://localhost:3001/', { tx: signed});
    setTx("Created Tx on chain : "+ txHash.data.txHash);
    console.log("Tx hash", txHash);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => createWallet()}>Create a transaction</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {tx}
        </a>
      </header>
    </div>
  );
}

export default App;
