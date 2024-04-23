import promisePool from '../../utils/database.js';

const getUserByName = async (name) => {
  const sql = `SELECT *
              FROM kayttaja
              WHERE tunnus = ?`;
  const [rows] = await promisePool.execute(sql, [name]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const {tunnus, salasana} = user;
  const sql = `INSERT INTO kayttaja (tunnus, salasana)
               VALUES (?, ?)`;
  const params = [tunnus, salasana];
  const rows = await promisePool.execute(sql, params);

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {user_id: rows[0].insertId};
};

export {getUserByName, addUser};
