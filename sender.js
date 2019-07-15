const ethers = require('ethers');
const path = require('path'); // Helps to find the path to the contract across whatever OS you are using form compile.js to xxx.sol files
const fs = require('fs'); // Load the FileSystem Module.

const contractPath = path.resolve(__dirname, 'contracts', 'C50.json'); //Creation of cross SO's path.
const mnemonicPath = path.resolve(__dirname, '.mnemonic');

const source = JSON.parse(fs.readFileSync(contractPath));
const mnemonic = fs.readFileSync(mnemonicPath);
const abi = source.abi;
const bytecode = source.bytecode;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

console.log(process.argv);


// Connect to the network
let provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

// let provider = new ethers.providers.InfuraProvider('mainnet', infuraProjectId);

// Load the wallet to deploy the contract with
let wallet = ethers.Wallet.fromMnemonic(mnemonic.toString()).connect(provider);
var contract = new ethers.Contract('0x5274ABe031ECEB2dA4DF8E106eEeCEb044681485', abi, wallet);


// Deployment is asynchronous, so we use an async IIFE
(async function() {
    let from = wallet.address;
    let to = "0x291B95B0882aB4EfaFfc94f81BAbE2E44D3fBb73";
    let balance = await contract.balanceOf(from);
    console.log("from balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());

    balance = await contract.balanceOf(to);
    console.log("to balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());

    var amount = String(1);
    var numberOfDecimals = 18;
    var numberOfTokens = ethers.utils.parseUnits(amount, numberOfDecimals);
    let options = {
        gasPrice: ethers.utils.parseUnits('2', 'gwei'),
    };
    contract.transfer(to, numberOfTokens, options).then(function(transaction) {
       console.log("transaction", transaction);
       res.send(transaction);
    })

    balance = await contract.balanceOf(from);
    console.log("from balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());

    balance = await contract.balanceOf(to);
    console.log("to balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());
})();