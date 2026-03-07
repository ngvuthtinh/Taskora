const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: "taskora-backend",
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    message: "Service is healthy",
  });
});

module.exports = router;
