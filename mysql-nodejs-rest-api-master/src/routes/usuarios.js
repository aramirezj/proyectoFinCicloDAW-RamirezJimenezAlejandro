var cors = require('cors')
const express = require('express');
const router = express.Router();
const app = express();
app.use(cors())
var multer = require("multer");

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

let secretWord = "a670711037";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './../buzzflix/src/assets/img')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({
  storage: storage
})

/*function generaToken(){
  require('crypto').randomBytes(48, function(err, buffer) {
    var token = buffer.toString('hex');
    console.log(token)
  });
}
console.log(generaToken())*/




const mysqlConnection = require('../database.js');



// Obtener un usuario
router.get('/usuario/:id', (req, res) => {
  console.log("OBTENER POR ID??????")
  const { id } = req.params;
  console.log(id);
  mysqlConnection.query('SELECT id,name,email,avatar FROM users WHERE id = ?', [id], (err, rows, fields) => {
    if (!err) {
      console.log(rows[0])
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});
// Obtener varios usuarios
router.get('/usuarios/:nombre', (req, res) => {
  console.log("OBTENER POR nombre")
  let { nombre } = req.params;
  console.log(nombre);
  if (nombre == "EVERYTHINGPLEASE") {
    mysqlConnection.query('SELECT id,name,email,avatar FROM users order by name', null, (err, rows, fields) => {
      if (!err) {
        console.log(rows)
        res.json(rows);
      } else {
        console.log(err);
      }
    });
  } else {
    mysqlConnection.query('SELECT id,name,email,avatar FROM users WHERE name LIKE ? order by name', [nombre + "%"], (err, rows, fields) => {
      if (!err) {
        console.log(rows)
        res.json(rows);
      } else {
        console.log(err);
      }
    });
  }

});
//usuario/:id/wall
//Obtener todos los quizz de alguien
router.get('/usuario/:id/wall', (req, res) => {
  console.log("Obtener quizz por id")
  const { id } = req.params;
  mysqlConnection.query('SELECT * FROM quizz WHERE creador = ?', [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        res.json({
          status: "EMPTY",
          cont: null
        })
      } else {
        res.json({
          status: "OK",
          cont: rows
        });
      }
      return res;
    } else {
      console.log(err);
    }
  });
});
//Obtener los quizzes de todos los seguidos
router.get('/quizz/:id/seguidos', (req, res) => {
  console.log("Obtener quizz de los seguidos")
  const { id } = req.params;
  let query = "SELECT * FROM quizz WHERE creador in ( SELECT destino from follows where origen = ? ) order by fechacreacion DESC"
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        res.json({
          status: "EMPTY",
          cont: null
        })
      } else {
        res.json({
          status: "OK",
          cont: rows
        });
      }
      return res;
    } else {
      console.log(err);
    }
  });
});
//Obtener los quizzes d
router.get('/quizz/todos', (req, res) => {
  console.log("Obtener quizz de todos")
  let query = "SELECT * FROM quizz order by estrellas DESC"
  mysqlConnection.query(query, null, (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        res.json({
          status: "EMPTY",
          cont: null
        })
      } else {
        res.json({
          status: "OK",
          cont: rows
        });
      }
      return res;
    } else {
      console.log(err);
    }
  });
});
//Obtener un solo quizz
router.get('/quizz/:id', (req, res) => {
  console.log("Obtener quizz del id")
  const { id } = req.params;
  let query = "SELECT * FROM quizz WHERE id = ?"
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        res.json({
          status: "EMPTY",
          cont: null
        })
      } else {
        res.json({
          status: "OK",
          cont: rows
        });
      }
      return res;
    } else {
      console.log(err);
    }
  });
});

//Obtener cantidad de quizzes creados
router.get('/quizz/:id/cantidad', (req, res) => {
  console.log("Obtener cantidad de quizzes por un usuario")
  const { id } = req.params;
  let cantidad = 0;
  let query = "SELECT count(id) as c FROM quizz WHERE creador = ?"
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    console.log("cantidad " + rows[0].c)
    if (!err) {
      if (rows.length == 0) {
      } else {
        console.log(rows[0].c)
        cantidad = rows[0].c
      }
      return res.json({ resultado: cantidad });
    } else {
      console.log(err);
    }
  });
});

