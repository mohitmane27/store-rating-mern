import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 120, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  address: { type: String, required: true, maxlength: 400 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Store', StoreSchema);
