const express = require("express");
const  verifyToken  = require("../middleware/authTokens")
const router = express.Router()
const { PrismaClient } =   require("@prisma/client")
const prisma = new PrismaClient()

//save message from support
router.post("/create" , verifyToken.verifyToken, async (req , res) => {

    console.log()
    try {
        
        const { title , message } = req.body
        const userId = req.user?.userId
        
        if(!title || !message){
            return res.status(400).json({ error : "Subject and Message are required" })
        }

        const contact = await prisma.contact.create({
            data : {
                title:title,
                message: message,
                user : {
                    connect : {
                        id : userId
                    }
                }
            }
        })

        res.status(201).json(contact)
         
    } catch (error) {
        console.log(error)
        res.status(500).json({ error : error.message })
    }

})


module.exports = router