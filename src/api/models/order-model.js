import promisePool from '../../utils/database.js';

const getCartById = async (cartId) => {
  try {
    const sql = `
    SELECT
      ot.tuote_id,
      ot.maara
    FROM
      ostoskori AS o
    INNER JOIN
      ostoskori_tuotteet AS ot
    ON
      o.id = ot.ostoskori_id
    WHERE
      o.id = ?`;
    const [rows] = await promisePool.execute(sql, [cartId]);

    return rows;
  } catch (error) {
    console.error('Error in getCartById', error);
    throw error;
  }
};
const checkCart = async (userId) => {
  try {
    const cartCheckSQL = `
    SELECT
      o.id
    FROM
      ostoskori AS o
    WHERE
      o.user_id = ?;
    `;
    const [rows] = await promisePool.execute(cartCheckSQL, [userId]);

    if (rows.length === 0) {
      return null; //
    }
    return rows[0].id;
  } catch (error) {
    console.error('Error in checkCart:', error);
    throw error;
  }
};

const createNewCart = async (userId) => {
  try {
    const sql = `INSERT INTO ostoskori(user_id) VALUES (?)`;
    const [result] = await promisePool.execute(sql, [userId]);

    if (result.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createNewCart:', error);
    throw error;
  }
};

const addToCart = async (productId, ostoskoriId, maara) => {
  try {
    const sql = `INSERT INTO
    ot.tuote_id,
    ot.maara
    FROM
    ostoskori AS o
  INNER JOIN
    ostoskori_tuotteet AS ot
  ON
    o.id = ot.ostoskori_id
  WHERE
    o.user_id = ?`;
    const [result] = await promisePool.execute(sql, [
      productId,
      ostoskoriId,
      maara,
    ]);

    if (result.affectedRows === 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error;
  }
};

export {getCartById, createNewCart, checkCart};
