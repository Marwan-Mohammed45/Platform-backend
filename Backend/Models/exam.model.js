import mongoose from "mongoose";

/* ================== Question Schema ================== */
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
  },
  correctAnswer: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true,
  },
});

/* ================== Exam Schema ================== */
const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  files: [
    {
      filename: String,
      url: String,
      mimeType: String,
      size: Number,
    },
  ],

  allowedClasses: [String],

  startAt: Date,
  endAt: Date,
  durationMinutes: Number,

  questions: [questionSchema],

  isPublished: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Exam", examSchema);
