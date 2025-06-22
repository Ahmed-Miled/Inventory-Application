const db = require("../db");

exports.list = async (req, res) => {
  try {
    const partsResult = await db.query(`
        SELECT 
            p.id,
            p.name,
            p.description,
            p.quantity,
            p.price,
            c.name AS category_name
        FROM parts p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.name
        `);

    const parts = partsResult.rows;
    //console.log("Fetched parts:", parts);
    res.render("parts/index", {
      title: "All Parts",
      parts: parts.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        quantity: p.quantity,
        price: parseFloat(p.price).toFixed(2),
        categoryName: p.category_name || "Uncategorized",
      })),
    });
  } catch (err) {
    console.error("Error fetching parts:", err);
    res.status(500).send("Server Error");
  }
};

exports.newPart = async (req, res) => {
 try {
    const categories = await db.query('SELECT id, name FROM categories');
    const brands = await db.query('SELECT id, name FROM brands');

    res.render('parts/newPart', {
      title: 'Add New Part',
      categories: categories.rows,
      brands: brands.rows,
    });
  } catch (err) {
    console.error("Error loading form:", err);
    res.status(500).send("Server error");
  }
};

exports.createPart = async (req, res) => {
  const { name, description, price, quantity, category_id, manufacturer, part_number, brand_id } = req.body;

  if (!name || !description || !price || !quantity || !category_id || !manufacturer || !part_number || !brand_id) {
    return res.status(400).render("parts/newPart", {
      title: "New Part",
      part: { name, description, price, quantity, category_id, manufacturer, part_number, brand_id },
      error: "All fields are required.",
    });
  }

  try {
    await db.query(`
      INSERT INTO parts (name, description, price, quantity, category_id, manufacturer, part_number, brand_id)
      VALUES ($1, $2, $3::numeric(10,2), $4::integer, $5::integer, $6, $7, $8)
    `, [name.trim(), description.trim(), parseFloat(price), parseInt(quantity), parseInt(category_id), manufacturer.trim(), part_number.trim(), parseInt(brand_id)]);

    res.redirect("/parts");
  } catch (err) {
    console.error("Error creating part:", err);
    res.status(500).send("Server Error");
  }
}

exports.deletePart = async (req, res) => {
  const partId = parseInt(req.params.id);

  if (isNaN(partId)) {
    return res.status(400).send("Invalid part ID");
  }

  try {
    const result = await db.query("DELETE FROM parts WHERE id = $1", [partId]);

    if (result.rowCount === 0) {
      return res.status(404).send("Part not found");
    }

    res.redirect("/parts");
  } catch (err) {
    console.error("Error deleting part:", err);
    res.status(500).send("Server Error");
  }
};

exports.editPartForm = async (req, res) => {
  const partId = parseInt(req.params.id);

  if (isNaN(partId)) {
    return res.status(400).send("Invalid part ID");
  }

  try {
    const partResult = await db.query("SELECT * FROM parts WHERE id = $1", [partId]);
    const categories = await db.query("SELECT id, name FROM categories");
    const brands = await db.query("SELECT id, name FROM brands");

    if (partResult.rows.length === 0) {
      return res.status(404).send("Part not found");
    }

    const part = partResult.rows[0];
    res.render("parts/editPart", {
      title: "Edit Part",
      part,
      categories: categories.rows,
      brands: brands.rows,
    });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).send("Server Error");
  }
}

exports.updatePart = async (req, res) => {
  const partId = parseInt(req.params.id);
  const { name, description, price, quantity, category_id, manufacturer, part_number, brand_id } = req.body;

  if (isNaN(partId) || !name || !description || !price || !quantity || !category_id || !manufacturer || !part_number || !brand_id) {
    return res.status(400).render("parts/editPart", {
      title: "Edit Part",
      part: { id: partId, name, description, price, quantity, category_id, manufacturer, part_number, brand_id },
      error: "All fields are required.",
    });
  }

  try {
    await db.query(`
      UPDATE parts
      SET name = $1, description = $2, price = $3::numeric(10,2), quantity = $4::integer,
          category_id = $5::integer, manufacturer = $6, part_number = $7, brand_id = $8
      WHERE id = $9
    `, [name.trim(), description.trim(), parseFloat(price), parseInt(quantity), parseInt(category_id), manufacturer.trim(), part_number.trim(), parseInt(brand_id), partId]);

    res.redirect("/parts");
  } catch (err) {
    console.error("Error updating part:", err);
    res.status(500).send("Server Error");
  }
};