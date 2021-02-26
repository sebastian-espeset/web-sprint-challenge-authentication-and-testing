const db = require("../../data/dbConfig");



function findBy(filter){
    return db("users as u")
    .where(filter)
}

function findById(id) {
    return db("users as u")
    .select("u.id","u.username","u.password")
      .where("u.id", id)
      .first();
  }

async function add(newUser){
    const [id]=await db("users").insert(newUser,"id")
    return findById(id)
}
module.exports = {
  add,
  findBy,
  findById,
};
