import express from "express";
import { CreateAddress,GetAddress,updateAddress,DeleteAddress,
} from "../controller/address/index.js";

const addressRouter = express.Router();

addressRouter.post("/", CreateAddress);        
addressRouter.get("/:userId", GetAddress);      
addressRouter.put("/:id", updateAddress);       
addressRouter.delete("/:id", DeleteAddress);   

export { addressRouter };
