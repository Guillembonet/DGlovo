import Web3 from 'web3'
import contractABI from '../assets/contracts/DGlovo.json'

const contractAddress = '0xB15259007E6384d6d574f605703eAB62b5268D47'

let getContract = () => {
  let web3 = new Web3(window.web3.currentProvider)
  let contract = new web3.eth.Contract(contractABI.abi, contractAddress)
  return contract
}

export default getContract
