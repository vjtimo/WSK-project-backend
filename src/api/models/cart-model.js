import promisePool from '../../utils/database.js';

const getCartById = async (cartId) => {
  try {
    const sql = `
    SELECT
      o.id,
      ot.tuote_id as id,
      ot.maara as quantity
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
    console.log('WAAAAAAAAAAAAAA', rows);
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

    return result.insertId;
  } catch (error) {
    console.error('Error in createNewCart:', error);
    throw error;
  }
};

const addToCart = async (cartId, items) => {
  try {
    await promisePool.query('START TRANSACTION');
    if (items.length === 0) {
      await promisePool.query(
        'DELETE FROM ostoskori_tuotteet WHERE ostoskori_id = ?',
        [cartId]
      );
      await promisePool.query('COMMIT');
      return {success: true, message: 'Shopping cart emptied'};
    }
    await promisePool.query(
      'DELETE FROM ostoskori_tuotteet WHERE ostoskori_id = ?',
      [cartId]
    );
    console.log(items);
    const values = items.map((item) => [item.id, item.quantity, cartId]);
    console.log(values);
    const insertQuery =
      'INSERT INTO ostoskori_tuotteet (tuote_id, maara, ostoskori_id) VALUES ?';
    const [result] = await promisePool.query(insertQuery, [values]);

    await promisePool.query('COMMIT');
    return {success: true, affectedRows: result.affectedRows};
  } catch (error) {
    await promisePool.query('ROLLBACK');

    console.error('Error in addToCart:', error);
    return {
      success: false,
      message: 'Failed to add/update items in cart',
      error: error.message,
    };
  }
};

export {getCartById, createNewCart, checkCart, addToCart};
