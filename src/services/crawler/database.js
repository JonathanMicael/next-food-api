const mongoose = require("mongoose");
const url = process.env.DATABASE_URL;

module.exports = () => {
  const start = () => {
    try {
      console.log("> [database] Starting...");

      mongoose.connect(
        `mongodb+srv://${url}?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );

      console.log("> [database] Started...");
    } catch (error) {
      console.log("> [database] Error ...");
      console.log(error);
    }
  };

  return {
    start,
  };
};