//Obtener cantidad de votos recibidos x personas
router.get('/quizz/:id/media', (req, res) => {
  console.log("Obtener cantidad de votos, (no cantidad)")
  const { id } = req.params;
  let cantidad = 0;
  let query = "SELECT count(quizz) as m FROM votaciones WHERE quizz = ?"
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    console.log("cantidad " + rows[0].m)
    if (!err) {
      if (rows.length == 0) {
      } else {
        console.log(rows[0].m)
        cantidad = rows[0].m
      }
      return res.json({ resultado: cantidad });
    } else {
      console.log(err);
    }
  });
});

//Obtener número de seguidores
router.get('/usuario/:id/followers', (req, res) => {
  let resultados = [];
  console.log("Obtener número de seguidores")
  const { id } = req.params;
  let query = "SELECT count(origen) as followers FROM follows WHERE origen = ?";
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        resultados[0] = 0;
      } else {
        resultados[0] = rows[0].followers
      }
      //let query ="SELECT count(destino) as followers FROM follows WHERE destino = ?"
    } else {
      console.log(err);
    }
  });
  let query2 = "SELECT count(destino) as followers FROM follows WHERE destino = ?"
  mysqlConnection.query(query2, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        resultados[1] = 0;
      } else {
        resultados[1] = rows[0].followers
      }
      res.json({ cont: resultados });
    } else {
      console.log(err);
    }
  });
});

/*
// DELETE An Employee
router.delete('/:id', (req, res) => {
   console.log("BORRAR POR ID")
  const { id } = req.params;
  mysqlConnection.query('DELETE FROM employee WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Employee Deleted'});
    } else {
      console.log(err);
    }
  });
});

*/


router.post('/register', cors(), (req, res, next) => {
  console.log("PETICION REGISTRO")
  console.log("PARAMETROS")
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const query = "insert into users (name,email,password) VALUES(?,?,?)";
  mysqlConnection.query(query, [name, email, password], (err, rows, fields) => {
    if (!err) {
      var token = jwt.sign({ id: rows.insertId }, secretWord, {
        expiresIn: 86400 // expires in 24 hours
      });
      console.log(token);
      res.status(200).send({ auth: true, token: token, id: rows.insertId });
      // res.json({ id: rows.insertId });
    } else {
      console.log(err);
    }
  });

});
router.post('/file', upload.any('file'), (req, res, next) => {
  console.log("PETICION SUBIR IMAGENES")
  console.log("PARAMETROS")
  console.log(req.files)
  /*mysqlConnection.query(query, [name, email, password], (err, rows, fields) => {
    if(!err) {
      console.log(rows.insertId);
      res.json({id: rows.insertId});
    } else {
      console.log(err);
    }
  });*/

});
//Peticion para crear un quizz
router.post('/creaQuizz', cors(), (req, res, next) => {
  console.log("PETICION subir un quizz")
  console.log("PARAMETROS")
  const { creador, titulo, contenido, fecha } = req.body;
  console.log(creador + "--" + titulo);
  const query = "insert into quizz (creador,titulo,contenido,fechacreacion,estrellas) VALUES(?,?,?,?,0)";
  mysqlConnection.query(query, [creador, titulo, contenido, fecha], (err, rows, fields) => {
    if (!err) {
      console.log(rows.insertId);
      res.json({ id: rows.insertId });
    } else {
      console.log(err);
    }
  });

});
//Peticion para puntuar un test
router.post('/vota', cors(), (req, res, next) => {
  console.log("PETICION votar")
  console.log("PARAMETROS")
  let estrellas = 0;
  const { origen, quizz, cantidad } = req.body;
  console.log(origen + "--" + quizz + "--" + cantidad);
  const query = "insert into votaciones (origen,quizz,cantidad) VALUES(?,?,?)";
  mysqlConnection.query(query, [origen, quizz, cantidad], (err, rows, fields) => {
    if (!err) {
    } else {
      //console.log(err);
    }
  });
  console.log("INSERCION VOTACIONES OK")
  const query2 = "select estrellas as e from quizz where id = ?";
  mysqlConnection.query(query2, [quizz], (err, rows, fields) => {
    if (!err) {
      console.log("ENCONTRADO ESTO " + rows[0].e)
      estrellas = rows[0].e
    } else {
      //console.log(err);
    }
  });

  setTimeout(() => {
    console.log("SELECCION  ESTRELLAS OK-" + estrellas)
    estrellas += cantidad;
    console.log("LAS ESTRELLAS SOOON " + estrellas)
    const query3 = "update quizz set estrellas = ? where id = ?";
    mysqlConnection.query(query3, [estrellas, quizz], (err, rows, fields) => {
      if (!err) {
        console.log("update OK-")
        res.json({ status: "OK" });
      } else {
        console.log(err);
      }
    });
  }, 500);




});

