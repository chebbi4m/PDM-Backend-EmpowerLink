import express from "express";
import {
    getSoins,
    getSoinById,
    deleteSoin,
    createSoin,
    updateSoin,
    getSoinByNom,
    makeReservation,
  } from "../controllers/soinController.js";
  
  const router = express.Router();
  router.route("/all").get(getSoins);
  router.route("/create").post(createSoin);
  router.route("/:id").get(getSoinById);
  router.route("/update/:id").put(updateSoin);
  router.route("/delete/:id").delete(deleteSoin);
  router.route("/nom/:nom").get(getSoinByNom);
  router.route("/reserve").post(makeReservation);

  
  export default router;