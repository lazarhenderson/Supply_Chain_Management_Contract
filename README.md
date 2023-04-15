# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## Problems with contract

1. Can only fetch products 1 at a time

- Use script to fetch products 1 by 1
- Can put products into an array for easier fetching
- Divide products by manufacturer's name which is mapped to an array of structs

## Functionality to be added:

1. If products are expired at creation
