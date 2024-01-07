"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../handlers/users"));
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The autogenerated id of the User
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         pin:
 *           type: string
 *           description: The pin for the user to complete transactions
 *         isVerified:
 *           type: boolean
 *           description: To check if the user's email is valid
 *         createdAt:
 *           type: Date
 *           description: The date the user was created
 *       example:
 *         _id: sbfisfuwhefe723293107ybgeigr6erg2398rgf
 *         username: David_Joe24
 *         email: David.joef@gmail.com
 *         password: uieh873hudsf68e1f17he01efe7319e
 *         pin: 73rh78fhewuhf3ey273eu8
 *         isVerified: true
 *         createdAt: 21-02-23
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a list of users
 *     tags:
 *       - User Endpoints
 *     responses:
 *       200:
 *         description: Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 * /users/register:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User Endpoints
 *     description: Sends a request to the server to create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: David_joe4
 *               email:
 *                 type: string
 *                 example: david.joe@email.com
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   example: ehbiyuyhyGAugy6e8we833h8923973
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 * /users/login:
 *   post:
 *     summary: Sign in a user
 *     tags:
 *       - User Endpoints
 *     description: Sends a request to the server to authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *             properties:
 *               email:
 *                 type: string
 *                 example: david.joe@email.com
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: ehbiyuyhyGAugy6e8we833h8923973
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 * /users/send%20verification%20code/{type}:
 *   post:
 *     summary: Send a verification code
 *     tags:
 *       - User Endpoints
 *     description: Sends a request to the server to send a verification code
 *     parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Type of message being sent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: david.joe@email.com
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: 098739
 *       409:
 *         description: User Exists
 *       500:
 *         description: Internal server error
 * /users/setpin:
 *   put:
 *     summary: Create a user transaction pin
 *     tags:
 *       - User Endpoints
 *     description: Sends a request to the server to set a user transaction pin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: number
 *                 example: 092346
 *     responses:
 *       204:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal server error
 * /users/verify:
 *   put:
 *     summary: Verify a user
 *     tags:
 *       - User Endpoints
 *     description: Sends a request to the server to change the verification status of a user
 *     responses:
 *       204:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal server error
 * /users/verify%20pin/{pin}:
 *   get:
 *     summary: Verify a user pin
 *     tags:
 *       - User Endpoints
 *     description: Sends a request to the server to verify a user pin.
 *     parameters:
 *       - in: path
 *         name: pin
 *         schema:
 *           type: integer
 *         required: true
 *         description: Pin of the user to verify
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     tags:
 *       - User Endpoints
 *     description: Updates the details of a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       204:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - User Endpoints
 *     description: Deletes a user along with their wallets and transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to be deleted
 *     responses:
 *       204:
 *         description: Success
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
const router = (0, express_1.Router)();
(0, users_1.default)(router);
exports.default = router;
