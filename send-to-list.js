(async function() {
try {
	const USAGE = `Usage: node ${process.argv[1]} [Path to list of addresses] [GasPrice]\n
	  	A path to the list of addresses is required, in 'csv' format.  It is in the format <ethereum address>,<amount>\n\
	  	For example addresses.csv:
	  	0x291B95B0882aB4EfaFfc94f81BAbE2E44D3fBb73,10
		0x94A0FB184fC54A5cc238d972F87ae30c47dbF071,20
	  	`;
	const fs = require('fs'); // Load the FileSystem Module.

	const path = require('path'); // Helps to find the path to the contract across whatever OS you are using form compile.js to xxx.sol files
	const ethers = require('ethers');
	const readline = require('readline');
	let ethereumHelper = require('./utils/ethereum');
	const shell = require('shelljs');

	const DEFAULT_GAS_PRICE = 2;


	function askQuestion(query) {
	    const rl = readline.createInterface({
	        input: process.stdin,
	        output: process.stdout,
	    });

	    return new Promise(resolve => rl.question(query, ans => {
	        rl.close();
	        resolve(ans);
	    }))
	}

	function loopThroughRows(csv, body) {
		csv.split("\n").map((rowString, i) => {
		let row = rowString.split(",");
		if(row.length < 2) {
			throw `Line ${i} does not have an address and an amount to send to`;
			console.log(USAGE);
			return;
		}
		let address = row[0];
		let amount = Number(row[1]);
			body(address, amount, i);
		});
		csv.toString()
	}


	const addressedPathInput = process.argv[2];
	const gasPrice = process.argv[3] || DEFAULT_GAS_PRICE;


	if(!!gasPrice) {
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
	    if(Number(gasPrice) > DEFAULT_GAS_PRICE) {
	    	let response = await askQuestion(`The gasPrice of ${gasPrice} is greater than the default gas price of 2 gwei, are you sure you want to continue?[YyNn]`);
	    	if(!(response === "y" || response === "Y")) {
	    		console.log("Aborting");
	    		return;
	    	}
	    }
	}

	if (!addressedPathInput) {
	  console.log(USAGE);
	  return;
	}

	const addressesPath = path.resolve(__dirname, addressedPathInput); //Creation of cross SO's path.
	if (!fs.existsSync(addressesPath)) {
	  console.log(USAGE);
	  return;
	}

	var csv = fs.readFileSync(addressesPath);
	if(!csv) {
		console.log(`${addressedPathInput} does not exist`);
		console.log(USAGE);
		return;
	}
	csv = csv.toString();

	console.log("Validating file for proper input...");

	let totalToSend = 0;
	let numAddresses = 0;
	loopThroughRows(csv, (address, amount, i) => {
		if(!ethereumHelper.is_address(address)) {
			throw `Line: ${i + 1}, Address: ${address} is an invalid ethereum address, please fix and run again`;
			console.log(USAGE);
			return;
		}
		if(amount <= 0) {
			throw `Line: ${i + 1}, cannot send a negative amount`;
			console.log(USAGE);
			return;
		}
		numAddresses += 1;
		totalToSend += amount;
	});

	console.log("File is valid, continuing...");

	let expectedPrompt = `send ${totalToSend} C50 to ${numAddresses} people`;
	let answer = await askQuestion(`You are about to ${expectedPrompt}\nWith a gas price of ${gasPrice} gwei\nAre you sure you want to continue? Please type "${expectedPrompt}" if you want to continue.\n`);
	if(answer === expectedPrompt) {
		console.log("Sending c50");
		loopThroughRows(csv, (address, amount, i) => {
		 shell.exec(`./send.sh ${address} ${amount} ${gasPrice}`);
		});
	} else {
		console.log(`Your answer did not equal "${expectedPrompt}" aborting, it equaled "${answer}`);
	}
} catch (exception) {
	console.error(exception);
}
})();
