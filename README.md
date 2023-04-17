# Supply Chain Management

I've created a Supply Chain Management smart contract that tracks the journey of goods and products from the manufacturer to the end-user while providing a secure and tamper-proof record of this journey on the blockchain. The contract includes a custom access control system that allows only the contract owner & approved employees to interact with the contract and make changes to it. There are functions to manage the supply chain of products and retrieve information about the products and the supply chain. This contract provides a secure and efficient way to manage the supply chain of products using blockchain technology.

[See Contract File](contracts/SupplyChainManagement.sol)

<!-- TABLE OF CONTENTS -->

  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#adding-or-removing-employees-to-be-approved">Adding or Removing Employees To Be Approved</a></li>
    <li><a href="#managing-the-supply-chain-of-products">Managing the Supply Chain of Products</a></li>
    <li><a href="#test-the-supplychainmanagement-contract">Test The SupplyChainManagement Contract</a></li>
    <li><a href="#additional-features-that-can-be-added">Additional Features That Can Be Added</a></li>
  </ol>

## Adding or Removing Employees To Be Approved

The contract includes a custom access control system that allows only a group of approved employees to interact with the contract and make changes to it. The onlyApprovedEmployee modifier is used to enforce this access control system, and the addApprovedEmployee and removeApprovedEmployee functions are used to add or remove an address from the list of approved employees. You can also get the approval status of any address using the getApprovedStatus function.

```shell
# Add employee approval:
function addApprovedEmployee(string memory _name, address _employeeAddress) public onlyApprovedEmployee

# Remove employee approval:
function removeApprovedEmployee(address employeeAddress) public onlyApprovedEmployee

# Get address approval status:
function getApprovedStatus(address _user) public view onlyApprovedEmployee returns(bool)
```

## Managing the Supply Chain of Products

The contract includes several functions to manage the supply chain of products, including the createProduct function to create a new product with a name, quantity, manufacturer, manufacturing date, and expiration date. The getProductDetails function can be used to see the details of a product. The checkExpiration function is used to see if a product has expired and updates accordingly, the transferProduct function is used to update the product's owner & location and the editProductDetails is used to change any other product's details. Once a product is sold, the product can be removed from the inventory count, listed as sold and include the buyer's details using the sellProduct function.

```shell
# Add product:
function createProduct(string memory _name, uint _quantity, string memory _manufacturer, uint _manufacturingDate, uint _expirationDate) public onlyApprovedEmployee

# Get product's details
function getProductDetails(uint _productId) public view onlyApprovedEmployee returns (Product memory)

# See product's expiration status and update accordingly
function checkExpiration(uint _productId) public onlyApprovedEmployee

# Transfer product's ownership & location
function transferProduct(uint _productId, address _newOwner, string memory _newLocation) public onlyApprovedEmployee

# Change any detail of the product
function editProductDetails(uint _productId, string memory _name, uint _quantity, string memory _manufacturer, uint _manufacturingDate, uint _expirationDate, string memory _location, address _currentOwner, bool _isSold) public onlyApprovedEmployee

# Update inventory count, list product as sold & update with buyer's details
function sellProduct(uint _productId, address _buyer, string memory _newLocation) public onlyApprovedEmployee
```

## Test The SupplyChainManagement Contract

First ensure you have Node.js installed, you can see if you have it installed by using the following command line prompt to see your Node.js version:

```shell
# Command Prompt (Windows)
node -- version

# Terminal (Mac)
node -v
```

If no Node.js version is shown then it's not installed. Click on the following link for Node.js's download page: [Node.js Download](https://nodejs.org/en/download)

Once you have Node.js installed, you can download or clone this repository and do the following:

```shell
# Install Hardhat:
npm i -D hardhat

# Run this and click enter 4 times:
npx hardhat

# Install dependencies:
npm install --save-dev @nomicfoundation/hardhat-chai-matchers
npm i -D @nomiclabs/hardhat-waffle

# Run the test file using:
npx hardhat test test/supply_chain_test.js
```

## Additional Features That Can Be Added

### Automated payments:

- One possible addition to the contract could be an automated payment system that is triggered when certain milestones in the supply chain are reached. For example, when a product reaches a specific store, the contract could automatically release payment to the manufacturer or distributor.

### Integration with IoT devices:

- Another addition could be the integration of Internet of Things (IoT) devices into the supply chain management system. Sensors could be placed on products to track their location, temperature, and other variables. This data could then be recorded on the blockchain, providing an even more detailed and accurate record of the supply chain journey.

### Integration with other systems:

- The SupplyChainManagement contract could be integrated with a customer relationship management (CRM) system to track customer orders and deliveries, or with a logistics system to optimize the delivery process.

### Environmental sustainability:

- The contract could also be modified to include metrics related to environmental sustainability. The carbon footprint of each product can be tracked to provide this information to customers.
