import express from "express";
import {
  getServiceSociaux,
  getServiceSociauxById,
  deleteServiceSociaux,
  createServiceSociaux,
  updateServiceSociaux,
  addhopital,
getServiceSociauxByNom,
getServiceSociauByNom,
addServiceSociaux,
addServiceToServiceSociaux
} from "../controllers/serviceSociauxController.js";

const router = express.Router();
router.post('/addhopital', addhopital);
router.route("/add").post(createServiceSociaux);
router.route("/all").get(getServiceSociaux);
router.route("/serviceSociaux/:id").get(getServiceSociauxById);
router.route("/edit/:id").put(updateServiceSociaux);
router.route("/delete/:id").delete(deleteServiceSociaux);
router.route("/nom/:nom").get(getServiceSociauxByNom);
router.route("/getServiceSociauByNom/:nom").get(getServiceSociauByNom);
router.post('/addService', addServiceSociaux);
router.post('/addServicee', addServiceToServiceSociaux);



export default router;