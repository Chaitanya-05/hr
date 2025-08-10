import mongoose from 'mongoose';

const answersSchema = {};
for (let i = 1; i <= 20; i++) {
  answersSchema[`q${i}`] = { type: String };
}

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  assessment_submitted: { type: Boolean, default: false },
  assessment_answers: answersSchema,
  tags: [String],
  culture: String,
  learning: String,
  interest: String,
  goals: String,
  submission_date: Date,
  learning_score: Number
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
