// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract SupplyChainManagement {

    constructor (string memory _ownerName) {
        ApprovedEmployeesStruct storage newApprovedEmployeesStruct = approvedEmployees[msg.sender];
        newApprovedEmployeesStruct.name = _ownerName;
        newApprovedEmployeesStruct.isApproved = true;
    }

    modifier onlyApprovedEmployee() {
        require(approvedEmployees[msg.sender].isApproved, "Caller is not an approved employee.");
        _;
    } 

    struct Product {
        uint productId;
        string name;
        uint quantity;
        string manufacturer;
        uint manufacturingDate;
        uint expirationDate;
        string currentLocation;
        address currentOwner;
        bool isSold;
        bool isExpired;
    }

    struct ApprovedEmployeesStruct {
        string name;
        bool isApproved;
    }

    mapping(address => ApprovedEmployeesStruct) approvedEmployees;
    mapping (uint => Product) products;
    uint public aggregateProductCount;
    uint public inventoryProductCount;

    event ProductCreated(uint indexed productId, string name, uint quantity, string manufacturer, uint manufacturingDate, uint expirationDate);
    event ProductEdited(uint indexed _productId, string _name, uint _quantity, string _manufacturer, uint _manufacturingDate, uint _expirationDate, bool _isExpired, string _location, address _currentOwner, bool _isSold);
    event ProductTransferred(uint indexed productId, address indexed previousOwner, address indexed newOwner, string newLocation);
    event ProductSold(uint indexed productId, address indexed seller, address indexed buyer, string newLocation);
    event ProductExpired(uint indexed productId, string message);

    ////////////////////////////////////////////////////////
    /////////////////   Manage Employees   /////////////////
    ////////////////////////////////////////////////////////

    // Approve an employee
    function addApprovedEmployee(string memory _name, address _employeeAddress) public onlyApprovedEmployee {

        // Create "ApprovedEmployeesStruct" struct and "storage" to store data inside this contract
        // Create temporary name "newUserName" which is used to update storage values of struct
        // note that address mapping is set by names[msg.sender]
        ApprovedEmployeesStruct storage newApprovedEmployeesStruct = approvedEmployees[_employeeAddress];
        newApprovedEmployeesStruct.name = _name;
        newApprovedEmployeesStruct.isApproved = true;

    }

    // Remove an approved employee
    function removeApprovedEmployee(address employeeAddress) public onlyApprovedEmployee {
        delete approvedEmployees[employeeAddress];
    }

    // See address approval status
    function getApprovedStatus(address _user) public view returns(bool) {
        return approvedEmployees[_user].isApproved;
    }

    ///////////////////////////////////////////////////////
    /////////////////   Manage Products   /////////////////
    ///////////////////////////////////////////////////////

    function createProduct(string memory _name, uint _quantity, string memory _manufacturer, uint _manufacturingDate, uint _expirationDate) public onlyApprovedEmployee {
        aggregateProductCount++;
        inventoryProductCount++;
        products[aggregateProductCount] = Product(aggregateProductCount, _name, _quantity, _manufacturer, _manufacturingDate, _expirationDate, "Cape Town HQ", msg.sender, false, false);
        emit ProductCreated(aggregateProductCount, _name, _quantity, _manufacturer, _manufacturingDate, _expirationDate);
    }

    function transferProduct(uint _productId, address _newOwner, string memory _newLocation) public onlyApprovedEmployee {
        products[_productId].currentOwner = _newOwner;
        products[_productId].currentLocation = _newLocation;
        emit ProductTransferred(_productId, msg.sender, _newOwner, _newLocation);
    }

    function sellProduct(uint _productId, address _buyer, string memory _newLocation) public onlyApprovedEmployee {
        require(!products[_productId].isSold, "The product has already been sold.");
        inventoryProductCount--;
        products[_productId].isSold = true;
        products[_productId].currentOwner = _buyer;
        products[_productId].currentLocation = _newLocation;
        emit ProductSold(_productId, msg.sender, _buyer, _newLocation);
    }

    function editProductDetails(uint _productId, string memory _name, uint _quantity, string memory _manufacturer, uint _manufacturingDate, uint _expirationDate, string memory _location, address _currentOwner, bool _isSold) public onlyApprovedEmployee {
        products[_productId].name = _name;
        products[_productId].quantity = _quantity;
        products[_productId].manufacturer = _manufacturer;
        products[_productId].manufacturingDate = _manufacturingDate;
        products[_productId].expirationDate = _expirationDate;
        products[_productId].currentLocation = _location;
        products[_productId].currentOwner = _currentOwner;
        products[_productId].isSold = _isSold;

        bool _isExpired;
        if (block.timestamp >= _expirationDate) {
            _isExpired = false;
            products[_productId].isExpired = _isExpired;
        } else {
            _isExpired = true;
            products[_productId].isExpired = _isExpired;
        }

        emit ProductEdited(_productId, _name, _quantity, _manufacturer, _manufacturingDate, _expirationDate, _isExpired, _location, _currentOwner, _isSold);
    }


    ////////////////////////////////////////////////////////
    /////////////////   Get Product Data   /////////////////
    ////////////////////////////////////////////////////////

    function checkExpiration(uint _productId) public onlyApprovedEmployee {
        require(block.timestamp >= products[_productId].expirationDate, "The product has not expired yet.");
        require(!products[_productId].isExpired, "The product has already expired.");
        products[_productId].isExpired = true;
        emit ProductExpired(_productId, "The product has expired.");
    }

    function getProduct(uint _productId) public view onlyApprovedEmployee returns (
        uint productId,
        string memory name,
        uint quantity,
        string memory manufacturer,
        uint manufacturingDate,
        uint expirationDate,
        string memory currentLocation,
        address currentOwner,
        bool isSold,
        bool isExpired
    ) {
        Product memory product = products[_productId];
        return (
            product.productId,
            product.name,
            product.quantity,
            product.manufacturer,
            product.manufacturingDate,
            product.expirationDate,
            product.currentLocation,
            product.currentOwner,
            product.isSold,
            product.isExpired
        );
    }

    function getProductNew(uint _productId) public view onlyApprovedEmployee returns (Product memory) {
        return products[_productId];
    }
}




