var express = require('express');
var router = express.Router();
var { ethers } = require('ethers');
const provider = new ethers.providers.InfuraProvider("maticmum", "f22f7a7918244c1ba50f5ce922c6ef10");
//yeah, yeah, see my private key 
const wallet = new ethers.Wallet("b60afcfc841ccaf37dc1e28d654b1899465c1ffa02a8ed7b702be342d0cced76", provider);
console.log("ready");
router.get("/", (req, res) => res.render("index"))


router.post('/', async function(req, res, next) {
  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "gas",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        },
        {
          "internalType": "bytes32",
          "name": "txHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "execute",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "relayer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "behalfOf",
          "type": "address"
        }
      ],
      "name": "Executed",
      "type": "event"
    }
  ];
  const contract = new ethers.Contract("0x39e2996A90C29f4ff584da164773a2c2Cc42c0dF", abi, wallet);
  const parsedTx = ethers.utils.parseTransaction(req.body.tx);
  console.log(parsedTx);  

  //todo : calculate the right V
  const sentTx = await contract.execute(wallet.address, wallet.address, 0, 21000, wallet.address, parsedTx.hash, 27, parsedTx.r, parsedTx.s);
  console.log(sentTx);
  res.send( { txHash : sentTx.hash });
});

module.exports = router;
