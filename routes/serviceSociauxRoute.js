import express from "express";
import {
  getServiceSociaux,
  getServiceSociauxById,
  deleteServiceSociaux,
  createServiceSociaux,
  updateServiceSociaux,
} from "../controllers/serviceSociauxController.js";

const router = express.Router();

router.route("/add").post(createServiceSociaux);
router.route("/all").get(getServiceSociaux);
router.route("/serviceSociaux/:id").get(getServiceSociauxById);
router.route("/edit/:id").put(updateServiceSociaux);
router.route("/delete/:id").delete(deleteServiceSociaux);

export default router;
