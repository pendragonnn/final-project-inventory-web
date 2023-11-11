// src/controller/supplier.controller.js
const supplierService = require("../service/supplier.service");

const createSupplier = async (req, res) => {
  try {
    const supplierData = req.body;
    const newSupplier = await supplierService.createSupplier(supplierData);
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await supplierService.getSupplierById(id);
    if (supplier) {
      res.status(200).json(supplier);
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await supplierService.updateSupplier(id, updatedData);
    if (result[0] === 1) {
      res.status(200).json({ message: "Supplier updated successfully" });
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await supplierService.deleteSupplier(id);
    if (result === 1) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Supplier not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
