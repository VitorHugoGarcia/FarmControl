import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/xml" || file.originalname.endsWith(".xml")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas arquivos XML são permitidos"));
    }
  }
});