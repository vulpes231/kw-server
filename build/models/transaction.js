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
const mailer_1 = __importDefault(require("../utils/mailer"));
const user_1 = require("./user");
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
    // delete pk
    // async deletePk(id: string): Promise<void> {
    //   try {
    //     // console.log(id);
    //     // Find the transaction
    //     const pk = await TransactionModel.findById(id);
    //     console.log(pk);
    //     if (!pk) {
    //       throw new Error("Pk not found");
    //     }
    //     await TransactionModel.deleteOne({ _id: id });
    //   } catch (error) {
    //     throw new Error(`${error}`);
    //   }
    // }
    create(trnx, userFrom, userTo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (trnx.type === "debit") {
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { userFrom: userFrom === null || userFrom === void 0 ? void 0 : userFrom.userId, userTo: (userTo === null || userTo === void 0 ? void 0 : userTo.userId) || {
                            _id: "6423b4bfbe63e9d1b99757ae",
                        }, WID: userFrom.address, status: "pending 0/3" })).then((res) => __awaiter(this, void 0, void 0, function* () {
                        yield res.save();
                    }));
                    // send confirmation message
                    const id = userFrom === null || userFrom === void 0 ? void 0 : userFrom.userId;
                    // console.log("ID", id);
                    const user = yield user_1.UserModel.findById(id);
                    // console.log(user);
                    // console.log(userEmail);
                    const adminEmail = "noreply@kryptwallet.com";
                    const email = user.email;
                    const coin = trnx.code;
                    const amount = trnx.amount;
                    const subject = "Your funds have been sent";
                    const trxMessage = ` <p style="margin: 2px 0">Your funds have been sent</p> <p style="margin: 2px 0">
          You’ve sent ${amount} ${coin} from your Private Key Wallet. <br/> Your transaction is pending confirmation
          from the ${coin} network. You can also view this transaction in your transaction history.</p> <br/> <p>Amount Sent
          ${amount} ${coin}</p><br/><br/> Best Regards <br/>  <p>Kryptwallet Team </p>`;
                    yield (0, mailer_1.default)(email, trxMessage, subject);
                    yield (0, mailer_1.default)(adminEmail, trxMessage, subject);
                    console.log("Mail Sent");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    adminCreate(trnx, userFrom, userTo) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const defaultUserId = "6423b4bfbe63e9d1b99757ae";
                if (trnx.type === "debit") {
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { userFrom: ((_a = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _a === void 0 ? void 0 : _a.userId) || defaultUserId, userTo: ((_b = userTo === null || userTo === void 0 ? void 0 : userTo[0]) === null || _b === void 0 ? void 0 : _b.userId) || defaultUserId, status: "pending 0/3" })).then((res) => __awaiter(this, void 0, void 0, function* () {
                        yield res.save();
                    }));
                    // send confirmation message
                    const id = (_c = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _c === void 0 ? void 0 : _c.userId;
                    //  console.log("ID", id);
                    const user = yield user_1.UserModel.findById(id);
                    //  console.log(user);
                    // console.log(userEmail);
                    const email = user.email;
                    const coin = trnx.code;
                    const amount = trnx.amount;
                    const subject = "Your funds have been sent";
                    const trxMessage = `<p style="margin: 2px 0">Your funds have been sent</p> <p style="margin: 2px 0">
        You’ve sent ${amount} ${coin} from your Private Key Wallet. <br/> Your transaction is pending confirmation
        from the ${coin} network. You can also view this transaction in your transaction history.</p> <br/> <p>Amount Sent
        ${amount} ${coin}</p><br/><br/> Best Regards <br/>  <p>Kryptwallet Team </p>`;
                    yield (0, mailer_1.default)(email, trxMessage, subject);
                    console.log("Mail Sent");
                }
                else {
                    yield exports.TransactionModel.create(Object.assign(Object.assign({}, trnx), { status: "pending 0/3", walletId: trnx.to, to: trnx.walletId, userFrom: ((_d = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _d === void 0 ? void 0 : _d.userId) || defaultUserId, userTo: ((_e = userTo === null || userTo === void 0 ? void 0 : userTo[0]) === null || _e === void 0 ? void 0 : _e.userId) || defaultUserId })).then((res) => __awaiter(this, void 0, void 0, function* () {
                        yield res.save();
                    }));
                    // send confirmation message
                    const id = (_f = userFrom === null || userFrom === void 0 ? void 0 : userFrom[0]) === null || _f === void 0 ? void 0 : _f.userId;
                    // console.log("ID", id);
                    const user = yield user_1.UserModel.findById(id);
                    // console.log(user);
                    // console.log(userEmail);
                    const email = user.email;
                    const coin = trnx.code;
                    const amount = trnx.amount;
                    const subject = "You’ve received funds in your Private Key Wallet";
                    const trxMessage = ` <p style="margin: 2px 0">You’ve received funds in your Private Key Wallet</p> <p style="margin: 2px 0">
        You’ve received ${amount} ${coin} in your Private Key Wallet. <br/> You can also view this transaction in your transaction history.</p> <br/> <p>Amount Received
          ${amount} ${coin}</p><br/><br/> Best Regards <br/>  <p>Kryptwallet Team </p>`;
                    yield (0, mailer_1.default)(email, trxMessage, subject);
                    console.log("Mail Sent");
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
    // async pk(trnx: Transaction, userFrom): Promise<void> {
    //   try {
    //     if (trnx.type === "debit") {
    //       await TransactionModel.create({
    //         ...trnx,
    //         to: "BlockSimulation",
    //         status: "pending ",
    //         userFrom: userFrom.userId,
    //         type: "requestpk",
    //         WID: userFrom.address,
    //       })
    //         .then((res) => {
    //           res.save();
    //         })
    //         .catch((e) => {
    //           throw new Error(e.message);
    //         });
    //     }
    //   } catch (error) {
    //     throw new Error(`${error}`);
    //   }
    // }
    // async validate(id: string): Promise<void> {
    //   try {
    //     await TransactionModel.updateOne(
    //       { _id: id },
    //       {
    //         status: "confirmed",
    //       }
    //     );
    //   } catch (error) {
    //     throw new Error(`${error}`);
    //   }
    // }
    editTransactionStatus(id, status, date, 
    // code: string,
    amount, 
    // type: string,
    to) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield exports.TransactionModel.findById(id);
                console.log(transaction);
                if (transaction) {
                    transaction.set({ status: status || transaction.status });
                    transaction.set({ createdAt: date || transaction.createdAt });
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
                // console.log(id);
                // Find the transaction
                const transaction = yield exports.TransactionModel.findById(id);
                console.log(transaction);
                if (!transaction) {
                    throw new Error("Transaction not found");
                }
                // Find the wallet based on the transaction details
                const wallet = yield wallet_1.WalletModel.findOneAndUpdate({
                    address: transaction.WID,
                });
                console.log(wallet);
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                // If activatedCoins is not an array, set it to an empty array
                if (!Array.isArray(wallet.activatedCoins)) {
                    wallet.activatedCoins = [];
                }
                const cryptoIndex = wallet.activatedCoins.findIndex((coin) => coin.code === transaction.code);
                if (cryptoIndex !== -1) {
                    if (type === "credit") {
                        console.log("b4 index", wallet.activatedCoins[cryptoIndex]);
                        wallet.activatedCoins[cryptoIndex].amount = wallet.activatedCoins[cryptoIndex].amount -= amount;
                        console.log("index after revert", wallet.activatedCoins[cryptoIndex]);
                    }
                    else {
                        wallet.activatedCoins[cryptoIndex].amount = wallet.activatedCoins[cryptoIndex].amount += amount;
                        console.log("index after revert", wallet.activatedCoins[cryptoIndex]);
                    }
                    // Save the updated wallet
                    const savedWallet = yield wallet.save();
                    if (!savedWallet) {
                        throw new Error("Error saving the updated wallet");
                    }
                    // Log the saved wallet to check if it reflects the changes
                    console.log("Saved wallet after update:", savedWallet);
                }
                else {
                    throw new Error("Index not found");
                }
                // Finally, delete the transaction
                const deletedTransaction = yield exports.TransactionModel.deleteOne({ _id: id });
                if (!deletedTransaction) {
                    throw new Error("Error deleting the transaction");
                }
                // Log the deleted transaction to check if it was deleted successfully
                console.log("Deleted transaction:", deletedTransaction);
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = TransactionStore;
