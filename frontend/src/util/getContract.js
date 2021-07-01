import Web3 from 'web3'
import contractABI from '../assets/contracts/DGlovo.json'

const contractAddress = '0xe5c5aAb99890F6953a2D9e5D4a3fA5A7A174984a'

let getContract = () => {
  let web3 = new Web3(window.web3.currentProvider)
  let contract = new web3.eth.Contract(contractABI.abi, contractAddress)
  return contract
}

export default getContract
