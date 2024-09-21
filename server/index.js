import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { uploadRoutes } from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to match your frontend URL
  })
);

const PORT = process.env.PORT;

// server test route

// app.use("/",(req,res)=>{
//     res.send("Hello World");
// })

//route for uplaoding the file
app.use("/file", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
