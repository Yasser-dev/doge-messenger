const userResolvers = require("./users");
const messagesResolvers = require("./messages");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...messagesResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messagesResolvers.Mutation,
  },
};
