<template>
  <h1>DGlovo</h1>
  <div class="mb-2">
    <span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" :title="!canCreateOrder ? 'Need at least ' + this.$store.state.stakeAmount + ' DGL' : ''">
      <button type="button" class="btn btn-primary me-2" data-bs-target="#createOrderModal" data-bs-toggle="modal" :disabled="!canCreateOrder">
        Create order
      </button>
    </span>
    <button type="button" class="btn btn-light" v-on:click="getOrders">Get orders</button>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Requester</th>
        <th scope="col">Petition</th>
        <th scope="col">Price</th>
        <th scope="col">Time</th>
        <th scope="col">Time Limit</th>
        <th scope="col" v-show="this.$store.state.stakedAmount >= this.$store.state.stakeAmount || this.assignColumn">Assign to me</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in this.orders" v-bind:key="order.id">
        <th scope="row">{{ order.requester }}</th>
        <td>{{ order.petition }}</td>
        <td>{{ order.price.toFixed(2) }} DGL</td>
        <td>{{ new Date(order.time * 1000).toTimeString() }}</td>
        <td>{{ new Date(order.time * 1000 + order.timeLimit * 1000).toTimeString() }}</td>
        <td v-show="this.$store.state.stakedAmount >= this.$store.state.stakeAmount || this.assignColumn">
          <button type="button" class="btn btn-primary" v-show="order.worker == '0x0000000000000000000000000000000000000000' && !order.completed" v-on:click="assignOrder(order.id)">Assign</button>
          <button type="button" class="btn btn-primary" disabled v-show="order.worker == this.$store.state.account">Assigned</button>
        </td>
        <td>
          <button type="button" class="btn btn-primary" v-show="order.worker == '0x0000000000000000000000000000000000000000'
            && !order.completed" disabled>Unassigned</button>
          <button type="button" class="btn btn-danger ms-2" v-show="order.worker == '0x0000000000000000000000000000000000000000'
            && !order.completed && order.requester == this.$store.state.account" v-on:click="cancelOrder(order.id)">Cancel</button>
          <button type="button" class="btn btn-primary" v-show="order.worker != '0x0000000000000000000000000000000000000000'
            && !order.completed && order.requester != this.$store.state.account" disabled>Uncompleted</button>
          <button type="button" class="btn btn-primary" v-show="order.worker != '0x0000000000000000000000000000000000000000'
            && order.requester == this.$store.state.account && !order.completed" v-on:click="completeOrder(order.id)">Complete</button>
          <button type="button" class="btn btn-danger ms-2" v-show="order.worker != '0x0000000000000000000000000000000000000000'
            && !order.completed && order.requester == this.$store.state.account" v-on:click="uncompletedOrder(order.id)">Mark uncompleted</button>
          <button type="button" class="btn btn-primary" v-show="order.completed" disabled>Completed</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="modal fade" id="createOrderModal" tabindex="-1" aria-labelledby="createOrderModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createOrderModalLabel">Create Order</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="input-group ">
            <div class="input-group mb-3">
              <span class="input-group-text">Petition</span>
              <textarea class="form-control" aria-label="Petition" v-model="petition"></textarea>
            </div>
            <div class="input-group mb-3">
              <label for="priceRange" class="form-label">Time Limit: {{timeLimitString}}</label>
              <input type="range" class="form-range" id="price" :min="5*60" :max="3600*24" v-model="timeLimit">
            </div>
            <div class="input-group mb-3">
              <label for="priceRange" class="form-label">Price: {{this.price}} DGL</label>
              <input type="range" class="form-range" id="price" min="0" max="100" step="0.5" v-model="price">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" v-on:click="createOrder">Create Order</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Table',
  components: {
  },
  data() {
    return {
      orders: [],
      petition: "",
      timeLimit: 3600,
      price: 5.0,
      assignColumn: false
    }
  },
  mounted() {
  },
  computed: {
    account() {
      return this.$store.state.account
    },
    timeLimitString() {
      if (this.timeLimit >= 3600)
        return (parseInt(this.timeLimit/3600)).toString() + " hours and " + (parseInt((this.timeLimit%3600)/60)).toString() + " minutes"
      else return (parseInt((this.timeLimit%3600)/60)).toString() + " minutes"
    },
    canCreateOrder() {
      if (this.$store.state.account == null) return false
      return this.$store.state.DGLBalance >= this.$store.state.stakeAmount
    }
  },
  methods: {
    createOrder: async function () {
      this.$store.state.contractInstance.methods.createOrder(this.petition, this.timeLimit, (this.price*Math.pow(10, 18)).toString()).send({from: this.account}, function(error, transactionHash){
        console.log(error)
        console.log(transactionHash)
      });
    },
    getOrders: async function () {
      let self = this
      this.orders = []
      this.assignColumn = false
      self.$store.state.contractInstance.methods.lastId().call({from: this.account}, function(err, result){
        for (let i = 0; i < result; ++i) {
          self.$store.state.contractInstance.methods.orders(i).call({from: this.account}, function(err, result){
            self.orders.push({
              id: i,
              requester: result.requester,
              petition: result.petition,
              time: result.creationTime,
              timeLimit: result.timeLimit,
              price: result.price/Math.pow(10, 18),
              completed: result.completed,
              worker: result.worker
            })
            if(result.worker == self.$store.state.account) self.assignColumn = true
          });
        }
      });
    },
    assignOrder: async function (orderId) {
      let self = this
      this.$store.state.contractInstance.methods.assignOrder(orderId).send({from: this.account}, function(error, transactionHash){
        console.log(error)
        console.log(transactionHash)
        self.getOrders()
      });
    },
    completeOrder: async function (orderId) {
      let self = this
      this.$store.state.contractInstance.methods.completeOrder(orderId).send({from: this.account}, function(error, transactionHash){
        console.log(error)
        console.log(transactionHash)
        self.getOrders()
      });
    },
    cancelOrder: async function (orderId) {
      let self = this
      this.$store.state.contractInstance.methods.cancelOrder(orderId).send({from: this.account}, function(error, transactionHash){
        console.log(error)
        console.log(transactionHash)
        self.getOrders()
      });
    },
    uncompletedOrder: async function (orderId) {
      let self = this
      this.$store.state.contractInstance.methods.uncompletedOrder(orderId).send({from: this.account}, function(error, transactionHash){
        console.log(error)
        console.log(transactionHash)
        self.getOrders()
      });
    },
  }
}
</script>

<style>

</style>
