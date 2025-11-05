import dotenv from "dotenv";
import Express from "express";
import connectdb from "./DB/ConnectDB.js";
import AuthRouthes from "./routes/auth.routes.js"
import cors from "cors";


dotenv.config();
const app =Express()
const Port =process.env.Port||4000;
app.use(Express.json());
app.use(cors());
app.use("/api",AuthRouthes);

app.get("/",(req,res) =>{
    res.send("Server is working ✅ ")
});
connectdb();


app.listen(Port,() => {
    console.log(`Platform is working on  ${Port} ☝️ 🚀`);
})



