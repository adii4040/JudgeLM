import app from "./app.js";
import connectDb from "./db/db.js";

const PORT = process.env.PORT || 3000;

connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API endpoint available at http://localhost:${PORT}/api/v1/evaluate`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed, server starting aborted:", err);
    });