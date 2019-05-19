var cors = require('cors')
const express = require('express');
const router = express.Router();
const app = express();
app.use(cors())
var multer = require("multer");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var tokenService = require('../tokenService');
let secretWord = tokenService;

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

const mysqlConnection = require('../database.js');



function creaToken(id) {
  var token = jwt.sign({ id: id }, secretWord, {
    expiresIn: 86400 // expires in 24 hours
  });
  return token;
}

function verificaToken(headers) {
  let bearerHeader = headers["authorization"];
  console.log(typeof bearerHeader);
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      let decoded = jwt.verify(bearerToken, secretWord)
      console.log("Token correcto")
      return decoded.id;
    } catch (err) {
      console.log("Es un token erroneo");
      return false;
    }
  } else {
    console.log("Es un token erroneo");
    return false;
  }
}

//Petición para registrar un usuario .
router.post('/register', cors(), (req, res, next) => {
  console.log("PETICION REGISTRO")
  console.log("PARAMETROS")
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const query = "insert into users (name,email,password) VALUES(?,?,?)";
  mysqlConnection.query(query, [name, email, password], (err, rows, fields) => {
    if (!err) {
      var token = creaToken(rows.insertId);
      console.log(token);
      res.status(200).send({ auth: true, token: token, id: rows.insertId });
    } else {
      console.log(err);
    }
  });

});
//Petición para iniciar sesión
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
      } else {
        var token = creaToken(rows[0].id);
        res.status(200).send({ auth: true, token: token, usuario: rows[0] });
      }
    } else {
      console.log(err);
    }
  });

});

//Actualizar perfil de un usuario (PROTECTED)
router.put('/usuario/actualizar/:id', cors(), (req, res, next) => {
  console.log("PETICION PUT ACTUALIZAR")
  console.log("PARAMETROS")

  let permiso = verificaToken(req.headers);
  if (permiso != false) {



    const { name, oldpass, newpass, avatar } = req.body;
    const { id } = req.params;
    console.log(oldpass)
    if (oldpass == undefined || newpass == undefined) {
      let query = "UPDATE users set name = ?, avatar=? WHERE id = ?";
      mysqlConnection.query(query, [name, avatar, id], (err, rows, fields) => {
        if (!err) {
          res.send({
            status: '200'
          })
        } else {
          res.send({
            status: 'Error sql'
          })
        }
      });
    } else {
      let boolean = false;
      let query = "SELECT password from users where password = ? AND id = ?";
      mysqlConnection.query(query, [oldpass, id], (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            let query = "UPDATE users set name = ? , password =?, avatar = ? WHERE id = ?";
            mysqlConnection.query(query, [name, newpass, avatar, id], (err, rows, fields) => {
              if (!err) {
                res.send({
                  status: '200'
                })
              } else {
                res.send({
                  status: 'Error sql'
                })
              }
            });
          }else{
            res.send({
              status:'Wrong password'
            })
          }
        } else {
          res.send({
            status: 'Error sql'
          })
        }
      });
    }
  } else {
    res.send({
      status: 'Token invalido'
    })
  }

});



