import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
    console.log(`Server starts from port ${PORT}`);
});
