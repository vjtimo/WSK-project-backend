import promisePool from '../../utils/database.js';

const addOrder = async (rid, oid) => {
  try {
    await promisePool.query('START TRANSACTION');

    await promisePool.query(
      `INSERT INTO tilaus(ravintola_id,ostoskori_id) VALUES (?,?)`,
      [rid, oid]
    );
    await promisePool.query(`UPDATE ostoskori SET active = 0 WHERE id = ?`, [
      oid,
    ]);
    const [rows] = await promisePool.query(
      `INSERT INTO ostoskori (user_id)
       SELECT user_id
       FROM ostoskori
       WHERE id = ?`,
      [oid]
    );
    await promisePool.query('COMMIT');
    return rows;
  } catch (e) {
    await promisePool.query('ROLLBACK');
    e.message('cannot add');
  }
};
export {addOrder};
