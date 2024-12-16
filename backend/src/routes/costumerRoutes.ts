import { Router } from "express";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controllers/customerController";

const router = Router();

router.get("/", getCustomers);
router.post("/", createCustomer);
router.delete("/:customerId", deleteCustomer);
router.put("/:customerId", updateCustomer);

export default router;
