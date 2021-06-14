import Web3 from 'web3'
import contractABI from '../assets/contracts/DGlovo.json'

const contractAddress = '0xFE172c1DECA83947444DC7AE42D10F5f1FB8A829'

let getContract = () => {
  let web3 = new Web3(window.web3.currentProvider)
  let contract = new web3.eth.Contract(contractABI.abi, contractAddress)
  return contract
}

export default getContract
