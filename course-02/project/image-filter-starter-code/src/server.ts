import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import fs from "fs";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get(
    "/filteredimage",
    async (req: express.Request, res: express.Response) => {
      const imageUrl: string = req.query.image_url;
      if (!imageUrl) {
        return res.send(404);
      }
      const filteredImage = await filterImageFromURL(imageUrl);
      res.sendFile(filteredImage);
      res.on("close", () => {
        fs.unlinkSync(filteredImage);
        console.info("deleted temp file:", filteredImage);
      });
    },
  );

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (_req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
