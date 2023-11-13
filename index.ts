import app from "./app";
import connectWithDB from "./src/config/db";

connectWithDB()

const port = process.env.port || 8000;
app.listen(port, () => {
	console.log(`Server running at port: ${port}`);
});


