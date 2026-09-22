import "dotenv/config";
import { app } from "./app.js";
import { connectDb } from "./config/Db.js";

const port = Number(process.env.PORT ?? 5000);

await connectDb();

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
