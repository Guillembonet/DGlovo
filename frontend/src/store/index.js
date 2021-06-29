import { createStore } from 'vuex'
import getWeb3 from '../util/getWeb3'
import pollWeb3 from '../util/pollWeb3'
import getContract from '../util/getContract'

export default createStore({
  state: {
    networkId: null,
    balance: 0,
    DGLBalance: 0,
    stakedAmount: 0,
    stakeAmount: 0,
    account: null,
    contractInstance: null
  },
  mutations: {
    setAccount (state, account) {
      console.log('setAccount Mutation being executed', account)
      state.account = account
    },
    setBalance (state, balance) {
      console.log('setBalance Mutation being executed', balance)
      state.balance = balance
    },
    setDGLBalance (state, DGLBalance) {
      console.log('setDGLBalance Mutation being executed', DGLBalance)
      state.DGLBalance = DGLBalance
    },
    setNetworkId (state, networkId) {
      console.log('setNetworkId Mutation being executed', networkId)
      state.networkId = networkId
    },
    setStakedAmount (state, stakedAmount) {
      console.log('setStakedAmount Mutation being executed', stakedAmount)
      state.stakedAmount = stakedAmount
    },
    setStakeAmount (state, stakeAmount) {
      console.log('setStakeAmount Mutation being executed', stakeAmount)
      state.stakeAmount = stakeAmount
    },
    pollWeb3Instance (state, payload) {
      console.log('pollWeb3Instance mutation being executed', payload)
      state.account = payload.accounts[0]
      state.balance = parseInt(payload.balance,10)/Math.pow(10, 18)
      state.DGLBalance = parseInt(payload.DGLBalance,10)/Math.pow(10, 18)
      state.stakedAmount = parseInt(payload.stakedAmount,10)/Math.pow(10, 18)
    },
    registerContractInstance (state, payload) {
      console.log('Contract instance: ', payload)
      state.contractInstance = payload
    }
  },
  actions: {
    registerWeb3 ({commit}) {
      console.log('registerWeb3 Action being executed')
      getWeb3().then(res => {
        if(res) {
          let contract = getContract()
          commit('registerContractInstance', contract)
          window.web3.eth.getAccounts().then(accounts => {
            if (accounts.length > 0) {
              commit('setAccount', accounts[0])
              window.web3.eth.getBalance(accounts[0]).then(balance => {
                commit('setBalance', parseInt(balance,10)/Math.pow(10, 18))
              })
              contract.methods.balanceOf(accounts[0]).call({from: accounts[0]}, function(err, result){
                commit('setDGLBalance', parseInt(result,10)/Math.pow(10, 18))
              });
              contract.methods.stakeAmount().call({from: accounts[0]}, function(err, result){
                commit('setStakeAmount', parseInt(result,10)/Math.pow(10, 18))
              });
              contract.methods.lockedAmountOf(accounts[0]).call({from: accounts[0]}, function(err, result){
                commit('setStakedAmount', parseInt(result,10)/Math.pow(10, 18))
              });
            }
          })
          window.web3.eth.net.getId().then(networkId => {
            commit('setNetworkId', networkId)
          })
          pollWeb3()
        }
      })
    },
    pollWeb3 ({commit}, payload) {
      console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    }
  }
})
