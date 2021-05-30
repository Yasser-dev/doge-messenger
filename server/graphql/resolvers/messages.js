const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
const { User, Message } = require("../../models");

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const chatUser = await User.findOne({ where: { username: from } });
        if (!chatUser) {
          throw new UserInputError("User not found");
        }
        const usernames = [user.username, chatUser.username];
        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });

        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
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
