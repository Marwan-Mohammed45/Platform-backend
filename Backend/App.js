import dotenv from "dotenv";
import express from "express";
import connectdb from "./DB/ConnectDB.js";
import AuthRoutes from "./routes/auth.routes.js";
import cors from "cors";
import examRoutes from "./routes/exams.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/api", AuthRoutes);
app.use("/api/exams", examRoutes); 

app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

connectdb();

app.listen(PORT, () => {
  console.log(`Platform is working on port ${PORT}🚀`);
});

export default app;
