# DGlovo
A decentralized Glovo running on ethereum

## How to run

### Frontend
Run `npm install` and then run `npm run serve` on the frontend folder.

### Solidity
Deploy the contract however you want (I used `truffle migrate` on the root folder), and then change the contract address on the "frontend/src/util/getContract.js" file with the address on which the contract was deployed.

Then you can use metamask to connect to the network where the contract is deployed and interact with it.
