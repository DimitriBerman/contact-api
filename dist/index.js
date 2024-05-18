"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const API_PORT = 4000;
app.get("/", (req, res) => {
    res.status(200).json("Hello from the server!!!");
});
app.listen(API_PORT, () => {
    console.log(`Contacts-api is listening on port ${API_PORT}`);
});
