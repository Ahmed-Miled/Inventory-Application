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
    console.log("Fetched parts:", parts);
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
