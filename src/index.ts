import "express-async-errors"
import express from "express";
import { routes } from "./routes";
import { NextFunction, Request, Response } from "express";
import { AppError } from "./errors/appError";

const app = express();

app.use(express.json());

app.use(routes)

// Error Handling
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if(err instanceof AppError){
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message
    })
  }

  next()
})

app.listen(3333, () => console.log("Working"));
