"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guestController_1 = require("@/controllers/guestController");
const auth_1 = require("@/middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', guestController_1.GuestController.getAllGuests);
router.get('/:id', guestController_1.GuestController.getGuestById);
exports.default = router;
//# sourceMappingURL=guests.js.map