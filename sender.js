(async function() {
const ethers = require('ethers');
const path = require('path'); // Helps to find the path to the contract across whatever OS you are using form compile.js to xxx.sol files
const fs = require('fs'); // Load the FileSystem Module.
let ethereumHelper = require('./utils/ethereum');

const USAGE = `Usage: ${process.argv[1]} [To] [Amount] [GasPrice (GWei)]`;

if(process.argv.length < 2 ) {
    console.log(USAGE);
    return;
}

const DEFAULT_GAS_PRICE = 2;
const to = process.argv[2];
const amount = process.argv[3];
const gasPrice = process.argv[4] || DEFAULT_GAS_PRICE;

if(!(to && amount)) {
    console.log(USAGE);
    return;
}

const contractPath = path.resolve(__dirname, 'contracts', 'C50.json'); //Creation of cross SO's path.
const mnemonicPath = path.resolve(__dirname, '.mnemonic');

if (!fs.existsSync(mnemonicPath)) {
    console.log(`A .mnemonic file is required in the same directory containing the wallet mnemonic of the sender`);
    console.log(USAGE);
    return;
}

if (!fs.existsSync(contractPath)) {
    console.log("The contract located at ./contracts/c50.json does not exist.\nYou can get it at https://github.com/kuczmama/c50/blob/master/build/contracts/C50.json");
    console.log(USAGE);
    return;
}

const source = JSON.parse(fs.readFileSync(contractPath));
const mnemonic = fs.readFileSync(mnemonicPath);
const abi = source.abi;
const bytecode = source.bytecode;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

if(!infuraProjectId) {
    throw "The environment variable INFURA_PROJECT_ID is required to be set";
}


// Connect to the network
let provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

// let provider = new ethers.providers.InfuraProvider('mainnet', infuraProjectId);

// Load the wallet to deploy the contract with
let wallet = ethers.Wallet.fromMnemonic(mnemonic.toString()).connect(provider);
var contract = new ethers.Contract('0x5274ABe031ECEB2dA4DF8E106eEeCEb044681485', abi, wallet);

if(!ethereumHelper.is_address(to)) {
    console.log(`To: ${to} is an invalid ethereum address`);
    console.log(USAGE);
    return;
}

if(isNaN(Number(amount))) {
    console.log(`Amount: ${amount} is not a number`);
    console.log(USAGE);
    return;
}

if(Number(amount) <= 0) {
    console.log("Amount must be greater than 0");
    console.log(USAGE)
    return;
}

if(gasPrice) {
    if(isNaN(Number(gasPrice))) {
        console.log(`GasPrice: ${gasPrice} is not a number`);
        console.log(USAGE);
        return;
    }

    if(Number(gasPrice) <= 0) {
        console.log("Gas Price must be greater than 0");
        console.log(USAGE)
        return;
    }
}

    let from = wallet.address;
    let balance = await contract.balanceOf(from);
    console.log("from balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());

    balance = await contract.balanceOf(to);
    console.log("to balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());

    var amountString = String(amount);
    var numberOfDecimals = 18;
    var numberOfTokens = ethers.utils.parseUnits(amountString, numberOfDecimals);
    let options = {
    gasPrice: ethers.utils.parseUnits(String(gasPrice), 'gwei'),
    };
    let transaction = await contract.transfer(to, numberOfTokens, options);
    console.log("transaction", transaction);
    balance = await contract.balanceOf(from);
    console.log("from balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());

    balance = await contract.balanceOf(to);
    console.log("to balance: ", Number(ethers.utils.formatEther(balance, {commify: true})).toLocaleString());
    
})();