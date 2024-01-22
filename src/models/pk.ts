import mongoose, { Document, Schema, Model } from "mongoose";
import { WalletModel } from "./wallet";

//Create type of PK For TypeScript
export type PrivateKey = Document & {
  userFrom: string; // Assuming this is the user ID
  to: string;
  type: string;
  status: string;
  createdAt?: Date;
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
      // console.log(id);
      // Find the transaction
      const pk = await PkModel.findById(id);
      console.log(pk);

      if (!pk) {
        throw new Error("Pk not found");
      }

      const getWallet = await WalletModel.findOne({ userId: pk.userFrom });

      getWallet.validation = "false";
      getWallet.pkValue = 0;

      getWallet.save();

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
      await PkModel.updateOne(
        { _id: id },
        {
          status: "confirmed",
        }
      );
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
