import Web3 from 'web3'
import contractABI from '../assets/contracts/DGlovo.json'

const contractAddress = '0x381951ce01AC17cBd4B12e49d4A43Bb4188c02E0'

let getContract = () => {
  let web3 = new Web3(window.web3.currentProvider)
  let contract = new web3.eth.Contract(contractABI.abi, contractAddress)
  return contract
}

export default getContract
