const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");

const { User } = require("../models");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();

        return users;
      } catch (err) {
        console.log(err);
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
          throw new UserInputError("Bad Input", errors);
        }
        const user = await User.findOne({ where: { username } });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("User not found", errors);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          errors.password = "Incorrect Password";
          throw new AuthenticationError("Incorrect Password", errors);
        }
        return user;
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
  },
};
