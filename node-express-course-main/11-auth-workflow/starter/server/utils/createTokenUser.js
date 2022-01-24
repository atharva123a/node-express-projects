// returns user token!
const createTokenUser = ({ user }) => {
  const { _id: userId, name, role } = user;
  return { userId, name, role };
};

module.exports = { createTokenUser };
