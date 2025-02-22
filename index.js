
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
let accounts;
var isWalletConnected = false;
var timer1;
let joke;


// Адрес контракту
const contractAddress = '0xa13421d8b256d45210f6359488054fe63624fc13';  // Замініть на адресу свого контракту
// Або використовуйте абстракцію контракту
const contractABI = [
    {
        "inputs": [],
        "name": "payService",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
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
    }
] // Замініть на ваш ABI

const faucetContractAddress = "0x0b194450cedba2bf5b026d8ae5bdd7c9287cf79d";
const faucetABI = [
    {
        "inputs": [],
        "name": "amountPerRequest",
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
        "name": "depositTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCoins",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getFaucetBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress_Nft = "0x8704da482afaf28bcc8cd47da40ece3a2e041620";
const contractABI_Nft = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "joke",
                "type": "string"
            }
        ],
        "name": "mintJokeNFT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
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
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
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
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256"
            }
        ],
        "name": "BatchMetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "MetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getJokeMetadata",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "jokeMetadata",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
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
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenCounter",
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
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

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

faucetButton.addEventListener("click", async function () {
    if (!isWalletConnected) return
    //clearTimeout(timer1);
    faucetInfo.classList.toggle("hidden")
    // timer1 = setTimeout(function () {
    //     faucetInfo.classList.toggle("hidden");
    // }, 12000)

    const contractAddress = '0x0b194450cedba2bf5b026d8ae5bdd7c9287cf79d'; // Замість надайте адресу вашого контракту
    const contractABI = [
        {
            "inputs": [],
            "name": "amountPerRequest",
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
            "name": "depositTokens",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getCoins",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getFaucetBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    try {
        const tx = await contract.methods.getCoins().send({ from: userAccount });
        console.log("ok")
        faucetInfo.classList.toggle("hidden");
        faucetButton.classList.add("used");
    } catch (error) {
        console.log(`not ok -- ${error}`);
        faucetInfo.classList.toggle("hidden");
    }
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

            joke = `${data.setup}----${data.punchline}`;
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
    accounts = await web3.eth.getAccounts();
    let address = accounts[0];
    connectButton.textContent = `${address.slice(-4).toLowerCase()} | Disconnect`;
}

// Функція для виклику контракту при натисканні на кнопку
async function payForService() {
    const accounts = await web3.eth.getAccounts();

    try {
        const result = await contract.methods.payService().send({
            from: accounts[0],
            value: web3.utils.toWei('10000', 'ether'), // Замініть на вашу вартість послуги
        });

        console.log('Transaction successful:', result);

        //const balance = await contract.methods.getContractBalance().call();
        //console.log(`Баланс контракту: ${web3.utils.fromWei(balance, 'ether')} ETH`);
        getHumor()
    } catch (error) {
        console.error('Transaction failed:', error.message);
    }
}

async function mintNft() {
    try {
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        contractNFT = await new web3.eth.Contract(contractABI_Nft, contractAddress_Nft);
        let gasEstimate = await contractNFT.methods.mintJokeNFT(userAddress, "joke").estimateGas({ from: userAddress });
        let receipt = await contractNFT.methods.mintJokeNFT(userAddress, "joke").send({ from: userAddress, gas: gasEstimate });
        console.log("NFT minted:", receipt);
        let NftId = receipt.events.Transfer.returnValues.tokenId.toString();
        console.log(NftId)
        //return
    } catch (er) {
        console.log(`error while mint ${er}`)
    }
    //let jokeMetadata = await contractNFT.methods.getJokeMetadata(8).call();
    //console.log("Joke Metadata: ", jokeMetadata);
}

// Отримайте інформацію про обрану мережу в MetaMask
async function getSelectedNetwork() {
    try {
        const networkId = await web3.eth.net.getId();
        return networkId;
    } catch (error) {
        console.error('Error getting network ID:', error.message);
        return 1;
    }
}

// Перевірте, чи обрана мережа відповідає вашим вимогам
function checkNetwork() {
    const requiredNetworkId = 335727; // ID потрібної мережі (1 для mainnet)

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
        chainName: 'British Humor',
        nativeCurrency: {
            name: 'JKE',
            symbol: 'JKE',
            decimals: 18,
        },
        rpcUrls: ['https://evm.yurakas97.xyz'], // Замініть на свій Infura Project ID
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
