// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RandomizerService {
    address public owner;
    uint public serviceCost;

    event ServicePaid(address indexed payer, uint amount);
    event Withdrawal(address indexed owner, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(uint _serviceCost) {
        owner = msg.sender;
        serviceCost = _serviceCost;
    }

    // Функція для оплати послуги рандомайзера
    function payService() external payable {
        require(msg.value >= serviceCost, "Insufficient funds");

        // Якщо відправлено більше коштів, ніж необхідно, повертаємо зайві
        if (msg.value > serviceCost) {
            payable(msg.sender).transfer(msg.value - serviceCost);
        }

        // Відправляємо вартість послуги власнику контракту
        payable(owner).transfer(serviceCost);

        // Відправляємо подію про оплату послуги
        emit ServicePaid(msg.sender, serviceCost);
    }

    // Функція для зняття коштів з контракту власником
    function withdrawFunds(uint amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        payable(owner).transfer(amount);

        // Відправляємо подію про зняття коштів
        emit Withdrawal(owner, amount);
    }

    // Функція для отримання балансу контракту
    function getContractBalance() external view returns (uint) {
        return address(this).balance;
    }
}
