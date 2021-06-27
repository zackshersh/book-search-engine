const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../models');
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        getSingleUser: async (parent, { user = null, params }) => {
            return await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
              });
        },
    },
    Mutation: {
        createUser: async (parent, { body }) => {
            const user = await User.create(body)
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { body }) => {
            const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
            if (!user) {
                throw new AuthenticationError('User not found')
            }
        
            const correctPw = await user.isCorrectPassword(body.password);
        
            if (!correctPw) {
                throw new AuthenticationError('Incorrect Password')
            }
            const token = signToken(user);
            return { user,token };
        },
        saveBook: async(parent, { user,body }) => {
            console.log(user);
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return updatedUser
            } catch (err) {
              console.log(err);
              throw new AuthenticationError('An error occured')
            }
        },
        deleteBook: async(parent, {user,params}) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
              );
              if (!updatedUser) {
                throw new AuthenticationError('No user found with this id')
              }
              return updatedUser;
        }
    }
}