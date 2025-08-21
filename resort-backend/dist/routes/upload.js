"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uploadController_1 = require("@/controllers/uploadController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});
router.get("/", auth_1.authenticate, uploadController_1.UploadController.getAllFiles);
router.get("/:id", auth_1.authenticate, uploadController_1.UploadController.getFileById);
router.post("/", auth_1.authenticate, upload.single('file'), uploadController_1.UploadController.uploadFile);
router.put("/:id", auth_1.authenticate, uploadController_1.UploadController.updateFileUpload);
router.delete("/:id", auth_1.authenticate, uploadController_1.UploadController.deleteFileUpload);
router.get("/entity/:entityType/:entityId", auth_1.authenticate, uploadController_1.UploadController.getFilesByEntity);
router.get("/category/:category", auth_1.authenticate, uploadController_1.UploadController.getFilesByCategory);
router.get("/download/:id", auth_1.authenticate, uploadController_1.UploadController.downloadFile);
router.get("/view/:id", auth_1.authenticate, uploadController_1.UploadController.viewFile);
router.post("/room/:roomId/image", auth_1.authenticate, upload.single('image'), uploadController_1.UploadController.uploadRoomImage);
router.post("/guest/:guestId/document", auth_1.authenticate, upload.single('document'), uploadController_1.UploadController.uploadGuestDocument);
router.post("/payment/:paymentId/receipt", auth_1.authenticate, upload.single('receipt'), uploadController_1.UploadController.uploadPaymentReceipt);
router.post("/maintenance/cleanup", auth_1.authenticate, uploadController_1.UploadController.cleanupOrphanedFiles);
router.get("/stats/overview", auth_1.authenticate, uploadController_1.UploadController.getUploadStats);
router.get("/config/:category", auth_1.authenticate, uploadController_1.UploadController.getUploadConfig);
router.get("/categories/available", auth_1.authenticate, uploadController_1.UploadController.getAvailableCategories);
exports.default = router;
//# sourceMappingURL=upload.js.map