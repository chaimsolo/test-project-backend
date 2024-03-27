import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://netefwork:Netef123@shkalimcluster.a5uqyzl.mongodb.net/?retryWrites=true&w=majority&appName=ShkalimCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let cluster;
try {
  cluster = await client.connect();
} catch (e) {
  console.error(e);
}

const db = cluster.db("totahim");
export const productsCollection = db.collection("products");
export const usersCollection = db.collection("users");
export default db;
