import app from "./app.js";
import connect from "./config/connection.js";

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
