const db = require("./index"); // This should export your pg pool

async function seedDatabase() {
  try {
    // Clear existing data
    await db.query("DELETE FROM parts");
    await db.query("DELETE FROM categories");
    await db.query("DELETE FROM brands");

    // Insert brands (optional)
    const brandsRes = await db.query(`
      INSERT INTO brands (name) VALUES
        ('Bosch'),
        ('Valeo'),
        ('NGK'),
        ('Delphi'),
        ('Denso'),
        ('ACDelco'),  
        ('Brembo'),
        ('Magneti Marelli'),
        ('Mann-Filter'),
        ('Febi Bilstein')
        RETURNING id
    `);

    const [boschId, ngkId, valeoId] = brandsRes.rows.map((b) => b.id);

    // Insert categories
    const categoriesRes = await db.query(`
      INSERT INTO categories (name, description)
      VALUES 
        ('Engine', 'Engine-related components'),
        ('Brakes', 'Brake pads and discs'),
        ('Lighting', 'Headlights, taillights, and bulbs')
      RETURNING id
    `);

    const [engineId, brakesId, lightingId] = categoriesRes.rows.map(
      (c) => c.id
    );

    // Insert parts
    await db.query(
      `
      INSERT INTO parts (name, description, price, quantity, category_id, manufacturer, part_number, brand_id)
      VALUES
        ('Oil Filter', 'High-performance oil filter', 15.99, 100, $1, 'Bosch', 'OF123', $4),
        ('Brake Pad Set', 'Ceramic brake pads', 29.50, 50, $2, 'Valeo', 'BP456', $6),
        ('Halogen Bulb', 'H7 halogen headlight bulb', 8.25, 200, $3, 'NGK', 'HB789', $5)
    `,
      [engineId, brakesId, lightingId, boschId, ngkId, valeoId]
    );

    console.log("✅ Seed data inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
