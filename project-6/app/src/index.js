import Web3 from "web3";
import supplyChainArtifact from "../../build/contracts/SupplyChain.json";

const App = {
  web3: null,
  meta: null,

  sku: 0,
  upc: 0,
  metamaskAccountID: "0x0000000000000000000000000000000000000000",
  ownerID: "0x0000000000000000000000000000000000000000",
  originFarmerID: "0x0000000000000000000000000000000000000000",
  originFarmName: null,
  originFarmInformation: null,
  originFarmLatitude: null,
  originFarmLongitude: null,
  productNotes: null,
  productPrice: 0,
  distributorID: "0x0000000000000000000000000000000000000000",
  retailerID: "0x0000000000000000000000000000000000000000",
  consumerID: "0x0000000000000000000000000000000000000000",

  initWeb3: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = supplyChainArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        supplyChainArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.metamaskAccountID = accounts[0]
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }

    return this.initSupplyChain();
  },

  init: async function() {
    this.readForm();

    /// Setup access to blockchain
    return await this.initWeb3();
  },

  readForm: function() {
    this.sku = document.querySelector("#sku").value;
    this.upc = document.querySelector("#upc").value;
    this.ownerID = document.querySelector("#ownerID").value;
    this.originFarmerID = document.querySelector("#originFarmerID").value;
    this.originFarmName = document.querySelector("#originFarmName").value;
    this.originFarmInformation = document.querySelector("#originFarmInformation").value;
    this.originFarmLatitude = document.querySelector("#originFarmLatitude").value;
    this.originFarmLongitude = document.querySelector("#originFarmLongitude").value;
    this.productNotes = document.querySelector("#productNotes").value;
    this.productPrice = document.querySelector("#productPrice").value;
    this.distributorID = document.querySelector("#distributorID").value;
    this.retailerID = document.querySelector("#retailerID").value;
    this.consumerID = document.querySelector("#consumerID").value;
  
    console.log(
      this.sku,
      this.upc,
      this.ownerID, 
      this.originFarmerID, 
      this.originFarmName, 
      this.originFarmInformation, 
      this.originFarmLatitude, 
      this.originFarmLongitude, 
      this.productNotes, 
      this.productPrice, 
      this.distributorID, 
      this.retailerID, 
      this.consumerID
    );
  },

  initSupplyChain: function () {
    this.fetchItemBufferOne();
    this.fetchItemBufferTwo();
    this.fetchEvents();
  },

  fetchItemBufferOne: async function () {
    const { fetchItemBufferOne } = this.meta.methods;
    
    this.upc = document.querySelector("#upc").value;
    console.log('upc ', this.upc);

    try {
      const result = await fetchItemBufferOne(this.upc).call()
      console.log('fetchItemBufferOne', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  fetchItemBufferTwo: async function () {
    const { fetchItemBufferTwo } = this.meta.methods;
    
    this.upc = document.querySelector("#upc").value;
    console.log('upc ', this.upc);

    try {
      const result = await fetchItemBufferTwo(this.upc).call()
      console.log('fetchItemBufferTwo', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  fetchEvents: function () {
    const { events } = this.meta;

    const eventEmitter = events.allEvents();

    eventEmitter.on('data', result => {
      const eventLog = document.createElement('li');
      eventLog.textContent = `${result.event} - ${result.transactionHash}`;
      document.querySelector('#ftc-events').appendChild(eventLog);
    })
  },

  harvestItem: async function () {
    const { harvestItem } = this.meta.methods;
    try {
      const result = await harvestItem(
        this.upc,
        this.metamaskAccountID,
        this.originFarmName,
        this.originFarmInformation,
        this.originFarmLatitude,
        this.originFarmLongitude,
        this.productNotes
      ).send({ from: this.metamaskAccountID, gas: '1000000' });
      console.log('harvestItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  processItem: async function () {
    const { processItem } = this.meta.methods;
    try {
      const result = await processItem(this.upc).send({ from: this.metamaskAccountID})
      console.log('processItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  packItem: async function () {
    const { packItem } = this.meta.methods;
    try {
      const result = await packItem(this.upc).send({ from: this.metamaskAccountID})
      console.log('packItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  sellItem: async function () {
    const { sellItem } = this.meta.methods;
    try {
      const productPrice = this.web3.utils.toWei("1", "ether");
      console.log('productPrice', productPrice);
      const result = await sellItem(this.upc, this.productPrice).send({ from: this.metamaskAccountID})
      console.log('sellItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  buyItem: async function () {
    const { buyItem } = this.meta.methods;
    try {
      const walletValue = this.web3.utils.toWei("3", "ether");
      const result = await buyItem(this.upc).send({ from: this.metamaskAccountID, value: walletValue })
      console.log('buyItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  shipItem: async function () {
    const { shipItem } = this.meta.methods;
    try {
      const result = await shipItem(this.upc).send({ from: this.metamaskAccountID })
      console.log('shipItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  receiveItem: async function () {
    const { receiveItem } = this.meta.methods;
    try {
      const result = await receiveItem(this.upc).send({ from: this.metamaskAccountID })
      console.log('receiveItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },

  purchaseItem: async function () {
    const { purchaseItem } = this.meta.methods;
    try {
      const result = await purchaseItem(this.upc).send({ from: this.metamaskAccountID })
      console.log('purchaseItem', result);
    } catch (error) {
      console.log(error.message);
    }
  },


};

window.App = App;

window.addEventListener("load", function() {
  App.web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://127.0.0.1:7545"),
  );

  App.init();
});
