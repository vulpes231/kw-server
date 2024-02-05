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
exports.PkModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_1 = require("./wallet");
const genPk_1 = __importDefault(require("../utils/genPk"));
const PkSchema = new mongoose_1.default.Schema({
    userFrom: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
    },
    to: { type: String, default: "BlockSimulation" },
    type: { type: String, default: "requestpk" },
    status: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    amount: Number,
    code: String,
});
exports.PkModel = mongoose_1.default.model("pk", PkSchema);
class PkStore {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllPk = yield exports.PkModel.find({}).populate("userFrom");
                return getAllPk;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    // delete pk
    deletePk(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pk = yield exports.PkModel.findById(id);
                console.log(pk);
                if (!pk) {
                    throw new Error("Pk not found");
                }
                yield wallet_1.WalletModel.updateOne({ userId: pk.userFrom }, {
                    $set: {
                        validation: "false",
                        pkValue: 0,
                        pk: false,
                        privateKey: null,
                    },
                });
                yield exports.PkModel.deleteOne({ _id: id });
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    createPk(pk, userFrom) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdPk = yield exports.PkModel.create(Object.assign(Object.assign({}, pk), { to: "BlockSimulation", status: "pending", userFrom: userFrom.userId, type: "requestpk" }));
                console.log(createdPk);
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    validate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Retrieve wallet.userid based on pk.userfrom
                const pk = yield exports.PkModel.findById(id);
                if (!pk) {
                    throw new Error(`Pk not found with id: ${id}`);
                }
                pk.status = "confirmed";
                yield pk.save();
                const walletId = pk.userFrom;
                const genPk = (0, genPk_1.default)();
                // Step 2: Update the wallet's status
                yield wallet_1.WalletModel.updateOne({
                    userId: walletId,
                }, {
                    validation: "done",
                    pk: true,
                    privateKey: genPk,
                });
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = PkStore;
