const crypto = require('crypto');

class Block {
    constructor(index, timestamp, transactions, previousHash, nonce = 0) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
            )
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

class Transaction {
    constructor(fromAddress, toAddress, amount, signature) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = signature;
        this.timestamp = Date.now();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; // Anzahl der führenden Nullen für PoW
        this.pendingTransactions = [];
        this.miningReward = 10; // Belohnung für Miner
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), [], '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(minerAddress) {
        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);

        // Belohnungstransaktion für Miner
        this.pendingTransactions = [
            new Transaction(null, minerAddress, this.miningReward, null)
        ];
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction');
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            for (const trans of currentBlock.transactions) {
                if (!trans.isValid()) {
                    return false;
                }
            }
        }
        return true;
    }
}

module.exports = { Block, Transaction, Blockchain };
