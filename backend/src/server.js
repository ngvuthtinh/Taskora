const dotenv = require("dotenv");
const app = require("./app");
const connectDatabase = require("./config/db");

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Taskora backend is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
}

startServer();
