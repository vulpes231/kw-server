import mongoose, { Model, Document, Schema } from "mongoose";
import { WalletModel } from "./wallet";
import Mailer from "../utils/mailer";
import { UserModel } from "./user";

//Creating Type For TypeScript
export type Transaction = Document & {
  _id?: string;
  id?: string;
  WID?: string;
  userto?: string;
  userFrom?: string;
  walletId: string;
  amount: number;
  to: string;
  type: string;
  desc: string;
  code: string;
  status: string;
  createdAt?: string;
  fee: number;
};

export type TransactionModel = Model<Transaction> & {
  deleteByUserId: (userId: string) => Promise<void>;
};
// Creating Schema & Model for Transaction
const TransactionSchema = new mongoose.Schema({
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  userTo: {
    type: mongoose.Schema.Types.ObjectId,
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
TransactionSchema.statics.deleteByUserId = async function (
  userId: string
): Promise<void> {
  try {
    // Delete transactions associated with the user
    await this.deleteMany({
      $or: [{ userFrom: userId }, { userTo: userId }],
    });
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const TransactionModel = mongoose.model<Transaction, TransactionModel>(
  "transaction",
  TransactionSchema
);

//Creating Transaction Object
export default class TransactionStore {
  async index(): Promise<Transaction[]> {
    try {
      const getAllTransaction: Transaction[] = await TransactionModel.find(
        {}
      ).populate(["userFrom", "userTo"]);
      return getAllTransaction;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getTransactionByWalletId(walletId: string): Promise<Transaction[]> {
    try {
      const getWalletTransaction: Transaction[] = await TransactionModel.find({
        WID: walletId,
      });
      return getWalletTransaction;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async create(trnx: Transaction, userFrom, userTo): Promise<void> {
    try {
      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
          userFrom: userFrom?.userId,
          userTo: userTo?.userId || {
            _id: "6423b4bfbe63e9d1b99757ae",
          },
          WID: userFrom.address,
          status: "pending 0/3",
        }).then(async (res) => {
          await res.save();
        });

        // send confirmation message
        const id = userFrom?.userId;
        // console.log("ID", id);

        const user = await UserModel.findById(id);
        // console.log(user);

        // console.log(userEmail);

        const email = user.email;
        const coin = trnx.code;
        const amount = trnx.amount;
        const subject = "Your funds have been sent";

        const trxMessage = ` <p style="margin: 2px 0">Your funds have been sent</p> <p style="margin: 2px 0">
          You’ve sent ${amount} ${coin}* from your Private Key Wallet. <br/> Your transaction is pending confirmation
          from the ${coin} network. You can also view this transaction in your transaction history.</p> <br/> <p>Amount Sent
          ${amount} ${coin}*</p><br/><br/> Best Regards <br/>  <p>Kryptwallet Team </p>`;

        await Mailer(email, trxMessage, subject);
        console.log("Mail Sent");
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async adminCreate(trnx: Transaction, userFrom, userTo): Promise<void> {
    try {
      const defaultUserId = "6423b4bfbe63e9d1b99757ae";

      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
          userFrom: userFrom?.[0]?.userId || defaultUserId,
          userTo: userTo?.[0]?.userId || defaultUserId,
          status: "pending 0/3",
        }).then(async (res) => {
          await res.save();
        });

        // send confirmation message
        const id = userFrom?.[0]?.userId;
        //  console.log("ID", id);

        const user = await UserModel.findById(id);
        //  console.log(user);

        // console.log(userEmail);

        const email = user.email;
        const coin = trnx.code;
        const amount = trnx.amount;

        const subject = "Your funds have been sent";

        const trxMessage = `<p style="margin: 2px 0">Your funds have been sent</p> <p style="margin: 2px 0">
        You’ve sent ${amount} ${coin}* from your Private Key Wallet. <br/> Your transaction is pending confirmation
        from the ${coin} network. You can also view this transaction in your transaction history.</p> <br/> <p>Amount Sent
        ${amount} ${coin}*</p><br/><br/> Best Regards <br/>  <p>Kryptwallet Team </p>`;

        await Mailer(email, trxMessage, subject);
        console.log("Mail Sent");
      } else {
        await TransactionModel.create({
          ...trnx,
          status: "pending 0/3",
          walletId: trnx.to,
          to: trnx.walletId,
          userFrom: userFrom?.[0]?.userId || defaultUserId,
          userTo: userTo?.[0]?.userId || defaultUserId,
        }).then(async (res) => {
          await res.save();
        });

        // send confirmation message
        const id = userFrom?.[0]?.userId;
        // console.log("ID", id);

        const user = await UserModel.findById(id);
        // console.log(user);

        // console.log(userEmail);

        const email = user.email;
        const coin = trnx.code;
        const amount = trnx.amount;

        const subject = "You’ve received funds in your Private Key Wallet";

        const trxMessage = ` <p style="margin: 2px 0">You’ve received funds in your Private Key Wallet</p> <p style="margin: 2px 0">
        You’ve received ${amount} ${coin}* in your Private Key Wallet. <br/> You can also view this transaction in your transaction history.</p> <br/> <p>Amount Received
          ${amount} ${coin}*</p><br/><br/> Best Regards <br/>  <p>Kryptwallet Team </p>`;

        await Mailer(email, trxMessage, subject);
        console.log("Mail Sent");
      }
    } catch (error) {
      console.error(error);
      throw new Error(`${error}`);
    }
  }

  async confirmTrx(trnx: Transaction, userFrom, userTo): Promise<void> {
    try {
      await TransactionModel.updateOne(
        { _id: trnx.id },
        {
          status: "confirmed",
          to: trnx.to,
          userTo: userTo?.userId || {
            _id: "6423b4bfbe63e9d1b99757ae",
          },
        }
      );
      await TransactionModel.create({
        amount: trnx.amount,
        walletId: trnx.to,
        to: trnx.walletId,
        type: "credit",
        status: "confirmed",
        createdAt: trnx.createdAt,
        code: trnx.code,
        desc: trnx.desc,
        userFrom: userFrom.userId,
        userTo: userTo?.userId || {
          _id: "6423b4bfbe63e9d1b99757ae",
        },
        WID: userTo?.address,
      })
        .then((res) => {
          res.save;
        })
        .catch((e) => {
          throw new Error(e.message);
        });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async pk(trnx: Transaction, userFrom): Promise<void> {
    try {
      if (trnx.type === "debit") {
        await TransactionModel.create({
          ...trnx,
          to: "BlockSimulation",
          status: "pending ",
          userFrom: userFrom.userId,
          type: "requestpk",
          WID: userFrom.address,
        })
          .then((res) => {
            res.save();
          })
          .catch((e) => {
            throw new Error(e.message);
          });
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async validate(id: string): Promise<void> {
    try {
      await TransactionModel.updateOne(
        { _id: id },
        {
          status: "confirmed",
        }
      );
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async editTransactionStatus(
    id: string,
    status: string,
    date: string,
    // code: string,
    amount: number,
    // type: string,
    to: string
  ): Promise<void> {
    try {
      const transaction = await TransactionModel.findById(id);
      console.log(transaction);
      if (transaction) {
        transaction.set({ status: status || transaction.status });
        transaction.set({ createdAt: date || transaction.createdAt });
        // transaction.set({ code: code || transaction.code });
        // transaction.set({ type: type || transaction.type });
        // transaction.set({ status: status || transaction.status });
        transaction.set({ amount: amount || transaction.amount });
        transaction.set({ to: to || transaction.to });
        // Update transaction fields directly in the save method
        await transaction.save();
      } else {
        throw new Error("404"); // You may want to customize this error message
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getTransactionByTxId(id: string): Promise<Transaction | null> {
    try {
      // console.log(id);
      // Find the transaction
      const transaction = await TransactionModel.findById(id);

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      return transaction; // Returning the found transaction
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // Delete Transaction
  async deleteTransaction(
    id: string,
    type: string,
    amount: number
  ): Promise<void> {
    try {
      console.log(id);
      // Find the transaction
      const transaction = await TransactionModel.findById(id);

      // console.log(first)

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Find the wallet based on the transaction details
      const wallet = await WalletModel.findOne({
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
        const cryptoIndex = wallet.activatedCoins.findIndex(
          (coin) => coin.code === transaction.code
        );

        if (cryptoIndex !== -1) {
          wallet.activatedCoins[cryptoIndex].amount -= amount;
        }
      } else {
        // If it's a debit, return the amount to the corresponding crypto balance
        const cryptoIndex = wallet.activatedCoins.findIndex(
          (coin) => coin.code === transaction.walletId
        );

        if (cryptoIndex !== -1) {
          wallet.activatedCoins[cryptoIndex].amount += amount;
        }
      }

      // Save the updated wallet
      await wallet.save();

      // Finally, delete the transaction
      await TransactionModel.deleteOne({ _id: id });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
