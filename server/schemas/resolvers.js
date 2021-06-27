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
        }
    }
}