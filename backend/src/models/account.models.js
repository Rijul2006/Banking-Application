import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance:{
        type: Number,
        default: 0,
        min: 0
    },
    status:{
        type: String,
        enum: ["Active", "Frozen", "Blocked"],
        default: "Active"
    }
}, {
    timestamps: true
});

const Account = mongoose.model("Account", accountSchema);

export default Account;