// middlewares/multer.ts
import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory buffer
const upload = multer({ storage });

export default upload;
