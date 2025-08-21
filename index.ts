import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000", // local frontend
  "https://rpkpwsi.onrender.com", // deployed frontend
  "https://api.rpkpwsi.com" // production API
];

app.use(cookieParser());
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, origin); // allow request
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // allow cookies
//   })
// );


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);  // allow request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // ✅ allow cookies / tokens
}));



app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Happy Path!",
  });
});

app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome!" });
});

app.post("/admin/create", verifyToken, verifyRoles("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

import AuthRoutes from "./routes/auth.route";
import connectDB from "./config/db";
import { verifyRoles, verifyToken } from "./middleware/auth.middleware";
app.use("/api/v1", AuthRoutes);

connectDB();

app.listen(PORT, () =>
  console.log(`I am Your Server and happy to help my home is  :  ${PORT}`)
);
