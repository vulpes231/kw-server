"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coins_1 = __importDefault(require("../handlers/coins"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Coin:
 *       type: object
 *       required:
 *         - coinName
 *         - code
 *         - img
 *       properties:
 *         _id:
 *           type: string
 *           description: The autogenerated id of the User
 *         coinName:
 *           type: string
 *           description: The name of the token/coin.
 *         code:
 *           type: string
 *           description: The currency code of the token/coin.
 *         img:
 *           type: string
 *           description: The link to the image file
 */
/**
 * @swagger
 * /coins:
 *  get:
 *    summary: Returns a list of all tokens.
 *    tags:
 *       - Coin Endpoints
 *    responses:
 *      200:
 *        description: successful
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Coin'
 *      404:
 *         description: Not found
 *      500:
 *         description: Internal server error.
 *  post:
 *      summary: Create a new Coin
 *      tags:
 *          - Coin Endpoints
 *      description: Sends request to the server to create a new Coin
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                 schema:
 *                          type: object
 *                          properties:
 *                              coinName:
 *                                  type: string
 *                                  example: bitcoin
 *                              code:
 *                                  type: string
 *                                  example: BTC
 *                              img:
 *                                  type: string
 *                                  example: https://img.mc/btc
 *
 *      responses:
 *           201:
 *              description: Success
 *              content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               message:
 *                                   type: string
 *                                   example: success
 *           400:
 *               description: Bad Request
 *           500:
 *               description: Internal server error
 */
(0, coins_1.default)(router);
exports.default = router;
