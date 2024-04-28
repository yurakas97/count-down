
var humorButton = document.querySelector(".button-joke");
var connectButton = document.querySelector(".wallet-conect");
var faucetInfo = document.querySelector(".faucet-info");
var faucetButton = document.querySelector(".faucet");
var firstLine = document.getElementsByClassName("text-setup")[0];
var secondLine = document.getElementsByClassName("text-punch")[0];
var jokeBox = document.getElementsByClassName("joke-box")[0];
var nftButton = document.getElementsByClassName("button-nft")[0];

var timeOutVar;
var requiredNetworkId;
let web3;
var isWalletConnected = false;
var timer1;


// Адрес контракту
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

const contractAddress_Nft = "";
const contractABI_Nft = "";

var contract;
var contractNFT;

nftButton.addEventListener("click", function () {
    if (nftButton.classList.contains("button-nft__active")) {
        if (isWalletConnected) mintNft()
        console.log("nft")
    }
});

humorButton.addEventListener("click", function () {
    if (isWalletConnected) payForService()
    console.log("joke")
});

connectButton.addEventListener("click", function () {
    if (!isWalletConnected) walletConnect()
    if (isWalletConnected) walletDisconnect()
});

faucetButton.addEventListener("click", function () {
    clearTimeout(timer1);
    faucetInfo.classList.toggle("hidden")
    timer1 = setTimeout(function () {
        faucetInfo.classList.add("hidden");
    }, 12000)
});

document.addEventListener("click", function (event) {
    clearTimeout(timer1);
    if (event.target !== faucetInfo && event.target !== faucetButton) faucetInfo.classList.add("hidden")
});

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

            jokeBox.style.boxShadow = "0px 0px 20px 7px rgba(148, 206, 0, 1)";
            firstLine.textContent = data.setup;

            timeOutVar = setTimeout(function () {
                secondLine.textContent = data.punchline;
                humorButton.textContent = "ANOTHER ONE";
                nftButton.classList.add("button-nft__active");
            }, 3000)

            // Do something with the value
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });


    return
}

function walletDisconnect() {
    connectButton.textContent = "Connect wallet";
    isWalletConnected = false;
}

async function walletConnect() {
    console.log("wallet")
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        // Використання MetaMask провайдера
        web3 = await new Web3(window.ethereum);
        // Запит на підключення акаунта MetaMask
        await window.ethereum.enable();
        isWalletConnected = true;

    } else {
        console.error('MetaMask not detected');
    }
    contract = await new web3.eth.Contract(contractABI, contractAddress);
    //contractNFT = await new web3.eth.Contract(contractABI_Nft, contractAddress_Nft);
    checkNetwork()
    connectButton.textContent = "Disconnect"
}

// Функція для виклику контракту при натисканні на кнопку
async function payForService() {
    const accounts = await web3.eth.getAccounts();

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

async function mintNft() {
    const accounts = await web3.eth.getAccounts();
    alert("this feature under development")
    return
}

// Отримайте інформацію про обрану мережу в MetaMask
async function getSelectedNetwork() {
    try {
        const networkId = await web3.eth.net.getId();
        return networkId;
    } catch (error) {
        console.error('Error getting network ID:', error.message);
        return null;
    }
}

// Перевірте, чи обрана мережа відповідає вашим вимогам
function checkNetwork() {
    const requiredNetworkId = 8073763; // ID потрібної мережі (1 для mainnet)

    // Спробуйте переключитись на потрібну мережу
    switchToRequiredNetwork(requiredNetworkId).then((success) => {
        if (!success) {
            // Якщо переключення не вдалося, спробуйте додати мережу
            addAndSwitchToNetwork(requiredNetworkId);
        }
    });
    return true
}

// Функція для переключення на задану мережу
function switchToRequiredNetwork(requiredNetworkId) {
    return new Promise((resolve) => {
        getSelectedNetwork().then((networkId) => {
            if (networkId !== null && networkId !== requiredNetworkId) {
                // Запит на переключення мережі
                window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${requiredNetworkId.toString(16)}` }],
                }).then(() => {
                    console.log('Network switched successfully');
                    resolve(true);
                }).catch((error) => {
                    console.error('Error switching network:', error.message);
                    resolve(false);
                });
            } else {
                // Вже на потрібній мережі
                resolve(true);
            }
        });
    });
}

// Функція для додавання та переключення на задану мережу
function addAndSwitchToNetwork(requiredNetworkId) {
    // Отримайте інформацію про мережу для додавання та переключення
    const networkInfo = {
        chainId: `0x${requiredNetworkId.toString(16)}`, // Hex формат ID мережі
        chainName: 'yurakas_8073763-1',
        nativeCurrency: {
            name: 'KAS',
            symbol: 'KAS',
            decimals: 18,
        },
        rpcUrls: ['https://froopyland.dymension.xyz/26/yurakas_8073763-1-b/evmrpc'], // Замініть на свій Infura Project ID
        blockExplorerUrls: null,
    };

    // Додайте та переключіться на мережу
    window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkInfo],
    }).then(() => {
        console.log('Network added successfully');
        // Переключення на додану мережу
        switchToRequiredNetwork(requiredNetworkId);
    }).catch((error) => {
        console.error('Error adding network:', error.message);
    });
}

// Викличте перевірку мережі
checkNetwork();

async function checkBalance() {

    contract.methods.getContractBalance().call()
        .then(balance => {
            console.log('Баланс контракту:', balance);
        })
        .catch(error => {
            console.error('Помилка:', error);
        });
} 
