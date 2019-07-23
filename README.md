# c50-sender

Send C50 to a list of addresses

How to use:

1. Install [nodejs](https://nodejs.org/en/download/)
2. Download the needed c50-sender files
```
git clone git@github.com:C50Index/c50-sender.git
```

Or you can go to https://github.com/C50Index/c50-sender and click the `Download ZIP` button, from the green `Clone or download` button.
3. Navigate to the `c50-sender` files using the command line.
4. Create a `mnemonic.txt` file, with your mnemonic phrase, with each word separated by a space.  See `mnemonic.example.txt` for an example.
5. Set the environment variable INFURA_PROJECT_ID to your infura project id.  You can create one at https://infura.io/
6. Create the csv file for sending in the format [address],[amount].
Example:
```csv
// list.csv
0x291B95B0882aB4EfaFfc94f81BAbE2E44D3fBb73,10
0x94A0FB184fC54A5cc238d972F87ae30c47dbF071,20
```
7. Run the script to send the c50
Usage:
```sh
$ node ./send-to-list.js [Path to csv] [Gas price gwei]
```

Example:
```sh
$ node ./send-to-list.js list.csv 2
Validating file for proper input...
File is valid, continuing...
You are about to send 30 C50 to 2 people
With a gas price of 2 gwei
Are you sure you want to continue? Please type "send 30 C50 to 2 people" if you want to continue.
send 30 C50 to 2 people
Sending c50
Sent 10 C50 to 0x291B95B0882aB4EfaFfc94f81BAbE2E44D3fBb73, your balance=9,999,506 C50
Sent 20 C50 to 0x94A0FB184fC54A5cc238d972F87ae30c47dbF071, your balance=9,999,486 C50
```


**Note**: the default gas price is 2 gwei.
