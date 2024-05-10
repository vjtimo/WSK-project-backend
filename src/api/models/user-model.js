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
  const {
    tunnus,
    salasana,
    email,
    puhelin,
    etunimi,
    sukunimi,
    katuosoite,
    postinumero,
    postitoimipaikka,
  } = user;
  try {
    await promisePool.query('START TRANSACTION');
    const sql1 = `INSERT INTO kayttaja (tunnus, salasana)
               VALUES (?, ?);
                `;
    const params1 = [tunnus, salasana];
    const rows1 = await promisePool.query(sql1, params1);
    const sqlId = `SELECT LAST_INSERT_ID() as user_id;`;
    const [rows] = await promisePool.query(sqlId);

    const sql2 = `INSERT INTO asiakas (email, puhelin, etunimi, sukunimi, katuosoite, postinumero, postitoimipaikka, tunnus_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    const params2 = [
      email,
      puhelin,
      etunimi,
      sukunimi,
      katuosoite,
      postinumero,
      postitoimipaikka,
      rows[0].user_id,
    ];
    const rows2 = await promisePool.query(sql2, params2);
    if (rows1[0].affectedRows === 0 || rows2[0].affectedRows === 0) {
      await promisePool.query('ROLLBACK');
      return false;
    }
    await promisePool.query('COMMIT');
    return {user_id: rows1[0].insertId};
  } catch (e) {
    console.error('Error in addUser:', e);
    await promisePool.query('ROLLBACK');
    return false;
  }
};
const findUserInfo = async (id) => {
  const sql = `SELECT *
  FROM asiakas
  WHERE tunnus_id = ?`;
  const [rows] = await promisePool.execute(sql, [id]);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};
export {getUserByName, addUser, findUserInfo};