// Obtener un usuario (PROTECTED)
router.get('/usuario/:id', (req, res) => {
  console.log("Obtener un usuario mediante una id")
  let permiso = verificaToken(req.headers);
  console.log(permiso)
  if (permiso) {
    const { id } = req.params;
    mysqlConnection.query('SELECT id,name,email,avatar FROM users WHERE id = ?', [id], (err, rows, fields) => {
      if (!err) {
        res.send({
          status: '200',
          usuario: rows[0]
        })
      } else {
        console.log(err);
      }
    });
  } else {
    res.send({
      status: 'Token invalido'
    })
  }


});
// Obtener varios usuarios según nombre (PROTECTED)
router.get('/usuarios/:nombre', (req, res) => {
  console.log("Obtener usuarios por nombre");
  let permiso = verificaToken(req.headers);
  if (permiso) {
    let { nombre } = req.params;
    if (nombre == "EVERYTHINGPLEASE") {
      mysqlConnection.query('SELECT id,name FROM users order by name', null, (err, rows, fields) => {
        if (!err) {
          res.send({
            status: '200',
            usuarios: rows
          })
          //res.json(rows);
        } else {
          res.send({
            status: 'Error sql'
          })
        }
      });
    } else {
      mysqlConnection.query('SELECT id,name FROM users WHERE name LIKE ? order by name', [nombre + "%"], (err, rows, fields) => {
        if (!err) {
          res.send({
            status: '200',
            usuarios: rows
          })
        } else {
          res.send({
            status: 'Error sql'
          })
        }
      });
    }
  } else {
    res.send({
      status: 'Token invalido'
    })
  }



});
//Obtener todos los quizz de alguien (UNPROTECTED)
router.get('/usuario/:id/wall', (req, res) => {
  console.log("Obtener quizz por id")
  const { id } = req.params;
  mysqlConnection.query('SELECT * FROM quizz WHERE creador = ? AND publicado = 1', [id], (err, rows, fields) => {
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
//Obtener los quizzes de todos los seguidos (UNPROTECTED)
router.get('/quizz/:id/seguidos', (req, res) => {
  console.log("Obtener quizz de los seguidos")
  const { id } = req.params;
  let query = "SELECT * FROM quizz WHERE creador in ( SELECT destino from follows where origen = ? ) AND publicado = 1 order by fechacreacion DESC"
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        res.json({
          status: "200",
          cont: null
        })
      } else {
        res.json({
          status: "200",
          cont: rows
        });
      }
      return res;
    } else {
      console.log(err);
    }
  });
});
//Obtener los quizzes de la web (UNPROTECTED)
router.get('/quizz/todos', (req, res) => {
  console.log("Obtener quizz de todos")
  let query = "SELECT * FROM quizz where publicado = 1 order by estrellas DESC"
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
//Obtener los quizzes a moderar (UNPROTECTED)
router.post('/quizz/moderacion', (req, res) => {
  console.log("obtener quizz a moderar")
  const { id } = req.body;
  let query = "SELECT * FROM quizz where publicado = 0 AND creador != ? AND id not in " +
    "(select quizz from moderacion where usuario = ? ) order by estrellas DESC"
  mysqlConnection.query(query, [id, id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        res.json({
          status: "200",
          cont: null
        })
      } else {
        res.json({
          status: "200",
          cont: rows
        });
      }
      return res;
    } else {
      console.log(err);
    }
  });
});
//guarda una accion de moderacion (UNPROTECTED)
router.post('/modera', (req, res) => {
  console.log("guarda una accón de moderar")
  const { quizz, usuario, decision } = req.body;
  console.log(quizz + "--" + usuario + "---" + decision)
  const query = "insert into moderacion (quizz,usuario,decision) VALUES(?,?,?)";
  mysqlConnection.query(query, [quizz,usuario,decision], (err, rows, fields) => {
    if (!err) {
    } else {
      console.log(err);
    }
  });
});
//Obtener un solo quizz (UNPROTECTED)
router.get('/quizz/:id', (req, res) => {
  console.log("Obtener quizz del id")
  const { id } = req.params;
  let query = "SELECT * FROM quizz WHERE id = ? and publicado = 1"
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

//Obtener cantidad de quizzes creados (UNPROTECTED)
router.get('/quizz/:id/cantidad', (req, res) => {
  console.log("Obtener cantidad de quizzes por un usuario")
  const { id } = req.params;
  let cantidad = 0;
  let query = "SELECT count(id) as c FROM quizz WHERE creador = ? and publicado = 1"
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
      } else {
        cantidad = rows[0].c
      }
      return res.json({ resultado: cantidad });
    } else {
      console.log(err);
    }
  });
});

//Obtener cantidad de votos recibidos x personas (UNPROTECTED)
router.get('/quizz/:id/media', (req, res) => {
  console.log("Obtener cantidad de votos, (no cantidad)")
  const { id } = req.params;
  let cantidad = 0;
  let query = "SELECT count(quizz) as m FROM votaciones WHERE quizz = ?"
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
      } else {
        cantidad = rows[0].m
      }
      return res.json({ resultado: cantidad });
    } else {
      console.log(err);
    }
  });
});

//Obtener número de seguidores (UNPROTECTED)
router.post('/usuario/followers', (req, res) => {
  let resultados = [];
  const { origen, destino } = req.body;
  console.log("Obtener número de seguidores")
  //const { id } = req.params;

  let query0 = "SELECT *  FROM follows WHERE origen = ? AND destino = ? OR destino = ? AND origen = ?";
  mysqlConnection.query(query0, [origen, destino, origen, destino], (err, rows, fields) => {
    if (!err) {
      console.log("TOTAL " + rows);
      if (rows.length < 2) {
        resultados[0] = rows;
      } else {
        resultados[0] = rows;
      }
    } else {
      console.log(err);
    }
  });

  let query = "SELECT count(origen) as followers FROM follows WHERE origen = ?";
  mysqlConnection.query(query, [destino], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        resultados[1] = 0;
      } else {
        resultados[1] = rows[0].followers
      }
    } else {
      console.log(err);
    }
  });
  let query2 = "SELECT count(destino) as followers FROM follows WHERE destino = ?"
  mysqlConnection.query(query2, [destino], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        resultados[2] = 0;
      } else {
        resultados[2] = rows[0].followers
      }

      res.json({ status: "200", cont: resultados });
    } else {
      console.log(err);
    }
  });
});



