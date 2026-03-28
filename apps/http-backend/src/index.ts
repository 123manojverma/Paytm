import express from "express"
import dotenv from "dotenv"
import type {Request,Response} from "express"
import { prisma } from "@repo/db/client";
const client=prisma
dotenv.config()

const app=express()
app.use(express.json())

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server start at ${PORT}`)
})

app.post("/login",async(req:Request,res:Response)=>{
    const {name,email}=req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    try {
        const user=await client.user.create({
            data:{
                name:name,
                email:email,
            }
        })
        console.log("Created user:",user)
        return res.status(201).json({
            message:"User Created",
            user
        })
    } catch(e: any) {
        return res.status(500).json({ error: e.message });
    }
})

app.get("/info",async(req:Request,res:Response)=>{
    const email = req.query.email as string; // GET requests should use query params
    if (!email) {
         return res.status(400).json({ error: "Email query parameter is required" });
    }
    try {
        const user=await client.user.findUnique({
            where:{
                email
            }
        })
        return res.status(200).json({
            message:user
        })
    } catch(e: any) {
         return res.status(500).json({ error: e.message });
    }
})