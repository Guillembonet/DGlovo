import Web3 from 'web3'
import store from '../store'

let pollWeb3 = function () {
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)

  setInterval(async () => {
    console.log("polling...")
    if (web3 && store.state.account) {
      let accounts = await web3.eth.getAccounts()
      let balance = 0
      if (accounts.length > 0)
        balance = await web3.eth.getBalance(accounts[0])
      store.dispatch('pollWeb3', {
        accounts: accounts,
        balance: parseInt(balance, 10)
      })
    }
  }, 2000)
}

export default pollWeb3
