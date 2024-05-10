import promisePool from '../../utils/database.js';

const addOrder = async (rid, oid, toimitustapa) => {
  try {
    await promisePool.query('START TRANSACTION');

    await promisePool.query(
      `INSERT INTO tilaus(ravintola_id,ostoskori_id,toimitustapa) VALUES (?,?,?)`,
      [rid, oid, toimitustapa]
    );

    await promisePool.query(`UPDATE ostoskori SET active = 0 WHERE id = ?`, [
      oid,
    ]);
    const [rows] = await promisePool.query(
      `INSERT INTO ostoskori (user_id)
       SELECT user_id
       FROM ostoskori
       WHERE id = ?
       LIMIT 1`,
      [oid]
    );
    console.log('asdasdsadsa');
    await promisePool.query('COMMIT');
    console.log('2asdasdsadsad2');
    console.log(rows);
    return rows;
  } catch (e) {
    await promisePool.query('ROLLBACK');
    console.error('Error in addOrder:', e);
    throw new Error(`Failed to add order: ${e.message}`);
  }
};

const findOrders = async () => {
  const sql = `SELECT k.tunnus AS kayttajanimi,
  r.nimi AS ravintola_nimi,
  t.tilausaika,
  t.id,
  tila.id AS statusId,
  tila.tila as statusText,
  group_concat(
      CONCAT(p.nimi, ' (x', ot.maara, ')') SEPARATOR ', '
  ) AS tuotteet
FROM tilaus t
  JOIN tila on t.tilaId = tila.id
  JOIN ostoskori o ON t.ostoskori_id = o.id
  JOIN kayttaja k ON o.user_id = k.id
  JOIN ostoskori_tuotteet ot ON o.id = ot.ostoskori_id
  JOIN tuote p ON ot.tuote_id = p.id
  JOIN ravintola r ON t.ravintola_id = r.id
GROUP BY t.id,
  k.tunnus,
  r.nimi,
  tila;`;

  try {
    const [rows] = await promisePool.execute(sql);
    return rows;
  } catch (e) {
    console.error(e.message);
    throw new Error(`Failed to find orders: ${e.message}`);
  }
};
const findOrderById = async (id) => {
  const sql = `SELECT k.tunnus AS kayttajanimi,
  r.nimi AS ravintola_nimi,
  t.tilausaika,
  t.id,
  tila.id AS statusId,
  tila.tila as statusText,
  group_concat(
      CONCAT(p.nimi, ' (x', ot.maara, ')') SEPARATOR ', '
  ) AS tuotteet
FROM tilaus t
  JOIN tila on t.tilaId = tila.id
  JOIN ostoskori o ON t.ostoskori_id = o.id
  JOIN kayttaja k ON o.user_id = k.id
  JOIN ostoskori_tuotteet ot ON o.id = ot.ostoskori_id
  JOIN tuote p ON ot.tuote_id = p.id
  JOIN ravintola r ON t.ravintola_id = r.id
  WHERE t.id = ?
GROUP BY t.id,
  k.tunnus,
  r.nimi,
  tila
  `;

  try {
    const [rows] = await promisePool.execute(sql, [id]);
    console.log;
    return rows;
  } catch (e) {
    console.error(e.message);
    throw new Error(`Failed to find order with ID ${id}: ${e.message}`);
  }
};
const updateStatus = async (id, status) => {
  status++;
  const sql = `UPDATE tilaus SET tilaId = ? where id= ? `;
  try {
    const rows = promisePool.query(sql, [status, id]);
    return rows;
  } catch (e) {
    console.error('Error finding user:', e.message);
    throw new Error(`Failed to update order with ID ${id}: ${e.message}`);
  }
};

export {addOrder, findOrders, updateStatus, findOrderById};
