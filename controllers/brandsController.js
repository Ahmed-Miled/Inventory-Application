//const Brand = require('../models/brand');

const db = require("../db");

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brandsResult = await db.query("SELECT * FROM brands ORDER BY name");
    const brands = brandsResult.rows;
    res.render("brands/index", {
      title: "All Brands",
      brands: brands.map((b) => ({
        id: b.id,
        name: b.name,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.newBrand = async (req, res) => {
  try {
    res.render("brands/newBrand", {
      title: "Add New Brand",
    });
  } catch (err) {
    console.error("Error loading form:", err);
    res.status(500).send("Server error");
  }
}


exports.createBrand = async (req, res) => { 
  const { name } = req.body;
  try {
    await db.query("INSERT INTO brands (name) VALUES ($1)", [name]);
    res.redirect("/brands");
  } catch (err) {
    console.error("Error creating brand:", err);
    res.status(500).send("Server Error");
  }
}

exports.deleteBrand = async (req, res) => {
  const brandId = parseInt(req.params.id);
  try {
    await db.query("DELETE FROM brands WHERE id = $1", [brandId]);
    res.redirect("/brands");
  } catch (err) {
    console.error("Error deleting brand:", err);
    res.status(500).send("Server Error");
  }
};