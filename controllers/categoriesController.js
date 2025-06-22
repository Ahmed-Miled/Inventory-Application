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
    //console.log('Fetched categories:', categories);
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


exports.newCategory = (req, res) => {
  res.render('categories/newCategory', {
    title: 'New Category',
    category: {
      name: '',
      description: '',
      error: null
    }
  });
}

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).render('categories/newCategory', {
      title: 'New Category',
      category: { name, description },
      error: 'Name and description are required.'
    });
  }

  try {
    const result = await db.query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING id
    `, [name, description]);

    const newCategory = result.rows[0];
    console.log('New category created:', newCategory);
    res.redirect('/categories');
    //res.redirect(`/categories/${newCategory.id}`);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).send('Server Error');
  }
}


exports.editCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  
  try {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }

    res.render('categories/showCategorie', {
      title: 'Edit Category',
      category: result.rows[0],
    });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).send("Server error");
  }
};

exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).render('categories/showCategorie', {
      title: 'Edit Category',
      category: { id: categoryId, name, description },
      error: 'Name and description are required.'
    });
  }

  try {
    const result = await db.query(`
      UPDATE categories
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING id
    `, [name, description, categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }

    console.log('Category updated:', result.rows[0]);
    res.redirect('/categories');
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).send('Server Error');
  }
}

exports.deleteCatregory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING id', [categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Category not found");
    }

    console.log('Category deleted:', result.rows[0]);
    res.redirect('/categories');
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).send('Server Error');
  }
}