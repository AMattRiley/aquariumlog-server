const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const {initDB, getAllFish, closeDB} = require('./dbInterface/fetchDB');

// The GraphQL schema in string form
const typeDefs = `
  type Query { fish: [Fish] }
  type Fish {
    name: String,
    bodyType: Int,
    maxSize: Float,
    dhHigh: Float,
    dhLow: Float,
    phHigh: Float,
    phLow: Float,
    tempHigh: Float,
    tempLow: Float,
    genus: String,
    species: String,
    family: String,
    notes: String,
    imageURI: String }
`;

const transformFish = (rows) => {
  if (!rows) {
      return [];
  }
  return rows.map((value) => {
      const {bodyType, maxSize, dhHigh, dhLow, phHigh, phLow, tempHigh, tempLow, ...rest} = value;
      return {
          bodyType: parseInt(bodyType),
          maxSize: parseFloat(maxSize),
          dhHigh: parseFloat(dhHigh),
          dhLow: parseFloat(dhLow),
          phHigh: parseFloat(phHigh),
          phLow: parseFloat(phLow),
          tempHigh: parseFloat(tempHigh),
          tempLow: parseFloat(tempLow),
          ...rest
      };
  });
};

// The resolvers
const resolvers = {
  Query: {
    fish: async () => {
      try {
        const db = await initDB();
        const fishRows = await getAllFish(db);
        return transformFish(fishRows);
      } catch (err) {
        console.log(err);
        return [];
      }
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });
const PORT = 3000;

const app = express();

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); 

app.listen(PORT);