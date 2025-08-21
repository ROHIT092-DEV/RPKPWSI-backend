
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/auth.model";

interface AuthRequest extends Request {
  user?: any;
}

interface CustomJwtPayload extends JwtPayload {
  _id: string;
}

export const verifyToken = async (req: AuthRequest,
  res: Response,
  next: NextFunction) =>{
      try {

          const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

  
        if(!token){
          return res.status(400).json({message : "Unauthorized Access"})
        }

     if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is not defined");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as CustomJwtPayload;
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

      if(!user){
        return res.status(400).json({message : "Invalid Access"})
      }


       req.user = user;
        next()
        
      } catch (error) {
        return res.status(500).json({
          message : "Something went wrong with server",
          error
        })
      }

  }


  // ✅ Middleware to verify role



export const verifyRoles = (...roles: string[]) =>{
  return (req:AuthRequest, res: Response, next:NextFunction ) =>{
     if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Insufficient role" });
    }
    next();


  }

} 