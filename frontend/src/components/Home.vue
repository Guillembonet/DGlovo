<template>
  <div class="mt-2">
    <div class="d-flex flex-row-reverse align-items-center me-2">
      <button type="button" v-show="!account" class="btn btn-primary" v-on:click="connectMetamask">Connect MetaMask</button>
      <button type="button" v-if="account" class="btn btn-secondary" disabled>{{account.substring(0,12)+'...'}}</button>
      <div v-show="account" class="me-2">{{this.$store.state.balance.toString().substring(0,7)}} ETH</div>
    </div>
    <h1>DGlovo</h1>
    <div class="mb-2">
      <button type="button" class="btn btn-primary me-2" v-on:click="createOrder">Create order</button>
      <button type="button" class="btn btn-light" v-on:click="getOrders">Get orders</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Requester</th>
          <th scope="col">Petition</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in this.orders" v-bind:key="order.id">
          <th scope="row">{{ order.requester }}</th>
          <td>{{ order.petition }}</td>
          <td>{{ new Date(order.time * 1000).toTimeString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      balance: 0,
      orders: []
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
    createOrder: async function () {
      this.$store.state.contractInstance.methods.createOrder("test").send({from: this.account}, function(error, transactionHash){
        console.log(error)
        console.log(transactionHash)
      });
    },
    getOrders: async function () {
      console.log(this.$store.state.contractInstance.methods)
      let self = this
      self.$store.state.contractInstance.methods.lastId().call({from: this.account}, function(err, result){
        for (let i = 0; i < result; ++i) {
          self.$store.state.contractInstance.methods.orders(i).call({from: this.account}, function(err, result){
            console.log(result)
            self.orders.push({
              id: i,
              requester: result.requester,
              petition: result.petition,
              time: result.creationTime
            })
          });
        }
      });
    }
  }
}
</script>

<style>

</style>
