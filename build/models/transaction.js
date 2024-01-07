"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_1 = require("./wallet");
// Creating Schema & Model for Transaction
const TransactionSchema = new mongoose_1.default.Schema({
    userFrom: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    userTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    walletId: String,
    WID: String,
    amount: Number,
    fee: Number,
    to: String,
    type: String,
    status: { type: String, default: "pending 0/3" },
    desc: String,
    code: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
});
// Static method to delete transactions by user ID
TransactionSchema.statics.deleteByUserId = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Delete transactions associated with the user
            yield this.deleteMany({
                $or: [{ userFrom: userId }, { userTo: userId }],
            });
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    });
};
exports.TransactionModel = mongoose_1.default.model("transaction", TransactionSchema);
//Creating Transaction Object
class TransactionStore {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllTransaction = yield exports.TransactionModel.find({}).populate(["userFrom", "userTo"]);
                return getAllTransaction;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    getTransactionByWalletId(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getWalletTransaction = yield exports.TransactionModel.find({
                    WID: walletId,
                });
                return getWalletTransaction;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    create(trnx, userFrom, userTo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { userFrom: userFrom === null || userFrom === void 0 ? void 0 : userFrom.userId, userTo: (userTo === null || userTo === void 0 ? void 0 : userTo.userId) || {
                            _id: "6423b4bfbe63e9d1b99757ae",
                        }, WID: userFrom.address, status: "pending 0/3" }))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    adminCreate(trnx, userFrom, userTo) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const defaultUserId = "6423b4bfbe63e9d1b99757ae";
                if (trnx.type === "debit") {
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { userFrom: ((_a = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _a === void 0 ? void 0 : _a.userId) || defaultUserId, userTo: ((_b = userTo === null || userTo === void 0 ? void 0 : userTo[0]) === null || _b === void 0 ? void 0 : _b.userId) || defaultUserId, status: "pending 0/3" })).then((res) => res.save());
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { walletId: trnx.to, to: trnx.walletId, userFrom: ((_c = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _c === void 0 ? void 0 : _c.userId) || defaultUserId, userTo: ((_d = userTo === null || userTo === void 0 ? void 0 : userTo[0]) === null || _d === void 0 ? void 0 : _d.userId) || defaultUserId, type: "credit", status: "pending 0/3", WID: ((_e = userTo === null || userTo === void 0 ? void 0 : userTo[0]) === null || _e === void 0 ? void 0 : _e.address) || "BLock" })).then((res) => res.save());
                }
                else {
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { status: "pending 0/3", walletId: trnx.to, to: trnx.walletId, userFrom: ((_f = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _f === void 0 ? void 0 : _f.userId) || defaultUserId, userTo: ((_g = userTo === null || userTo === void 0 ? void 0 : userTo[0]) === null || _g === void 0 ? void 0 : _g.userId) || defaultUserId })).then((res) => res.save());
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { type: "debit", WID: trnx === null || trnx === void 0 ? void 0 : trnx.walletId, userFrom: ((_h = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _h === void 0 ? void 0 : _h.userId) || defaultUserId, userTo: ((_j = userTo === null || userTo === void 0 ? void 0 : userTo[0]) === null || _j === void 0 ? void 0 : _j.userId) || defaultUserId, status: "pending 0/3" })).then((res) => res.save());
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(`${error}`);
            }
        });
    }
    confirmTrx(trnx, userFrom, userTo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield exports.TransactionModel.updateOne({ _id: trnx.id }, {
                    status: "confirmed",
                    to: trnx.to,
                    userTo: (userTo === null || userTo === void 0 ? void 0 : userTo.userId) || {
                        _id: "6423b4bfbe63e9d1b99757ae",
                    },
                });
                yield exports.TransactionModel.create({
                    amount: trnx.amount,
                    walletId: trnx.to,
                    to: trnx.walletId,
                    type: "credit",
                    status: "confirmed",
                    createdAt: trnx.createdAt,
                    code: trnx.code,
                    desc: trnx.desc,
                    userFrom: userFrom.userId,
                    userTo: (userTo === null || userTo === void 0 ? void 0 : userTo.userId) || {
                        _id: "6423b4bfbe63e9d1b99757ae",
                    },
                    WID: userTo === null || userTo === void 0 ? void 0 : userTo.address,
                })
                    .then((res) => {
                    res.save;
                })
                    .catch((e) => {
                    throw new Error(e.message);
                });
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    pk(trnx, userFrom) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { to: "BlockSimulation", status: "pending ", userFrom: userFrom.userId, type: "requestpk", WID: userFrom.address }))
                        .then((res) => {
                        res.save();
                    })
                        .catch((e) => {
                        throw new Error(e.message);
                    });
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    validate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield exports.TransactionModel.updateOne({ _id: id }, {
                    status: "confirmed",
                });
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    editTransactionStatus(id, status, date, code, amount, type, to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield exports.TransactionModel.findById(id);
                console.log(transaction);
                if (transaction) {
                    transaction.set({ status: status || transaction.status });
                    transaction.set({ createdAt: date || transaction.createdAt });
                    transaction.set({ code: code || transaction.code });
                    transaction.set({ type: type || transaction.type });
                    transaction.set({ status: status || transaction.status });
                    transaction.set({ amount: amount || transaction.amount });
                    transaction.set({ to: to || transaction.to });
                    // Update transaction fields directly in the save method
                    yield transaction.save();
                }
                else {
                    throw new Error("404"); // You may want to customize this error message
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    getTransactionByTxId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(id);
                // Find the transaction
                const transaction = yield exports.TransactionModel.findById(id);
                if (!transaction) {
                    throw new Error("Transaction not found");
                }
                return transaction; // Returning the found transaction
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    // Delete Transaction
    deleteTransaction(id, type, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                // Find the transaction
                const transaction = yield exports.TransactionModel.findById(id);
                // console.log(first)
                if (!transaction) {
                    throw new Error("Transaction not found");
                }
                // Find the wallet based on the transaction details
                const wallet = yield wallet_1.WalletModel.findOne({
                    address: transaction.WID,
                });
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                // If activatedCoins is not an array, set it to an empty array
                if (!Array.isArray(wallet.activatedCoins)) {
                    wallet.activatedCoins = [];
                }
                // If it's a credit, deduct the amount from the corresponding crypto balance
                if (type === "credit") {
                    const cryptoIndex = wallet.activatedCoins.findIndex((coin) => coin.code === transaction.code);
                    if (cryptoIndex !== -1) {
                        wallet.activatedCoins[cryptoIndex].amount -= amount;
                    }
                }
                else {
                    // If it's a debit, return the amount to the corresponding crypto balance
                    const cryptoIndex = wallet.activatedCoins.findIndex((coin) => coin.code === transaction.walletId);
                    if (cryptoIndex !== -1) {
                        wallet.activatedCoins[cryptoIndex].amount += amount;
                    }
                }
                // Save the updated wallet
                yield wallet.save();
                // Finally, delete the transaction
                yield exports.TransactionModel.deleteOne({ _id: id });
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = TransactionStore;
