import express from 'express'
import { getCurrentUser, loginUser, registerUser } from '../controllers/auth.controller'
import upload from '../middleware/multer'
import { verifyToken } from '../middleware/auth.middleware'


const router = express.Router()


router.post("/auth",upload.single("avatar"),registerUser)
router.post("/login", loginUser)
router.get("/me",verifyToken ,getCurrentUser)

export default router;