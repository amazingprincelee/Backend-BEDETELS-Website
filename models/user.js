import mongoose from "mongoose";



const usersSchema  = new mongoose.Schema({
    fullname: {type: String, required: true},
    username: {type: String, unique: true, required: true}, 
    email: {type: String, unique: true, sparse: true}, 
    phone: {type: String, unique: true, sparse: true}, 
    password: {type: String, required: true},
    generatedParentPassword: {type: String},
    gender: { type: String, enum: ["Male", "Female", "male", "female"]},
    address: String,
    profilePhoto: String,
    role: {type: String, enum: ['admin', "superadmin", "teacher", "parent"]},
    subjects: [{ type: String, default: null }],
    salary: { type: Number, default: 0 },
    designation: { type: String, default: null }, // e.g., "Senior Teacher", "Head of Department"
    createdAt: {type: Date, default: Date.now},
});



const User = mongoose.model("User", usersSchema);

export default User;