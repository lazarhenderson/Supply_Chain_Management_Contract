const { expect } = require("chai");

describe("SupplyChainManagement", function () {
  let SupplyChainManagement;
  let supplyChainManagement;
  let owner;
  let approvedEmployee1;
  let approvedEmployee2;
  let unapprovedEmployee;

  it("Deploy the Supply Chain Contract & Set Approved Owner", async function () {
    SupplyChainManagement = await ethers.getContractFactory(
      "SupplyChainManagement"
    );
    [owner, approvedEmployee1, approvedEmployee2, unapprovedEmployee] =
      await ethers.getSigners();
    supplyChainManagement = await SupplyChainManagement.deploy("Lazar");
    await supplyChainManagement.deployed();
  });

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
