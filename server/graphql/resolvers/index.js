const userResolvers = require("./users");
const messagesResolvers = require("./messages");

module.exports = {
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...userResolvers.Query,
    ...messagesResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messagesResolvers.Mutation,
  },
};
