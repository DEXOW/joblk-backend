const db = require('../utils/db_connection');

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

exports.addProject = (req, res) => {
  const { title, description, url, image1, image2, image3, image4, image5 } = req.body;

  if (!title || !description || !url) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'Missing content' });
    return;
  }

  db.query('INSERT INTO portfolio_projects (uid, title, description, url, image1, image2, image3, image4, image5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.user.id, title, description, url, image1, image2, image3, image4, image5], (err, results) => {
    if (err) {
      res.status(500).send({ code: "ERR-500", message: err });
      return;
    }

    res.send({ message: 'Project added' });
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