import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  EnhancedGenerateContentResponse,
  GoogleGenerativeAI,
} from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

const testQuery = async (
  prompt: string
): Promise<EnhancedGenerateContentResponse> => {
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response;
};

// Basic route
app.get("/", async (req: Request, res: Response) => {
  const input = req.body;
  try {
    if (!input) {
      res.status(400).send("Prompt query parameter is required");
      return;
    }

    // Call the testQuery function with the extracted prompt
    const response = await testQuery(input);

    // Send the result back to the client
    res.json(response);
  } catch (error) {
    res.status(500).send("An error occurred while processing your request");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
