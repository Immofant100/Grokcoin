const { Blockchain, Transaction } = require('./blockchain');
const Wallet = require('./wallet');

// Blockchain initialisieren
const grokCoin = new Blockchain();

// Wallets erstellen
const wallet1 = new Wallet();
const wallet2 = new Wallet();

console.log('Wallet 1 Public Key:', wallet1.publicKey);
console.log('Wallet 2 Public Key:', wallet2.publicKey);

// Transaktion erstellen und signieren
const tx1 = new Transaction(wallet1.publicKey, wallet2.publicKey, 50, null);
tx1.signature = wallet1.signTransaction(tx1);
grokCoin.addTransaction(tx1);

// Mining durchführen
console.log('\nStarting mining...');
grokCoin.minePendingTransactions(wallet1.publicKey);

// Salden prüfen
console.log('\nBalance of Wallet 1:', grokCoin.getBalanceOfAddress(wallet1.publicKey));
console.log('Balance of Wallet 2:', grokCoin.getBalanceOfAddress(wallet2.publicKey));

// Zweite Transaktion
const tx2 = new Transaction(wallet2.publicKey, wallet1.publicKey, 20, null);
tx2.signature = wallet2.signTransaction(tx2);
grokCoin.addTransaction(tx2);

// Erneut minen
console.log('\nStarting mining again...');
grokCoin.minePendingTransactions(wallet1.publicKey);

// Salden prüfen
console.log('\nBalance of Wallet 1:', grokCoin.getBalanceOfAddress(wallet1.publicKey));
console.log('Balance of Wallet 2:', grokCoin.getBalanceOfAddress(wallet2.publicKey));

// Blockchain-Integrität prüfen
console.log('\nIs blockchain valid?', grokCoin.isChainValid());
