const models = require("../../models");
const Category = models.Category;

const findCategories = async (page, size) => {
  const offset = (page - 1) * size;
  const categoriesAll = await Category.findAll();
  const dataLength = categoriesAll.length;
  const categories = await Category.findAll({
    offset: offset,
    limit: size,
    order: [
      ['id', 'DESC'],
    ],
  });
  return { categories, dataLength };
};

const findCategoryById = async (id) => {
  const category = await Category.findOne({
    where: {
      id,
    },
  });
  return category;
};

const findCategoryByName = async (name) => {
  const category = await Category.findOne({
    where: {
      name,
    },
  });

  return category;
};

const createCategory = async (categoryData) => {
  try {
    const existingIds = await Category.findAll({ attributes: ["id"] });

    const newId = generateNewId(existingIds.map((category) => category.id));

    const category = await Category.create({
      id: newId,
      name: categoryData.name,
    });

    return category;
  } catch (error) {
    throw error;
  }
};

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `C-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const editCategory = async (id, categoryData) => {
  const updatedCategory = await Category.update(
    {
      name: categoryData.name,
    },
    {
      where: {
        id,
      },
      returning: true,
    }
  );

  return updatedCategory;
};

const deleteCategory = async (id) => {
  const category = await Category.destroy({
    where: {
      id,
    },
  });
  return category;
};

module.exports = {
  findCategories,
  findCategoryById,
  findCategoryByName,
  createCategory,
  editCategory,
  deleteCategory
};
