import Web3 from 'web3'
import contractABI from '../assets/contracts/DGlovo.json'

const contractAddress = '0xff40ff5a2Cec04A49Fe3Dfd40843c793710c1eb7'

let getContract = () => {
  let web3 = new Web3(window.web3.currentProvider)
  let contract = new web3.eth.Contract(contractABI.abi, contractAddress)
  return contract
}

export default getContract
