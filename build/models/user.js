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
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = __importDefault(require("../utils/mailer"));
const wallet_1 = require("./wallet");
const transaction_1 = require("./transaction");
//Creating Schema & Model of User for DB
const userSchema = new mongoose_1.default.Schema({
    username: String,
    email: String,
    pin: { type: String, default: "" },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
exports.UserModel = mongoose_1.default.model("user", userSchema);
//Get Round and Keys
const { ROUND, BCRYPTKEY, SECRET_KEY } = process.env;
//Creating Users Functions
class UserStore {
    //Getting All Users
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield exports.UserModel.find({});
                return users;
            }
            catch (err) {
                throw new Error(`Error occured ${err}`);
            }
        });
    }
    //Sending Verification Code.
    sendCode(mail, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subject = "Your verification code";
                const rand = parseInt(`${Math.random() * (999999 - 100000) + 100000}`);
                const message = `<p style="margin: 2px 0"> <p>Welcome to Krypt</p> <p style="margin: 2px 0">Verify your email address </p> <p> Your verification code is: <strong>${rand}</strong></p><p> This one time code expires in 10 minutes. <br/><br/> Best Regards <br/>  - ${mail}</p>`;
                const otpMessage = `
          <p>You just requested a new OTP</p>
          <p>Here is your verification code: <strong>${rand}</strong> </p> 
          <p>The OTP expires in 10 minutes. Thanks for using krypt.</p> Best Regards <br/><br/>  - ${mail}</p>`;
                if (type === "otp") {
                    yield (0, mailer_1.default)(mail, otpMessage, subject);
                }
                else {
                    yield (0, mailer_1.default)(mail, message, subject);
                }
                return rand;
            }
            catch (error) {
                throw new Error(`Error occured ${error}`);
            }
        });
    }
    //Creating A new User
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield exports.UserModel.findOne({ email: user.email });
                if (checkForUser) {
                    throw new Error(`409`);
                }
                const newUser = yield exports.UserModel.create(Object.assign({}, user));
                newUser.save();
                //authenticate user
                const auth = {
                    id: newUser === null || newUser === void 0 ? void 0 : newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                };
                const token = jsonwebtoken_1.default.sign(auth, String(SECRET_KEY));
                return token;
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    // Logging In Users (Authentication)
    authenticate(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield exports.UserModel.findOne({
                    email: email.toLowerCase(),
                });
                if (checkForUser) {
                    const user = {
                        id: checkForUser._id,
                        username: checkForUser === null || checkForUser === void 0 ? void 0 : checkForUser.username,
                        email: checkForUser === null || checkForUser === void 0 ? void 0 : checkForUser.email,
                    };
                    const token = jsonwebtoken_1.default.sign(user, String(SECRET_KEY));
                    return Object.assign(Object.assign({}, user), { isVerified: checkForUser.isVerified, token });
                }
                else {
                    throw new Error("404");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Creating User Transaction Pin
    setUserPin(id, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield exports.UserModel.findById(id);
                const hash = yield bcryptjs_1.default.hash(pin + BCRYPTKEY, Number(ROUND));
                if (checkForUser) {
                    checkForUser.pin = hash;
                    checkForUser.save();
                }
                else {
                    throw new Error("400");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Verifing User Email Address
    verifyUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield exports.UserModel.findById(id);
                if (checkForUser) {
                    checkForUser.isVerified = true;
                    checkForUser.save();
                }
                else {
                    throw new Error("400");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    //Verify User Transaction Pin
    verifyPin(id, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield exports.UserModel.findById(id);
                if (checkForUser) {
                    if (bcryptjs_1.default.compareSync(pin + BCRYPTKEY, checkForUser === null || checkForUser === void 0 ? void 0 : checkForUser.pin)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield exports.UserModel.findById(id);
                if (!user) {
                    throw new Error("User not found");
                }
                return {
                    _id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    pin: user.pin,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt,
                };
            }
            catch (error) {
                // Handle other errors if needed
                throw new Error(`${error}`);
            }
        });
    }
    editUser(id, email, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield exports.UserModel.findById(id);
                if (user) {
                    // Update user fields
                    user.set({ email: email || user.email });
                    user.set({ username: username || user.username });
                    yield user.save();
                }
                else {
                    throw new Error("404");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
    // Delete User
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkForUser = yield exports.UserModel.findById(id);
                if (checkForUser) {
                    // Delete associated wallets and transactions
                    yield wallet_1.WalletModel.deleteByUserId(id);
                    yield transaction_1.TransactionModel.deleteByUserId(id);
                    // Now, delete the user
                    yield checkForUser.remove();
                }
                else {
                    throw new Error("404");
                }
            }
            catch (error) {
                throw new Error(`${error}`);
            }
        });
    }
}
exports.default = UserStore;
