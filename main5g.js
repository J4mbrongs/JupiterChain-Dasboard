// Deklarasikan provider RPC awal (untuk baca data umum tanpa dompet)
// Gunakan let, karena nanti bisa diupdate jika perlu untuk interaksi signer
let rpcProvider = new ethers.providers.JsonRpcProvider("https://greatest-solitary-seed.quiknode.pro/624c1fa77a92f1db1549ba3246d4d06c4afd7e79");
let currentAccount = null;
let web3Provider = null; // Tambahkan ini untuk provider dari MetaMask
let tokenContract = null; // Pindahkan deklarasi ke sini agar scope-nya luas

// 🧩 ERC-20 Contract Setup
const tokenAddress = "0xaE036c65C649172b43ef7156b009c6221B596B8b"; // ChatyFinal
const tokenABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newMessage",
				"type": "string"
			}
		],
		"name": "createMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deleteMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "initialMessage",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
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
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
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
		"name": "ERC20InvalidApprover",
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
		"name": "ERC20InvalidReceiver",
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
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "lockMessage",
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
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
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
		"inputs": [],
		"name": "resetAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
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
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
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
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
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
		"inputs": [],
		"name": "unlockMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "newMessage",
				"type": "string"
			}
		],
		"name": "updateMessage",
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
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"internalType": "address",
				"name": "account",
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
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct ChatyFinal.MessageLog[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMessage",
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
		"name": "totalSupply",
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


// 🌐 Block Number
async function fetchBlockNumber() {
    const block = await rpcProvider.getBlockNumber(); // Gunakan rpcProvider
    document.getElementById("blockNumber").innerText = `⛓️ Block Number: ${block}`;
}

// 💰 Balance (ETH)
async function fetchBalance() {
    const balance = await rpcProvider.getBalance("0x2a63E334e71Cb80B857D4b5821e673C73Ce18a68"); // Gunakan rpcProvider
    const eth = ethers.utils.formatEther(balance);
    document.getElementById("balance").innerText = `💰 Balance: ${parseFloat(eth).toFixed(4)} ETH`;
}

// ⛽ Gas Price
async function fetchGasPrice() {
    const gasPrice = await rpcProvider.getGasPrice(); // Gunakan rpcProvider
    const gwei = ethers.utils.formatUnits(gasPrice, "gwei");
    document.getElementById("gasPrice").innerText = `⛽ Gas Price: ${parseFloat(gwei).toFixed(2)} Gwei`;
}

// 🌐 Network Name
async function fetchNetworkName() {
    if (window.ethereum) {
        // Gunakan window.ethereum untuk mendapatkan chainId dari dompet yang terhubung
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        let networkName = '';

        switch (chainId) {
            case '0x89':
                networkName = 'Polygon Mainnet'; break;
            case '0x13881':
                networkName = 'Mumbai Testnet'; break;
            case '0x5':
                networkName = 'Goerli Testnet'; break;
            case '0x1':
                networkName = 'Ethereum Mainnet'; break;
            case '0x13882':
                networkName = 'Polygon Amoy'; break;
            default:
                networkName = `Unknown (${chainId})`;
        }

        document.getElementById("network").innerText = `🌐 Network: ${networkName}`;
    } else {
        // Jika MetaMask tidak terinstal, tampilkan info jaringan dari RPC provider
        const network = await rpcProvider.getNetwork();
        document.getElementById("network").innerText = `🌐 Network: ${network.name} (Chain ID: ${network.chainId})`;
    }
}

// 💰 Wallet Balance
async function fetchWalletBalance() {
  if (!currentAccount || !tokenContract) return;
  try {
    const balance = await tokenContract.balanceOf(currentAccount);
    const decimals = await tokenContract.decimals();
    const adjustedBalance = ethers.utils.formatUnits(balance, decimals);
    document.getElementById("walletBalance").innerText = `💰 Wallet Token: ${adjustedBalance} MCT`;
  } catch (error) {
    console.error("❌ Wallet Balance Error:", error);
  }
}

// 🪙 Fetch ERC-20 Token Data
async function fetchTokenData() {
  if (!tokenContract) return;
  try {
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    const supply = await tokenContract.totalSupply();
    const decimals = await tokenContract.decimals();
    const formattedSupply = ethers.utils.formatUnits(supply, decimals);

    document.getElementById("tokenName").innerText = `📛 Token: ${name}`;
    document.getElementById("tokenSymbol").innerText = `🔤 Symbol: ${symbol}`;
    document.getElementById("totalSupply").innerText = `📦 Supply: ${formattedSupply}`;
  } catch (error) {
    console.error("❌ Token Data Error:", error); // Log error spesifik
  }
}

async function fetchMessage() {
  if (!tokenContract) return;
  try {
    const msg = await tokenContract.getMessage();
    document.getElementById("message").innerText = `💌 Pesan: ${msg}`;
  } catch (error) {
    console.error("❌ Message Error:", error); // Log error spesifik
  }
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentAccount = accounts[0];
            document.getElementById("walletAddress").innerText = `👛 Wallet: ${currentAccount}`;

            const signer = web3Provider.getSigner();
            tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

            // Panggilan ini sekarang akan menemukan fungsinya karena sudah didefinisikan di atas
            fetchWalletBalance();
            fetchTokenData();
            fetchMessage();

            // Event listener tetap di sini
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    currentAccount = accounts[0];
                    document.getElementById("walletAddress").innerText = `👛 Wallet: ${currentAccount}`;
                    fetchWalletBalance();
                    fetchTokenData();
                    fetchMessage();
                } else {
                    currentAccount = null;
                    document.getElementById("walletAddress").innerText = `👛 Wallet: Not Connected`;
                    document.getElementById("walletBalance").innerText = `💰 Wallet Token: N/A`;
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                console.log("Chain changed to:", chainId);
                window.location.reload();
            });

        } catch (error) {
            console.error("❌ Error connecting to wallet:", error);
            if (error.code === 4001) {
                alert("Koneksi dompet ditolak oleh pengguna.");
            } else {
                alert("Terjadi kesalahan saat menghubungkan dompet. Lihat konsol untuk detail.");
            }
        }
    } else {
        alert("MetaMask (atau dompet Web3 lainnya) tidak terinstal. Silakan instal untuk melanjutkan.");
    }
}

// --- Inisialisasi Dashboard (tidak perlu diubah, tapi posisikan setelah fungsi-fungsi read-only) ---
async function initDashboard() {
    await fetchBlockNumber();
    await fetchBalance();
    await fetchGasPrice();
    await fetchNetworkName();
    // Panggilan yang bergantung pada koneksi dompet (fetchWalletBalance, fetchTokenData, fetchMessage)
    // tidak perlu di sini lagi karena sudah dipanggil di connectWallet.
}

setInterval(initDashboard, 15000);
window.onload = initDashboard;
