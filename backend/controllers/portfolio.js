const db = require('../utils/db_connection');
const uploadImage = require('../utils/upload_image');

exports.getProjects = (req, res) => {
  if (req.user.id) {
    db.query('SELECT * FROM portfolio_projects WHERE uid = ?', [req.user.id], (err, results) => {
      if (err) {
        res.status(500).send({ code: "ERR-500", message: err });
        return;
      }
      
      // Remove uid from results
      results.forEach(result => {
        delete result.uid;
      });

      res.send(results);
    });
  }
}

exports.addProject = async (req, res) => {
  const { title, description, url } = req.body;
  const image1 = req.files[0];
  const image2 = req.files[1];
  const image3 = req.files[2];
  const image4 = req.files[3];
  const image5 = req.files[4];

  let image1Url, image2Url, image3Url, image4Url, image5Url = '';

  if (!title || !description || !url) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'Missing content' });
    return;
  }
  if (image1){
    image1Url = await uploadImage(image1);
  }
  if (image2){
    image2Url = await uploadImage(image2);
  }
  if (image3){
    image3Url = await uploadImage(image3);
  }
  if (image4){
    image4Url = await uploadImage(image4);
  }
  if (image5){
    image5Url = await uploadImage(image5);
  }

  db.query('INSERT INTO portfolio_projects (uid, title, description, url, image1, image2, image3, image4, image5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.user.id, title, description, url, image1Url, image2Url, image3Url, image4Url, image5Url], (err, results) => {
    if (err) {
      res.status(500).send({ code: "ERR-500", message: err });
      return;
    }

    res.send({ message: 'Project added' });
  });
}

exports.updateProject = async (req, res) => {
  const { id, title, description, url } = req.body;
  const image1 = req.files[0];
  const image2 = req.files[1];
  const image3 = req.files[2];
  const image4 = req.files[3];
  const image5 = req.files[4];

  let image1Url, image2Url, image3Url, image4Url, image5Url = '';

  if (!id || !title || !description || !url) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'Missing content' });
    return;
  }
  if (image1){
    image1Url = await uploadImage(image1);
  }
  if (image2){
    image2Url = await uploadImage(image2);
  }
  if (image3){
    image3Url = await uploadImage(image3);
  }
  if (image4){
    image4Url = await uploadImage(image4);
  }
  if (image5){
    image5Url = await uploadImage(image5);
  }

  db.query('UPDATE portfolio_projects SET title = ?, description = ?, url = ?, image1 = ?, image2 = ?, image3 = ?, image4 = ?, image5 = ? WHERE id = ?', [title, description, url, image1Url, image2Url, image3Url, image4Url, image5Url, id], (err, results) => {
    if (err) {
      res.status(500).send({ code: "ERR-500", message: err });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(400).send({ code: "ERR-400", message: 'Project not found' });
      return;
    }
    if (results.changedRows > 0) {
      res.send({ message: 'Project updated' });
    } else {
      res.send({ message: 'No changes made' });
    }
  });
}

exports.deleteProject = (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'Missing content' });
    return;
  }

  db.query('DELETE FROM portfolio_projects WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send({ code: "ERR-500", message: err });
      return;
    }

    res.send({ message: 'Project deleted' });
  });
}