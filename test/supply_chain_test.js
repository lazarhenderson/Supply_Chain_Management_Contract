const { expect } = require("chai");

describe("Supply Chain Management Contract", function () {
  it("Deploy SupplyChainManagement Contract & Set Owner", async function () {
    [
      owner,
      approvedEmployee1,
      approvedEmployee2,
      unapprovedEmployee,
      newProductOwner,
      productBuyer,
    ] = await ethers.getSigners();

    const SupplyChainManagement = await ethers.getContractFactory(
      "SupplyChainManagement"
    );
    const supplyChainManagement = await SupplyChainManagement.deploy("Lazar");
    this.supplyChainManagement = await supplyChainManagement.deployed();
  });

  it("Should Revert if Called by a Non-Approved Employee", async function () {
    await expect(
      this.supplyChainManagement
        .connect(unapprovedEmployee)
        .addApprovedEmployee("Luke", unapprovedEmployee.address)
    ).to.be.revertedWith("Caller is not an approved employee.");
  });

  it("addApprovedEmployee() - Add 2 Approved Employees to the Contract", async function () {
    // Approve first employee as owner (Lazar)
    await this.supplyChainManagement
      .connect(owner)
      .addApprovedEmployee("Bob", approvedEmployee1.address);

    // Approve second employee from first approved employee (Bob)
    await this.supplyChainManagement
      .connect(approvedEmployee1)
      .addApprovedEmployee("Sally", approvedEmployee2.address);

    const isApproved_Bob = await this.supplyChainManagement.getApprovedStatus(
      approvedEmployee1.address
    );
    const isApproved_Sally = await this.supplyChainManagement.getApprovedStatus(
      approvedEmployee2.address
    );

    expect(isApproved_Bob).to.equal(true);
    expect(isApproved_Sally).to.equal(true);
  });

  it("createProduct() - Create 3 New Products", async function () {
    // Get the current date
    const currentDate = new Date();
    // Add 3 months to the current date
    const futureDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 3,
      currentDate.getDate()
    );
    expiredDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      currentDate.getDate()
    );
    // Convert the date to a Unix timestamp
    timestamp_future = Math.floor(futureDate.getTime() / 1000);
    this.timestamp_expired = Math.floor(expiredDate.getTime() / 1000);
    timestamp_now = Math.floor(currentDate.getTime() / 1000);

    // Create 2 products - 2 unexpired, one expired
    await this.supplyChainManagement
      .connect(approvedEmployee1)
      .createProduct(
        "Product 1",
        10,
        "Manufacturer 1",
        timestamp_now,
        timestamp_future
      );
    await this.supplyChainManagement
      .connect(approvedEmployee2)
      .createProduct(
        "Product 2",
        100,
        "Manufacturer 2",
        timestamp_now,
        this.timestamp_expired
      );
    await this.supplyChainManagement
      .connect(approvedEmployee1)
      .createProduct(
        "Product 3",
        70,
        "Manufacturer 1",
        timestamp_now,
        timestamp_future
      );

    product1_unexpired = await this.supplyChainManagement.getProductDetails(1);
    expect(product1_unexpired.name).to.equal("Product 1");
    expect(product1_unexpired.quantity).to.equal(10);
    expect(product1_unexpired.manufacturer).to.equal("Manufacturer 1");
    expect(product1_unexpired.manufacturingDate).to.equal(timestamp_now);
    expect(product1_unexpired.expirationDate).to.equal(timestamp_future);
    expect(product1_unexpired.isExpired).to.equal(false);

    product2_expired = await this.supplyChainManagement.getProductDetails(2);
    expect(product2_expired.name).to.equal("Product 2");
    expect(product2_expired.quantity).to.equal(100);
    expect(product2_expired.manufacturer).to.equal("Manufacturer 2");
    expect(product2_expired.manufacturingDate).to.equal(timestamp_now);
    expect(product2_expired.expirationDate).to.equal(this.timestamp_expired);
    expect(product2_expired.isExpired).to.equal(false);
  });

  it("checkExpiration() - Test if Products are Expired", async function () {
    // Product 1 + 3 is unexpired
    await expect(
      this.supplyChainManagement.checkExpiration(1)
    ).to.be.revertedWith("The product has not expired yet.");
    await expect(
      this.supplyChainManagement.checkExpiration(3)
    ).to.be.revertedWith("The product has not expired yet.");
    // Product 2 expired
    await this.supplyChainManagement.checkExpiration(2);

    product1 = await this.supplyChainManagement.getProductDetails(1);
    product2 = await this.supplyChainManagement.getProductDetails(2);

    expect(product1.isExpired).to.equal(false);
    expect(product2.isExpired).to.equal(true);
  });

  it("transferProduct() - Test if Expired Product can Transfer Ownership", async function () {
    // Transfer product 2
    await this.supplyChainManagement.transferProduct(
      2,
      newProductOwner.address,
      "Johannesburg HQ"
    );

    product2 = await this.supplyChainManagement.getProductDetails(2);

    expect(product2.currentLocation).to.equal("Johannesburg HQ");
  });

  it("sellProduct() - Test if Product can be Sold", async function () {
    // Transfer product 2
    await this.supplyChainManagement.sellProduct(
      1,
      productBuyer.address,
      "22 Test Way, Place To Be"
    );

    product1 = await this.supplyChainManagement.getProductDetails(1);

    expect(product1.currentOwner).to.equal(productBuyer.address);
    expect(product1.currentLocation).to.equal("22 Test Way, Place To Be");
    expect(product1.isSold).to.equal(true);
  });

  it("editProductDetails() - Test if Product can be Sold", async function () {
    product3 = await this.supplyChainManagement.getProductDetails(3);
    _name = product3.name;
    _quantity = product3.quantity;
    _manufacturer = product3.manufacturer;
    _manufacturingDate = product3.manufacturingDate;
    _expirationDate = product3.expirationDate;
    _currentLocation = product3.currentLocation;
    _currentOwner = product3.currentOwner;
    _isSold = product3.isSold;
    _isExpired = product3.isExpired;

    newQuantity = 55;
    newManufacturerName = "Manufacturer 3";
    newManufacturedDate = this.timestamp_expired;
    // Edit details for product 3
    await this.supplyChainManagement.editProductDetails(
      3,
      _name,
      newQuantity,
      newManufacturerName,
      newManufacturedDate,
      _expirationDate,
      _currentLocation,
      _currentOwner,
      _isSold
    );
  });

  it("getApprovedStatus() - See if Employee2 Approval Status is True", async function () {
    expect(
      await this.supplyChainManagement.getApprovedStatus(
        approvedEmployee2.address
      )
    ).to.equal(true);
  });

  it("removeApprovedEmployee() - Remove Employee2 Approval Status", async function () {
    await this.supplyChainManagement.removeApprovedEmployee(
      approvedEmployee2.address
    );

    expect(
      await this.supplyChainManagement.getApprovedStatus(
        approvedEmployee2.address
      )
    ).to.equal(false);
  });
});
