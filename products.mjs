import { Router } from "express";
import { productsCollection } from "./database.mjs";
import { ObjectId } from "mongodb";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();
    res.json({ data: products, status: "OK" });
  } catch (error) {
    res.json({ error: error, status: "Error" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await productsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!product) {
      throw new Error("Product not found");
    }
    res.json({
      data: product,
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res) => {
  await productsCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: req.body,
    }
  );
  res.send("Product updated");
});

router.post("/", async (req, res) => {
  await productsCollection.insertOne(req.body);
  res.send("Product created");
});


router.post("/many", async (req, res) => {
  await productsCollection.insertOne(req.body);
  res.send("Product created");
});

router.delete("/:id", async (req, res) => {
  await productsCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.json({
    data: "Product Deleted",
  });
});

export default router;
