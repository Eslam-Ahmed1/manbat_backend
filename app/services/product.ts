import Product from '../models/product.ts';
const getAllproduct=async()=>{
   return  await Product.find();

}
const getProductById=async(product_id:string)=>{
   return  await Product.find({_id:product_id});

}
export {getAllproduct,getProductById}