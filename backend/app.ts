import "dotenv/config";
import express from "express";
import sequelize from "./config/dbConfig";
import db from "./models/index";
import routes from "./routes/index"
import cors from 'cors';



const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174'], // Allow requests only from the frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Make sure OPTIONS is allowed
  // allowedHeaders: ['Content-Type', 'Authorization'], // You may need to add other headers as required
  // preflightContinue: false,  // Ensures the OPTIONS request is handled properly
  // optionsSuccessStatus: 204 
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", routes.authRouter);
app.use("/api/user", routes.userRouter);
app.use("/api/post", routes.postRouter);


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await db.sequelize.sync({ alter: true });
    console.log(" Database synced successfully.");

    app.listen(port, () => {
      console.log(` Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
  }
};

startServer();
