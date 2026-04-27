import express, { type Request, type Response, type NextFunction} from 'express'
import * as productService from '../services/product.ts'
import { appError } from '../../utils/appErrors.ts'
import { string } from 'zod'
const getAllproduct=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const product=await productService.getAllproduct()
        res.status(200).json({message:"product retrieved successfully",data:product})
        } catch (error) {
        next(error);
    } 
}
const getProductById=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const product_id=req.params.id
        const product=await productService.getProductById(product_id as string)
        res.status(200).json({message:"product retrieved successfully",data:product})
        } catch (error) {
        next(error);
    } 
}
export {getAllproduct,getProductById}