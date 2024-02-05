import { Request, Response, Router } from "express";
import { WalletModel } from "../models/wallet";

import PkStore, { PrivateKey } from "../models/pk";

const pkStore = new PkStore();

const index = async (req: Request, res: Response) => {
  try {
    const privateKeys = await pkStore.index();
    res.status(200).json(privateKeys);
  } catch (error) {
    res.status(404).json(error);
  }
};

const createPkTrx = async (req: Request, res: Response) => {
  try {
    let userFrom = await WalletModel.findOne({
      address: req.body.walletId,
    });
    await pkStore.createPk(req.body, userFrom);
    res.status(201).json({ message: "success" });
  } catch (error) {
    res.status(400).json(error);
  }
};

//validating PK
const validatePk = async (req: Request, res: Response) => {
  try {
    await pkStore.validate(req.body.id);
    res.status(201).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const deletePk = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    await pkStore.deletePk(userId);
    res.status(204).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const pkRoutes = (app: Router) => {
  app.get("/", index);
  app.post("/requestpk", createPkTrx);
  app.put("/validatepk", validatePk);
  app.delete("/delete/:id", deletePk);
};

export default pkRoutes;
