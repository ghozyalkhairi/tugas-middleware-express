import express, { Request, Response } from "express";
import router from "./routes/api";

const PORT = 3000;

function init() {
  const app = express();
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      message: "OK",
      data: null,
    });
  });

  app.use(router);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

init();
