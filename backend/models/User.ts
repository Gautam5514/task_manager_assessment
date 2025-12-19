import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from './types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUserDocument> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

(userSchema as any).pre('save', async function (this: any) {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
});

// Explicitly cast to any to resolve Mongoose/TS type conflicts for model methods
const User = mongoose.model<IUserDocument>('User', userSchema) as any;

export default User;
