import express from "express";
import {
  createExam,
  addQuestionToExam,
  getExamForStudent,
  submitExam
} from "../controller/examController.js";

import auth from "../Middleware/Auth.Middleware.js";

const router = express.Router();

router.post("/", auth, createExam); 
router.post("/:examId/questions", auth, addQuestionToExam); 

router.get("/:id/student", auth, getExamForStudent); 
router.post("/:id/submit", auth, submitExam); 

export default router;
