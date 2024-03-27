import express, { json } from "express";
import Products from "./products.mjs";
import Users from "./users.mjs";
import { expressjwt as jwt } from "express-jwt";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3001;

app.use(json());
app.use(jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"]
}).unless({path: ["/users/login", "/users/register"]})
);



app.use("/products", Products);
app.use("/users", Users);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
