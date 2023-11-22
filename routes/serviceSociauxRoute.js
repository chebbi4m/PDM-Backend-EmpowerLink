import express from "express";
import {
  getServiceSociaux,
  getServiceSociauxById,
  deleteServiceSociaux,
  createServiceSociaux,
  updateServiceSociaux,
  addhopital,
} from "../controllers/serviceSociauxController.js";

const router = express.Router();

router.post('/addhopital', addhopital);
router.route("/add").post(createServiceSociaux);
router.route("/all").get(getServiceSociaux);
router.route("/serviceSociaux/:id").get(getServiceSociauxById);
router.route("/edit/:id").put(updateServiceSociaux);
router.route("/delete/:id").delete(deleteServiceSociaux);

export default router;
