const db = require("../../data/dbConfig");


function find() {
  return db("users")
}
function findBy(filter){
    return db("users")
    .where(filter)
}

function findById(id) {
    return db("users")
      .first();
  }

async function add(newUser){
    const [id]=await db("users").insert(newUser,"id")
    return findById(id)
}
module.exports = {
  add,
  find,
  findBy,
  findById,
};
