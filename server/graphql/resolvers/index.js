const userResolvers = require("./users");
const messageResolvers = require("./messages");

module.exports = {
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
};
