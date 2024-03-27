import { Router } from "express";
import { usersCollection } from "./database.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {randomBytes} from "crypto";
// import { expressjwt as jwt } from "express-jwt"
console.log(randomBytes(64).toString("hex"));
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await usersCollection.find()
      .project({ password: 0 })
      .toArray();
    res.json({
      data: await usersCollection.find().toArray(),
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth === null) res.send("No token found");
    const token = auth.split(" ")[1];
    jwt.verify(token, "Netef Makes Argazim");
    res.json({
      data: await usersCollection.findOne({ _id: new ObjectId(req.params.id) },
        { projection: { password: 0 } }),
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { password } = req.body;
    const saltRounds = 10;
    req.body["password"] = await bcrypt.hash(password, saltRounds);
    await usersCollection.insertOne(req.body);
    res.status(201).send("User Created");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await usersCollection.findOne({ username });
    if (await bcrypt.compare(password, user["password"])) {
      delete user["password"];
      jwt.sign({_id:user._id}, "Netef Makes Argazim", {
        algorithm: "HS256",
        // expiresIn: "100s"
      });
      // const token = jwt({ secret: "Netef Makes Argazim", algorithms: ["HS256"] });
      res.json({
        data: token,
        status: "OK",
      });
    } else {
      throw new Error("Password does not match");
    }
  } catch (error) {
    next(error);
  }
});

export default router;
