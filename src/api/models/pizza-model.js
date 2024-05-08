import promisePool from '../../utils/database.js';
const getAllPizzas = async () => {
  const [rows] = await promisePool.query(
    `SELECT tuote.*,
    group_concat(a.nimi_fi separator ", ") as ainekset
FROM tuote
    LEFT JOIN tuoteainekset as ta ON tuote.id = ta.tuote_id
    LEFT JOIN aineosa as a on ta.aine_id = a.id
GROUP by tuote.id;`
  );
  return rows;
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
export {getAllPizzas, findPizzasById, deletePizzaById};
