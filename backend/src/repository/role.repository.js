const models = require('../../models/')
const Role = models.Role

const findRoles = async () => {
  const roles = await Role.findAll();

  return roles;
};

const findRoleById = async (id) => {
  const role = await Role.findOne({
    where: {
      id,
    },
  });
  return role;
};


module.exports = {
  findRoles,
  findRoleById,
};