router.post('/authenticate', cors(), (req, res, next) => {
  console.log("PETICION LOGIN(authenticate)")
  console.log("PARAMETROS")




  const { email, password } = req.body;
  console.log("Parametros:" + email, password);
  const query = "select id,name,email,avatar from users where email = ? AND password = ?";
  mysqlConnection.query(query, [email, password], (err, rows, fields) => {
    if (!err) {
      if (rows.length < 1) {
        res.json({
          status: 'FAIL',
          usuario: null
        });
      }else {
        //console.log(rows[0])
        console.log("OK")
        var token = jwt.sign({ id: rows[0].id }, secretWord, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token,usuario:rows[0] });
        /*res.json({
          status: 'OK',
          usuario: rows[0]
        });*/
      }
      //res.json({rows});
    } else {
      console.log(err);
    }
  });

});
//Peticion post para ver si sigue a x persona
router.post('/is/following', cors(), (req, res, next) => {
  console.log("PETICION PARA VER SI HAY SEGUIMIENTO")
  console.log("PARAMETROS")
  const { origen, destino } = req.body;
  console.log("Parametros:" + origen + "-" + destino);
  const query = "select destino FROM follows where origen = ? AND destino = ?";
  mysqlConnection.query(query, [origen, destino], (err, rows, fields) => {
    if (!err) {
      if (rows.length < 1) {
        console.log("NO LE SIGUE");
        res.json({
          verdad: false
        });
      } else {
        console.log("LE SIGUE");
        res.json({
          verdad: true
        });
      }
    } else {
      console.log(err);
    }
  });

});

//Peticion post para comenzar a seguir
router.post('/follow', cors(), (req, res, next) => {
  console.log("PETICION para INTRODUCIR UN SEGUIMIENTO")
  console.log("PARAMETROS")
  const { origen, destino } = req.body;
  console.log("Parametros:" + origen + "-" + destino);
  const query = "insert into follows values(?,?)";
  mysqlConnection.query(query, [origen, destino], (err, rows, fields) => {
    if (!err) {
      res.json({ status: "OK" });
    }
    else {
      console.log(err);
    }
  });

});
//Peticion post para borrar un seguimiento
router.post('/unfollow', cors(), (req, res, next) => {
  console.log("PETICION para borrar un seguimiento")
  console.log("PARAMETROS")
  const { origen, destino } = req.body;
  console.log("Parametros:" + origen + "-" + destino);
  const query = "delete from follows where origen = ? AND destino = ?";
  mysqlConnection.query(query, [origen, destino], (err, rows, fields) => {
    if (!err) {
      res.json({ status: "OK" });
    }
    else {
      console.log(err);
    }
  });

});




router.put('/usuario/actualizar/:id', cors(), (req, res, next) => {
  console.log("PETICION PUT ACTUALIZAR")
  console.log("PARAMETROS")
  const { name, email, avatar } = req.body;
  const { id } = req.params;
  console.log(name, email)
  let query = "UPDATE users set name = ? , email =?, avatar=? WHERE id = ?"
  mysqlConnection.query(query, [name, email, avatar, id], (err, rows, fields) => {
    if (!err) {
      res.json({ status: 'OK' });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
