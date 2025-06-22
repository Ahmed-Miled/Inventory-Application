const db = require('../db');
exports.list = async (req, res) => {
  try {
    const categoriesResult = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        COUNT(p.id) AS part_count
      FROM categories c
      LEFT JOIN parts p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);
    
    const categories = categoriesResult.rows;
    console.log('Fetched categories:', categories);
    res.render('categories/index', {
      title: 'All Categories',
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        parts: Array(parseInt(c.part_count)) // fake array tonpm start keep compatibility with .length
      }))
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Server Error');
  }
};
