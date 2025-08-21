"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("@/controllers/roomController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', roomController_1.RoomController.getAllRooms);
router.get('/availability', roomController_1.RoomController.checkAvailability);
router.get('/:id', roomController_1.RoomController.getRoomById);
router.post('/', (0, auth_1.authorize)(['admin']), roomController_1.RoomController.createRoom);
router.put('/:id', (0, auth_1.authorize)(['admin']), roomController_1.RoomController.updateRoom);
router.delete('/:id', (0, auth_1.authorize)(['admin']), roomController_1.RoomController.deleteRoom);
exports.default = router;
//# sourceMappingURL=rooms.js.map