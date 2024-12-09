import { ethers } from "./ethers-6.7.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const totalFunded = document.getElementById("totalFunded");
totalFunded.textContent = "..."
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance


async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)
      totalFunded.textContent = ethers.formatEther(balance);
    } catch (error) {
      console.log(error)
      alert(error)
    }
    connectButton.innerHTML = "Connected"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      console.log("Processing transaction...")
      const transactionResponse = await contract.withdraw()
      await transactionResponse.wait(1)
      console.log("Done!")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)
      totalFunded.textContent = ethers.formatEther(balance);
    } catch (error) {
      console.log(error)
      alert(error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
      await transactionResponse.wait(1)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)
      totalFunded.textContent = ethers.formatEther(balance);
    } catch (error) {
      console.log(error)
      alert(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.formatEther(balance))
      alert(`The balance is ${ethers.formatEther(balance)}ETH.`)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}
