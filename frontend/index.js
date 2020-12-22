// Source code to interact with smart contract

// web3 provider with fallback for old version
if (window.ethereum) {
  window.web3 = new Web3(window.ethereum)
  try {
      // ask user for permission
      ethereum.enable()
      // user approved permission
  } catch (error) {
      // user rejected permission
      console.log('user rejected permission')
  }
}
else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider)
  // no need to ask for permission
}
else {
  window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
}
console.log (window.web3.currentProvider)



var account;
// to register every account change
async function accountChange() {
	await window.ethereum.enable();
 
	web3.eth.getAccounts(function (error, accounts) {
		console.log(accounts[0], 'current account on init');
		account = accounts[0];
	});
 
	// Acccounts now exposed
	window.ethereum.on('accountsChanged', function () {
		web3.eth.getAccounts(function (error, accounts) {
			console.log(accounts[0], 'current account after account change');
			account = accounts[0];
		});
	});
}
accountChange();



// contractAddress and abi are set after contract deploy
var contractAddress = '0xb969cc31ed381B4914992c046C56374A5A10569d';

var abi = JSON.parse(`[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			}
		],
		"name": "BuyerPaid",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "deliver",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "courier",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalPrice",
				"type": "uint256"
			}
		],
		"name": "ItemSent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pay",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "payOut",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_buyer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "register",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_courier",
				"type": "address"
			}
		],
		"name": "send",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "TradeStarted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`);

//contract instance
function updateContract() {
	contract = new web3.eth.Contract(abi, contractAddress, {
		from: account,
		gasLimit: 3000000
	});
}
updateContract();



//Smart contract functions
/*
function registerSetInfo() {
	updateContract();
	info = $("#newInfo").val();
	contract.methods.setInfo (info).send( {from: account}).then( function(tx) {
		console.log("Transaction: ", tx);
	});
	$("#newInfo").val('');
}

function registerGetInfo() {
	updateContract();
	contract.methods.getInfo().call().then( function(  ) {
		console.log("info: ", info);
		document.getElementById('lastInfo').innerHTML = info;
	});
}*/
var price = 2;

function register() {
	const buyer = document.getElementById('buyerInput').value;
	const price = document.getElementById('priceInput').value;
	updateContract();
	contract.methods.register(buyer, price).send({from:account}).then(function(address) {
		console.log("Sender: ", account);
		console.log("Buyer: ", buyer);
		console.log("Price: ", price);
		console.log("Transaction: ", address);
	});
}
function pay() {
	var ammount = price*1.1; // add the courier's fee
	// 1000000000000000000 for 1 ether
	updateContract();
	contract.methods.pay().send({from:account, value:ammount}).then(function(address){
		console.log("Buyer: ", account);
		console.log("Transaction: ", address);
	});
}
function payOut() {
	updateContract();
	contract.methods.payOut().send({from:account});
}
function send() {
	const courier = document.getElementById('courierInput').value;
	updateContract();
	contract.methods.send(courier).send({from: account});
}
function deliver() {
	updateContract();
	contract.methods.deliver().send({from: account});
}

/*

document
	.getElementById("buyerForm")
	.addEventListener('register', onRegister);

document
	.getElementById('courierForm')
	.addEventListener('send', onSend);
*/