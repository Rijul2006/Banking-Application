import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
        },

        toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
        },

        type: {
        type: String,
        enum: ["DEPOSIT", "WITHDRAWAL", "TRANSFER"],
        required: true
        },

        amount: {
        type: Number,
        required: true,
        min: 0.01
        },

        idempotencyKey: {
        type: String,
        required: true,
        unique: true,
        index: true
        },

        status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED"],
        default: "PENDING"
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;