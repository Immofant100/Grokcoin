const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Wallet {
    constructor() {
        const keyPair = ec.genKeyPair();
        this.privateKey = keyPair.getPrivate('hex');
        this.publicKey = keyPair.getPublic('hex');
    }

    signTransaction(transaction) {
        const hashTx = this.hashTransaction(transaction);
        const sig = ec.keyFromPrivate(this.privateKey, 'hex').sign(hashTx);
        return sig.toDER('hex');
    }

    hashTransaction(transaction) {
        return crypto
            .createHash('sha256')
            .update(transaction.fromAddress + transaction.toAddress + transaction.amount + transaction.timestamp)
            .digest('hex');
    }

    static verifyTransaction(transaction) {
        if (!transaction.signature || !transaction.fromAddress) {
            return transaction.fromAddress === null; // Belohnungstransaktionen haben keine Signatur
        }
        const publicKey = ec.keyFromPublic(transaction.fromAddress, 'hex');
        const hashTx = crypto
            .createHash('sha256')
            .update(transaction.fromAddress + transaction.toAddress + transaction.amount + transaction.timestamp)
            .digest('hex');
        return publicKey.verify(hashTx, transaction.signature);
    }
}

// Signatur-Validierung in Transaction-Klasse
const { Transaction } = require('./blockchain');

Transaction.prototype.isValid = function () {
    return Wallet.verifyTransaction(this);
};

module.exports = Wallet;