//Petición de subida de archivo (VER COMO PROTEGER)
router.post('/file', upload.any('file'), (req, res, next) => {
  console.log("PETICION SUBIR IMAGENES")
  console.log("PARAMETROS")
  console.log(req.files)

});

//Peticion para crear un quizz (UNPROTECTED)
router.post('/creaQuizz', cors(), (req, res, next) => {
  console.log("PETICION subir un quizz")
  console.log("PARAMETROS")
  const { creador, titulo, contenido, fecha } = req.body;
  console.log(creador + "--" + titulo);
  const query = "insert into quizz (creador,titulo,contenido,fechacreacion,estrellas,publicado) VALUES(?,?,?,?,0,0)";
  mysqlConnection.query(query, [creador, titulo, contenido, fecha], (err, rows, fields) => {
    if (!err) {
      const query2 = "insert into moderacion (id,creador,positivos,negativos) VALUES(?,?,0,0)";
      mysqlConnection.query(query2, [rows.insertId, creador], (err, rows, fields) => {
        if (!err) {

        } else {
          console.log(err);
        }
      });


      res.json({ id: rows.insertId });
    } else {
      console.log(err);
    }
  });


});

//Peticion para borrar un quizz
router.post('/borraQuizz', cors(), (req, res, next) => {
  console.log("PETICION borrar un quizz")
  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    console.log(permiso);
    console.log("PARAMETROS")
    const { quizz } = req.body;
    console.log(req.body);

    

    mysqlConnection.query('DELETE FROM quizz WHERE id = ? AND creador = ?', [quizz, permiso], (err, rows, fields) => {
      if (!err) {
        res.send({
          status: '200'
        })
      } else {
        res.send({
          status: 'Error sql'
        })
      }
    });
  } else {
    res.send({
      status: 'Token invalido'
    })
  }
});


//Peticion para puntuar un test (PROTECTED)
router.post('/vota', cors(), (req, res, next) => {
  console.log("PETICION votar")
  console.log("PARAMETROS")
  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    const { origen, quizz, cantidad } = req.body;
    if (permiso == origen) {
      let estrellas = 0;
      const query = "insert into votaciones (origen,quizz,cantidad) VALUES(?,?,?)";
      mysqlConnection.query(query, [origen, quizz, cantidad], (err, rows, fields) => {
        if (err) {
          res.send({
            status: 'Error sql'
          })
        }
      });
      setTimeout(() => {
        estrellas = cantidad;
        const query3 = "update quizz set estrellas = estrellas + ? where id = ?";
        mysqlConnection.query(query3, [estrellas, quizz], (err, rows, fields) => {
          console.log(rows);
          if (!err) {
            res.send({
              status: '200'
            })
          } else {
            res.send({
              status: 'Error sql'
            })
          }
        });
      }, 1000);
    } else {
      res.send({
        status: 'Usuario sin permiso'
      })
    }
  } else {
    res.send({
      status: 'Token invalido'
    })
  }




});


//Peticion post para ver si sigue a x persona (UNPROTECTED)
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

//Peticion post para comenzar a seguir (PROTECTED)
router.post('/follow', cors(), (req, res, next) => {
  console.log("PETICION para INTRODUCIR UN SEGUIMIENTO")

  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    const { origen, destino } = req.body;
    if (permiso == origen) {
      const query = "insert into follows values(?,?)";
      mysqlConnection.query(query, [origen, destino], (err, rows, fields) => {
        if (!err) {
          res.send({
            status: '200'
          })
        }
        else {
          console.log(err)
          res.send({
            status: 'Error sql'
          })

        }
      });
    } else {
      res.send({
        status: 'No tienes permiso'
      })
    }
  }
});

//Peticion post para borrar un seguimiento (PROTECTED)
router.post('/unfollow', cors(), (req, res, next) => {
  console.log("PETICION para borrar un seguimiento")
  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    const { origen, destino } = req.body;
    if (permiso == origen) {
      const query = "delete from follows where origen = ? AND destino = ?";
      mysqlConnection.query(query, [origen, destino], (err, rows, fields) => {
        if (!err) {
          res.send({
            status: '200'
          })
        }
        else {
          console.log(err)
          res.send({
            status: 'Error sql'
          })

        }
      });
    } else {
      res.send({
        status: 'No tienes permiso'
      })
    }
  }

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


module.exports = router;
