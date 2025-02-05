const db = require("../services/db");

async function getAllNotes({ slug, customDomain }) {
  const pool = await db.getTasksDB();

  if (
    !Number(process.env.TURN_OFF_SINGLE_USER_MODE) &&
    process.env.ADMIN_SLUG
  ) {
    // single user mode and admin slug is set
    slug = process.env.ADMIN_SLUG;
  }

  let subquery = customDomain
    ? `select user_id from btw.custom_domains where domain = $1`
    : `select id from btw.users where slug = $1`;

  const { rows } = await pool.query(
    `select slug, published_at, title, tags from btw.notes where publish = TRUE and user_id in (${subquery}) ORDER BY published_at DESC LIMIT 1000`,
    [slug]
  );

  // I will be surprised if someone wrote more than 1000 notes that are published?

  return rows;
}

async function getNoteBySlug({ slug, customDomain, noteSlug }) {
  const pool = await db.getTasksDB();

  if (
    !Number(process.env.TURN_OFF_SINGLE_USER_MODE) &&
    process.env.ADMIN_SLUG
  ) {
    // single user mode and admin slug is set
    slug = process.env.ADMIN_SLUG;
  }

  let subquery = customDomain
    ? `select user_id from btw.custom_domains where domain = $1`
    : `select id from btw.users where slug = $1`;

  const { rows } = await pool.query(
    `select slug, published_at, title, tags, html from btw.notes where publish = TRUE and user_id in (${subquery}) and slug = $2 LIMIT 1`,
    [slug, noteSlug]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

async function getUserBySlug({ slug, customDomain }) {
  const pool = await db.getTasksDB();

  if (
    !Number(process.env.TURN_OFF_SINGLE_USER_MODE) &&
    process.env.ADMIN_SLUG
  ) {
    // single user mode and admin slug is set
    slug = process.env.ADMIN_SLUG;
  }

  const subquery = customDomain
    ? `select user_id from btw.custom_domains where domain = $1`
    : `select id from btw.users where slug = $1`;

  const { rows } = await pool.query(
    `select name, slug, bio, pic, linkedin, twitter, instagram from btw.users where id in (${subquery}) LIMIT 1`,
    [slug]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

module.exports = {
  getAllNotes,
  getNoteBySlug,
  getUserBySlug,
};
