<template>
  <div class="mt-2">
    <div class="d-flex flex-row-reverse align-items-center me-2">
      <button type="button" v-show="!account" class="btn btn-primary" v-on:click="connectMetamask">Connect MetaMask</button>
      <!-- aria-label="..." on the control -->
      <button type="button" class="btn btn-secondary ms-2" v-show="account" aria-label="Mute" data-bs-toggle="modal" data-bs-target="#settingsModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
        </svg>
      </button>
      <button type="button" v-if="account" class="btn btn-secondary" disabled>{{account.substring(0,12)+'...'}}</button>
      <div v-show="account" class="me-2">{{this.$store.state.DGLBalance.toFixed(2)}} DGL | {{this.$store.state.balance.toFixed(2)}} ETH</div>
    </div>
    <Table />
  </div>
  <div class="modal fade" id="settingsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Settings</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2">
            Staked amount: {{this.$store.state.stakedAmount.toFixed(2)}} DGL
          </div>
          <div class="mb-2">
            <button type="button" class="btn btn-primary" :disabled="this.$store.state.stakedAmount >= this.$store.state.stakeAmount" v-on:click="stake">Stake {{this.$store.state.stakeAmount.toFixed(2)}} DGL</button>
          </div>
          <div class="mb-2">
            <button type="button" class="btn btn-primary" :disabled="this.$store.state.stakedAmount <= 0.0" v-on:click="unstake">Unstake all DGL</button>
          </div>
          <button type="button" class="btn btn-primary" v-on:click="mint10DGL">Mint 10 DGL</button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "./views/Table.vue";

export default {
  name: 'Home',
  components: {
    Table
  },
  data() {
    return {
      balance: 0
    }
  },
  mounted() {
  },
  computed: {
    account() {
      return this.$store.state.account
    }
  },
  methods: {
    connectMetamask: async function() {
      console.log('registerWeb3 Action dispatched from home.vue')
      this.$store.dispatch('registerWeb3')
    },
    mint10DGL: async function () {
      let self = this
      self.$store.state.contractInstance.methods.mint("10000000000000000000").send({from: this.account}, function(){
        self.$store.state.contractInstance.methods.totalSupply().call({from: this.account}, function(){
        });
      });
    },
    stake: async function () {
      let self = this
      self.$store.state.contractInstance.methods.lockStake().send({from: this.account}, function(){
      });
    },
    unstake: async function () {
      let self = this
      self.$store.state.contractInstance.methods.unlockStake().send({from: this.account}, function(){
      });
    }
  }
}
</script>

<style>

</style>
