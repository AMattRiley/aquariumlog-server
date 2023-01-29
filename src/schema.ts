import {initDB, getAllFish, closeDB} from './dbInterface/fetchDB';

import { fish } from './types';


const transformFish: (rows:any[]) => fish[] = (rows) => {
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

// The GraphQL schema in string form
export const typeDefs = `#graphql
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

// The resolvers
export const resolvers = {
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