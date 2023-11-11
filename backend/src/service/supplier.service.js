// src/repository/supplier.repository.js
const Supplier = require("../../models");

const createSupplier = async (supplierData) => {
  return await Supplier.create(supplierData);
};

const getSuppliers = async () => {
  return await Supplier.findAll();
};

const getSupplierById = async (id) => {
  return await Supplier.findById(id);
};

const updateSupplier = async (id, updatedData) => {
  return await Supplier.update(updatedData, { where: { id } });
};

const deleteSupplier = async (id) => {
  return await Supplier.destroy({ where: { id } });
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
