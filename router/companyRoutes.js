import express from "express";
import { 
  CreateCompany, GetCompanies, UpdateCompany, DeleteCompany 
} from "../controller/companyController/index.js";

const companyRouter = express.Router();

companyRouter.post("/", CreateCompany);
companyRouter.get("/", GetCompanies);
companyRouter.put("/:id", UpdateCompany);
companyRouter.delete("/:id", DeleteCompany);

export { companyRouter };

