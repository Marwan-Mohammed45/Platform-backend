import Exam from "../Models/exam.model.js";

// ================== إنشاء امتحان ==================
export const createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      allowedClasses,
      startAt,
      endAt,
      durationMinutes
    } = req.body;

    const files = (req.files || []).map(file => ({
      filename: file.filename,
      url: `/uploads/exam/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size
    }));

    const parsedClasses = Array.isArray(allowedClasses)
      ? allowedClasses
      : JSON.parse(allowedClasses || "[]");

    const exam = await Exam.create({
      title,
      description,
      createdBy: req.user._id,
      allowedClasses: parsedClasses,
      startAt,
      endAt,
      durationMinutes,
      files,
      questions: []
    });

    res.status(201).json({ success: true, exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================== إضافة سؤال أو مجموعة أسئلة ==================
export const addQuestionToExam = async (req, res) => {
  try {
    const { examId } = req.params;
    let questions = req.body;

    // تأكد من أن questions array
    if (!Array.isArray(questions)) {
      questions = [questions]; // لو سؤال واحد فقط
    }

    // تحقق من وجود exam
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // أضف كل سؤال
    questions.forEach(q => {
      exam.questions.push({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer
      });
    });

    await exam.save();

    res.status(201).json({
      success: true,
      message: `${questions.length} question(s) added`,
      questionsCount: exam.questions.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================== عرض الامتحان للطالب ==================
export const getExamForStudent = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .select("-questions.correctAnswer") // نخفي الإجابات الصحيحة
      .populate("createdBy", "name");

    if (!exam || !exam.isPublished) {
      return res.status(404).json({ message: "Exam not available" });
    }

    res.json({ success: true, exam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================== تقديم الامتحان ==================
export const submitExam = async (req, res) => {
  try {
    const { answers } = req.body; 
    // answers = [{ questionId, answer }]

    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    let score = 0;

    exam.questions.forEach(q => {
      const studentAnswer = answers.find(a => a.questionId === q._id.toString());
      if (studentAnswer && studentAnswer.answer === q.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = exam.questions.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    res.json({
      success: true,
      totalQuestions,
      correctAnswers: score,
      scoreOutOf100: Math.round(percentage) // الدرجة على 100
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
