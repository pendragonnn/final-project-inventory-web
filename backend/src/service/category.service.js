const {
  findCategories,
  findCategoryById,
  findCategoryByName,
  createCategory,
  editCategory,
  deleteCategory
} = require("../repository/category.repository");

const getAllCategories = async (page, size) => {
  const categories = await findCategories(page, size);
  return categories;
};

const getCategoryById = async (id) => {
  const category = await findCategoryById(id);

  if (!category) {
    throw Error("Category Not Found");
  }
  return category;
};

const insertCategory = async (newCategory) => {
  const categoryName = await findCategoryByName(newCategory.name);

  if (categoryName) {
    throw new Error("Category Already Added");
  }

  const category = await createCategory(newCategory);

  return category;
};

const editCategoryById = async (id, newCategory) => {
  try {
    // const categoryName = await findCategoryByName(newOutlet.name);

    // if (categoryName) {
    //   throw new Error("Kategori sudah Terdaftar");
    // }

    await getCategoryById(id);

    const category = await editCategory(id, newCategory);
    return category;
  } catch (err) {
    return null;
  }
};

const deleteCategoryById = async (id) => {
  try {
    await getCategoryById(id);

    await deleteCategory(id);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  insertCategory,
  editCategoryById,
  deleteCategoryById
};
