//const Web3 = require('web3');



var humorButton = document.querySelector(".button");
var firstLine = document.getElementsByClassName("text-setup")[0];
var secondLine = document.getElementsByClassName("text-punch")[0];
var timeOutVar;


humorButton.addEventListener("click", payForService)

function getHumor() {

    firstLine.textContent = "";
    secondLine.textContent = "";
    clearTimeout(timeOutVar)

    const apiUrl = 'https://official-joke-api.appspot.com/random_joke';

    // Use the fetch() function to make a GET request to the API
    fetch(apiUrl)
        .then(response => {
            // Check if the response status is OK (200)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the response body as JSON
            return response.json();
        })
        .then(data => {

            firstLine.textContent = data.setup;

            timeOutVar = setTimeout(function () {
                secondLine.textContent = data.punchline;
            }, 3000)

            // Do something with the value
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });


    return
}


// Підключення бібліотеки Web3.js, якщо вона встановлена локально через npm

// Перевірка наявності Web3
let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Використання MetaMask провайдера
    web3 = new Web3(window.ethereum);
    // Запит на підключення акаунта MetaMask
    window.ethereum.enable();
} else {
    console.error('MetaMask not detected');
}



// Адреса контракту
const contractAddress = '0x5a0c31f5e5cb196b9a71e6250e36030078e2800a';  // Замініть на адресу свого контракту
// Або використовуйте абстракцію контракту
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_serviceCost",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "payer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ServicePaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Withdrawal",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payService",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "serviceCost",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];  // Замініть на ваш ABI
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Функція для виклику контракту при натисканні на кнопку
async function payForService() {
    const accounts = await web3.eth.getAccounts();
    console.log("start")

    try {
        const result = await contract.methods.payService().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether'), // Замініть на вашу вартість послуги
        });

        console.log('Transaction successful:', result);
        getHumor()
    } catch (error) {
        console.error('Transaction failed:', error.message);
    }
}
