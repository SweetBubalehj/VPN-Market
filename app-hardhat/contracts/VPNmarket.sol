// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VPNmarket is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint _days = 1 days;
    uint _gwei = 1 gwei;

    struct UserPlan {
        uint tokenID;
        uint startTime;
        uint endTime;
    }

    struct Plan {
        uint price;
        uint period;
    }

    mapping(address => UserPlan) public addressToPlan;
    Plan[] public planList;

    event PlanUpdate(uint indexed planIndex, uint planPrice, uint planPeriod);
    event PlanPurchase(address userAddres, uint planIndex);

    // ipfs://.../
    string ipfsBaseURI;

    constructor(string memory ipfsURI) ERC721("VPN Market", "VPNM") {
        ipfsBaseURI = ipfsURI;
    }

    /**
     * @dev Function for buying plan and minting NFT.
     * @param planIndex number of index in plan list
     *
     * Requirements:
     * - `index` - cannot be out of bounds of array.
     * - `endTime` - cannot be more than current time.
     * - `amount` - must be equal to plan price.
     */
    function buyPlan(uint planIndex) public payable {
        address user = msg.sender;
        uint amount = msg.value;
        uint currentTime = block.timestamp;

        require(planIndex < planList.length, "Index is out of bounds");
        require(addressToPlan[user].endTime < currentTime, "Plan is active");
        require(amount == planList[planIndex].price, "Insufficient amount");

        uint _endTime = currentTime + planList[planIndex].period;
        uint _tokenID = totalSupply() + 1;
        _safeMint(user, _tokenID);

        addressToPlan[user].tokenID = _tokenID;
        addressToPlan[user].startTime = currentTime;
        addressToPlan[user].endTime = _endTime;
    }

    /**
     * @dev Function for adding plan requirements.
     * @param _price amount of gwei for plan
     * @param _dayPeriod days period of plan
     */
    function addPlan(uint _price, uint _dayPeriod) public onlyOwner {
        planList.push(Plan(_price * _gwei, _dayPeriod * _days));

        emit PlanUpdate(planList.length, _price, _dayPeriod);
    }

    /**
     * @dev Function for changing plan requirements.
     * @param index number of index in plan list
     * @param _price amount of ethers for plan
     * @param _dayPeriod time period of plan
     *
     * Requirements:
     * - `index` - cannot be out of bounds of array.
     */
    function changePlan(
        uint index,
        uint _price,
        uint _dayPeriod
    ) public onlyOwner {
        require(index < planList.length, "Index is out of bounds");

        planList[index] = Plan(_price * _gwei, _dayPeriod * _days);

        emit PlanUpdate(planList.length, _price, _dayPeriod);
    }

    /**
     * @dev Function to remove plan from plan list.
     * @param index number of index in plan list
     *
     * Requirements:
     * - `index` - cannot be out of bounds of array.
     */
    function removePlan(uint index) public onlyOwner {
        require(index < planList.length, "Index is out of bounds");

        planList[index] = planList[planList.length - 1];

        planList.pop();

        emit PlanUpdate(planList.length + 1, 0, 0);
    }

    /**
     * @dev Function for getting Plan List. Since Solidity 0.8.0 we cannot return Struct Arrays.
     * To avoid this issue, we can return `price` and `period` arrays.
     */
    function getPlanList() public view returns (uint[] memory, uint[] memory) {
        uint[] memory prices = new uint[](planList.length);
        uint[] memory periods = new uint[](planList.length);

        for (uint i = 0; i < planList.length; i++) {
            prices[i] = planList[i].price;
            periods[i] = planList[i].period;
        }

        return (prices, periods);
    }

    /**
     * @dev See {ERC721-_baseURI}.
     */
    function _baseURI() internal view override returns (string memory) {
        return ipfsBaseURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
        return _baseURI();
    }

    /**
     * @dev Function for changing base URI value.
     * @param _newBaseURI new base URI value
     */
    function changeBaseURI(string memory _newBaseURI) public onlyOwner {
        ipfsBaseURI = _newBaseURI;
    }

    /**
     * @dev See {ERC721-_beforeTokenTransfer}.
     * Function for Non-transferable NFT. It is restricted to transfer VPN plan nft.
     *
     * Requirements:
     * - `from` - must be a zero address.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(
            from == address(0),
            "NonTransferableERC721: Tokens are non-transferable"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @dev Function to withdraw smart contract balance. Only owner can withdraw ethers.
     *
     * Requirements:
     * - `success` - cannot be false.
     */
    function withdraw() public onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}
