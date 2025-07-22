import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
// import path from 'path'
// import bycrypt from 'bcrypt'
// import pkg from 'jsonwebtoken';
import { OpenAI } from '@langchain/openai';

// import langchain from 'langchain'
// const langchain=require("langchain")

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const llm=new OpenAI({
    // apiKey:process.env.OPENAI_API_KEY
})
await llm.invoke("Who is prime minister of india").then(r=>{
  console.log(r)
}).catch(er=>{
  console.log("nodemon start openai.js",er)
})


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app is running on ${port} `);
});

// nodemon start openai.js

// node openai.js
