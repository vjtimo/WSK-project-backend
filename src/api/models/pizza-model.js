import promisePool from '../../utils/database.js';
const getAllPizzas = async () => {
  const [rows] = await promisePool.query(
    `SELECT tuote.*,
    image_file,
    group_concat(a.nimi_fi separator ", ") as ainekset
FROM tuote
    LEFT JOIN tuoteainekset as ta ON tuote.id = ta.tuote_id
    LEFT JOIN aineosa as a on ta.aine_id = a.id
GROUP by tuote.id;`
  );
  return rows.map((row) => ({
    id: row.id,
    price: row.hinta,
    name: row.nimi,
    ingredients: row.ainekset,
    imageUrl: `/uploads/${row.image_file}`,
  }));
};

const findPizzasById = async (...ids) => {
  try {
    const placeholders = ids.map(() => '?').join(', ');
    const [rows] = await promisePool.query(
      `SELECT * FROM tuote WHERE id IN (${placeholders})`,
      ids
    );
    if (rows.length === 0) {
      return [];
    }
    return rows;
  } catch (error) {
    console.error('Error in findPizzaByID:', error);
    throw error;
  }
};
const deletePizzaById = async (active, id) => {
  try {
    const [result] = await promisePool.execute(
      `UPDATE tuote set active = ?  WHERE id = ?`[(active, id)],
      [id]
    );
    if (result.affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in findPizzaByID:', error);
    throw error;
  }
};

const addProduct = async (data) => {
  console.log(data);

  await promisePool.query('START TRANSACTION');
  const [categoryResult] = await promisePool.execute(
    'SELECT id FROM kategoria WHERE kategoria = ?',
    [data.category_name]
  );
  if (categoryResult.length === 0) {
    return false;
  }
  const kategoriaId = categoryResult[0].id;
  const [result] = await promisePool.execute(
    `
    INSERT INTO tuote (nimi, image_file, kategoria_id,hinta)
    VALUES (?, ?, ?,?);
    `,
    [data.name, data.filename, kategoriaId, data.hinta]
  );
  if (result.affectedRows === 0) {
    await promisePool.query('ROLLBACK');
    throw new Error('Ingredient not added');
  }
  const newProductId = result.insertId;
  for (const ingredient of data.ingredient_names) {
    const [ingredientResult] = await promisePool.execute(
      'INSERT INTO tuoteainekset (aine_id, tuote_id) VALUES ((SELECT id FROM aineosa WHERE nimi_fi = ?), ?)',
      [ingredient, newProductId]
    );

    if (ingredientResult.affectedRows === 0) {
      await promisePool.query('ROLLBACK');
      throw new Error('Ingredient not added');
    }
  }

  await promisePool.query('COMMIT');
  return {message: 'Product added'};
};

export {getAllPizzas, findPizzasById, deletePizzaById, addProduct};
