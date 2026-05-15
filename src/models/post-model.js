import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default model('Post', PostSchema);