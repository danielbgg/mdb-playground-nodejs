const { MongoClient } = require("mongodb");
const uri = process.env.ATLAS_URL;
const client = new MongoClient(uri);

async function run() {
  try {
    
    // Get the database and collection on which to run the operation
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    const movies2 = database.collection("movies2");

    // Query for movies that have a runtime less than 15 minutes
    const query = { runtime: { $lt: 15 } };

    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { _id: 0, title: 1, imdb: 1 },
    };

    // Execute query 
    const cursor = movies.find(query, options);

    // Print a message if no documents were found
    if ((await movies.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }

    // Print returned documents
    for await (const doc of cursor) {
      console.dir(doc);

      const options = { upsert: true };

      // Specify the update to set a value for the plot field
      doc.newPlot = `A harvest of random numbers, such as: ${Math.random()}`;
      // Update the first document that matches the filter
      const result = await movies2.insertOne(doc, options);

    }

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
