import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

RatingSchema.index({ store: 1, user: 1 }, { unique: true });

export default mongoose.model('Rating', RatingSchema);
