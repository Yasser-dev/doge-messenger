const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User, Message } = require("../models");
const { JWT_SECRET } = require("../config/env.json");
module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "Username cannot be empty";
        if (password.trim() === "")
          errors.password = "Password cannot be empty";
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad Input", { errors });
        }
        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          errors.password = "Incorrect Password";
          throw new UserInputError("Incorrect Password", { errors });
        }

        // JWT
        const token = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: "3h",
        });
        // user.token = token;
        return {
          ...user.toJSON(),
          token,
          createdAt: user.createdAt.toISOString(),
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};

      try {
        // Validate input
        if (email.trim() === "") errors.email = "Email can not be empty";
        if (username.trim() === "")
          errors.username = "Username can not be empty";
        if (password.trim() === "")
          errors.password = "Password can not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm password can not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // Hash password
        password = await bcrypt.hash(password, 6);

        // Create user
        const user = await User.create({
          username,
          email,
          password,
        });

        // Return user
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad input", { errors });
      }
    },
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
