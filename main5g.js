// Jupiterchain Dashboard (Futuristic UI)
// Insert your RPC and wallet address below
const rpcUrl = "https://greatest-solitary-seed.quiknode.pro/624c1fa77a92f1db1549ba3246d4d06c4afd7e79/";
const walletAddress = "0x2a63E334e71Cb80B857D4b5821e673C73Ce18a68";

async function loadData() {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const blockNumber = await provider.getBlockNumber();
    const balance = await provider.getBalance(walletAddress);
    const gasPrice = await provider.getGasPrice();

    document.getElementById("blockNumber").innerText = blockNumber;
    document.getElementById("balance").innerText = ethers.utils.formatEther(balance) + " ETH";
    document.getElementById("gasPrice").innerText = ethers.utils.formatUnits(gasPrice, "gwei") + " Gwei";
}

window.onload = loadData;
