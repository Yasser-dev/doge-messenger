const { UserInputError, AuthenticationError } = require("apollo-server");
const { User, Message } = require("../../models");

module.exports = {
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const receiver = await User.findOne({ where: { username: to } });
        if (content.trim() === "")
          throw new UserInputError("Message can't be empty");
        if (!receiver) {
          throw new UserInputError("User not found");
        } else if (receiver.username === user.username) {
          throw new UserInputError("Can't message yourself");
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });
        return message;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
