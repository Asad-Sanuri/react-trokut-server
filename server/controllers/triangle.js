const handleTriangle = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("triangles", 1)
    .returning("triangles")
    .then((triangles) => {
      if (triangles.length) {
        res.json(triangles[0].triangles);
      } else {
        res.status(400).json("unable to get entries of user with id = " + id);
      }
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleTriangle: handleTriangle,
};