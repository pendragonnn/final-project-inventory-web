const {
  findRoles,
  findRoleById,

} = require("../repository/role.repository");

const getAllRoles = async () => {
  const roles = await findRoles();
  return roles;
};

const getRoleById = async (id) => {
  const role = await findRoleById(id);

  return role;
};

module.exports = {
  getAllRoles,
  getRoleById,
};
