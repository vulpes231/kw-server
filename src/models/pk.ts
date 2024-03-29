import mongoose, { Document, Schema, Model } from "mongoose";
import { WalletModel } from "./wallet";
import generatePk from "../utils/genPk";

//Create type of PK For TypeScript
export type PrivateKey = Document & {
  userFrom: string; // Assuming this is the user ID
  to: string;
  type: string;
  status: string;
  createdAt?: Date;
  amount: number;
  code: string;
};

const PkSchema = new mongoose.Schema({
  userFrom: {
    type: mongoose.Schema.Types.ObjectId,
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

export const PkModel: Model<PrivateKey> = mongoose.model<PrivateKey>(
  "pk",
  PkSchema
);

export default class PkStore {
  async index(): Promise<PrivateKey[]> {
    try {
      const getAllPk: PrivateKey[] = await PkModel.find({}).populate(
        "userFrom"
      );
      return getAllPk;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  // delete pk
  async deletePk(id: string): Promise<void> {
    try {
      const pk = await PkModel.findById(id);
      console.log(pk);

      if (!pk) {
        throw new Error("Pk not found");
      }

      await WalletModel.updateOne(
        { userId: pk.userFrom },
        {
          $set: {
            validation: "false",
            pkValue: 0,
            pk: false,
            privateKey: null,
          },
        }
      );

      await PkModel.deleteOne({ _id: id });
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async createPk(pk: PrivateKey, userFrom): Promise<void> {
    try {
      const createdPk = await PkModel.create({
        ...pk,
        to: "BlockSimulation",
        status: "pending",
        userFrom: userFrom.userId,
        type: "requestpk",
      });

      console.log(createdPk);
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async validate(id: string): Promise<void> {
    try {
      // Step 1: Retrieve wallet.userid based on pk.userfrom
      const pk = await PkModel.findById(id);
      if (!pk) {
        throw new Error(`Pk not found with id: ${id}`);
      }
      pk.status = "confirmed";
      await pk.save();

      const walletId = pk.userFrom;

      const genPk = generatePk();

      // Step 2: Update the wallet's status
      await WalletModel.updateOne(
        {
          userId: walletId,
        },
        {
          validation: "done",
          pk: true,
          privateKey: genPk,
        }
      );
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
