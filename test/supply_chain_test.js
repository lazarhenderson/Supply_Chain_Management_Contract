const { expect } = require("chai");

describe("Supply Chain Management Contract", function () {
  let SupplyChainManagement;
  let supplyChainManagement;
  let owner;
  let approvedEmployee1;
  let approvedEmployee2;
  let unapprovedEmployee;

  beforeEach(async function () {
    SupplyChainManagement = await ethers.getContractFactory(
      "SupplyChainManagement"
    );
    [owner, approvedEmployee1, approvedEmployee2, unapprovedEmployee] =
      await ethers.getSigners();
    supplyChainManagement = await SupplyChainManagement.deploy("Lazar");
    await supplyChainManagement.deployed();
  });
  describe("addApprovedEmployee()", function () {
    it("Add More Approved Employees to the Contract", async function () {
      // Approve first employee as owner (Lazar)
      await supplyChainManagement
        .connect(owner)
        .addApprovedEmployee("Bob", approvedEmployee1.address);

      // Approve second employee from first approved employee (Bob)
      await supplyChainManagement
        .connect(approvedEmployee1)
        .addApprovedEmployee("Sally", approvedEmployee2.address);

      const isApproved_Bob = await supplyChainManagement.getApprovedStatus(
        approvedEmployee1.address
      );
      const isApproved_Sally = await supplyChainManagement.getApprovedStatus(
        approvedEmployee2.address
      );

      expect(isApproved_Bob).to.equal(true);
      expect(isApproved_Sally).to.equal(true);
    });

    it("Should Revert if Called by a Non-Approved Employee", async function () {
      await expect(
        supplyChainManagement
          .connect(unapprovedEmployee)
          .addApprovedEmployee("Luke", unapprovedEmployee.address)
      ).to.be.revertedWith("Caller is not an approved employee.");
    });
  });

  describe("createProduct()", function () {
    it("should create a new product", async function () {
      await supplyChainManagement.createProduct(
        "Product 1",
        10,
        "Manufacturer 1",
        1630435200,
        1661971200
      );
      const product = await supplyChainManagement.getProduct(1);
      expect(product.name).to.equal("Product 1");
      expect(product.quantity).to.equal(10);
      expect(product.manufacturer).to.equal("Manufacturer 1");
      expect(product.manufacturingDate).to.equal(1630435200);
      expect(product.expirationDate).to.equal(1661971200);
    });

    it("should revert if called by a non-approved employee", async function () {
      await expect(
        supplyChainManagement
          .connect(unapprovedEmployee)
          .createProduct(
            "Product 1",
            10,
            "Manufacturer 1",
            1630435200,
            1661971200
          )
      ).to.be.revertedWith("Caller is not an approved employee.");
    });
  });
});
