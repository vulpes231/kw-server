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
const wallet_1 = require("../models/wallet");
const pk_1 = __importDefault(require("../models/pk"));
const pkStore = new pk_1.default();
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const privateKeys = yield pkStore.index();
        res.status(200).json(privateKeys);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
const createPkTrx = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userFrom = yield wallet_1.WalletModel.findOne({
            address: req.body.walletId,
        });
        yield pkStore.createPk(req.body, userFrom);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
//validating PK
const validatePk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pkStore.validate(req.body.id);
        res.status(201).json({ message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});
const deletePk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        console.log(userId);
        yield pkStore.deletePk(userId);
        res.status(204).json({ message: "success" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
const pkRoutes = (app) => {
    app.get("/", index);
    app.post("/requestpk", createPkTrx);
    app.put("/validatepk", validatePk);
    app.delete("/delete/:id", deletePk);
};
exports.default = pkRoutes;
