import { Request, Response, Router } from "express";
import TransactionStore, { Transaction } from "../models/transaction";
import { WalletModel } from "../models/wallet";

const transactionStore = new TransactionStore();

const index = async (req: Request, res: Response) => {
  try {
    const transactions = await transactionStore.index();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json(error);
  }
};

const createTransaction = async (req: Request, res: Response) => {
  try {
    let userFrom = await WalletModel.findOne({
      address: req.body.walletId,
    });
    let userTo = await WalletModel.findOne({
      "activatedCoins.address": req.body.to,
    });
    await transactionStore.create(req.body, userFrom, userTo);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const adminCreateTransaction = async (req: Request, res: Response) => {
  try {
    let userFrom = await WalletModel.find({
      address: req.body.WID,
    });
    let userTo = await WalletModel.find({
      "activatedCoins.address": req.body.to,
    });
    await transactionStore.adminCreate(req.body, userFrom, userTo);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const confirmTransaction = async (req: Request, res: Response) => {
  try {
    let userFrom = await WalletModel.findOne({
      address: req.body.walletId,
    });
    let userTo = await WalletModel.findOne({
      "activatedCoins.address": req.body.to,
    });
    await transactionStore.confirmTrx(req.body, userFrom, userTo);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getWalletTransaction = async (req: Request, res: Response) => {
  try {
    const tx = await transactionStore.getTransactionByWalletId(
      req.params.walletId
    );
    res.status(200).json(tx);
  } catch (error) {
    res.status(404).json(error);
  }
};

// const pkTransaction = async (req: Request, res: Response) => {
//   try {
//     let userFrom = await WalletModel.findOne({
//       address: req.body.walletId,
//     });
//     await transactionStore.pk(req.body, userFrom);
//     res.status(201).json({ message: "success" });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

//validating PK
// const validatePk = async (req: Request, res: Response) => {
//   try {
//     await WalletModel.updateOne(
//       {
//         address: req.body.walletId,
//       },
//       {
//         validation: "done",
//         pk: true,
//         privateKey: req.body.pk,
//       }
//     );
//     await transactionStore.validate(req.body.id);
//     res.status(201).json({ message: "success" });
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

const getSingleTx = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // debugger;
    // console.log(id);
    const tx = await transactionStore.getTransactionByTxId(String(id));

    if (!tx) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ tx });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { status, date, amount, to } = req.body;
    const { id } = req.params;

    await transactionStore.editTransactionStatus(
      id,
      status,
      date,
      // code,
      amount,
      // type, // Fix: Correct the order of parameters
      to
    );
    res.status(204).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { type, amount } = req.body;
    // console.log(req.body);
    const userId = req.params.id;
    // console.log(userId);
    await transactionStore.deleteTransaction(userId, type, amount);
    res.status(204).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// const deletePk = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;
//     // console.log(userId);
//     await transactionStore.deletePk(userId);
//     res.status(204).json({ message: "success" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

const transactionRoutes = (app: Router) => {
  app.get("/", index);
  app.post("/", createTransaction);
  // app.post("/requestpk", pkTransaction);
  // app.put("/validatepk", validatePk);
  app.post("/admin", adminCreateTransaction);
  app.post("/admin/confirm", confirmTransaction);
  app.get("/:walletId", getWalletTransaction);
  app.put("/edit/:id", editTransactionStatus);
  app.get("/get/:id", getSingleTx);
  app.post("/delete/:id", deleteTransaction);
  // app.delete("/pk/:id", deletePk);
};

export default transactionRoutes;
