var cors = require('cors')
const express = require('express');
const router = express.Router();
const app = express();
app.use(cors())
var multer = require("multer");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


var crypto = require('crypto')
const algorithm = 'aes-192-cbc';
const secretPassword = 'a670711037';

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

function encripta(texto) {
  const passwordraw = crypto.scryptSync(secretPassword, texto, 24);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv(algorithm, passwordraw, iv);
  let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

//Petición para registrar un usuario .
router.post('/register', cors(), (req, res, next) => {
  console.log("PETICION REGISTRO")
  console.log("PARAMETROS")
  let { name, email, password } = req.body;
  password = encripta(password);
  console.log(name, email, password);

  const query = "insert into users (name,email,password) VALUES(?,?,?)";

  mysqlConnection.query(query, [name, email, password], (err, rows, fields) => {
    if (!err) {
      var token = creaToken(rows.insertId);
      console.log(token);
      res.send({ status: "200", auth: true, token: token, id: rows.insertId });
    } else {
      if (err.code == 'ER_DUP_ENTRY') {
        res.send({ status: "Duplicate" });
      } else {
        res.send({ status: "Error sql" });
      }
    }
  });
});
//Petición para iniciar sesión
router.post('/authenticate', cors(), (req, res, next) => {
  console.log("PETICION LOGIN(authenticate)")
  console.log("PARAMETROS")
  let { email, password } = req.body;
  password = encripta(password);

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
          } else {
            res.send({
              status: 'Wrong password'
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


// Ver si un usuario es admin (PROTECTED)
router.get('/usuario/admin', (req, res) => {
  console.log("Preguntar si un usuario es administrador")
  let permiso = verificaToken(req.headers);
  console.log(permiso)
  if (permiso) {
    mysqlConnection.query('SELECT id FROM users WHERE id = ? and admin is not null', [permiso], (err, rows, fields) => {
      if (!err) {
        let respuesta = false;
        console.log(rows.length);
        if (rows.length > 0) {
          respuesta = true;
        }
        res.send({
          status: '200',
          respuesta: respuesta
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
// Obtener los logros de un usuario (PROTECTED)
router.get('/usuario/:id/logros', (req, res) => {
  console.log("Obtener logros de un usuario")
  let permiso = verificaToken(req.headers);
  const { id } = req.params;
  if (permiso) {
    mysqlConnection.query('SELECT L.*,(SELECT fecha from logros_obtenidos where usuario= ? and logro = L.id) as fecha from logros L', [id], (err, rows, fields) => {
      if (!err) {
        res.send({
          status: '200',
          logros: rows
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
// Obtener notificaciones de un usuario (PROTECTED)
router.get('/usuario/notificaciones', (req, res) => {
  console.log("Obtener las notificaciones de un usuario")
  let permiso = verificaToken(req.headers);
  console.log(permiso)
  if (permiso) {
    mysqlConnection.query('SELECT mensaje FROM notificaciones WHERE usuario = ? and leido is null', [permiso], (err, rows, fields) => {
      if (!err) {
        res.send({
          status: '200',
          mensajes: rows
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
// Obtener varios usuarios según nombre (PROTECTED)
router.get('/usuarios/:nombre', (req, res) => {
  console.log("Obtener usuarios por nombre");
  let permiso = verificaToken(req.headers);
  if (permiso) {
    let { nombre } = req.params;
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
  } else {
    res.send({
      status: 'Token invalido'
    })
  }
});
//Obtener todos los quizz de alguien (SEMI-PROTECTED)
router.get('/usuario/:id/wall', (req, res) => {
  console.log("Obtener todos los quizz de un perfil")

  let permiso = verificaToken(req.headers);

  const { id } = req.params;
  console.log(id);
  let query = ""
  if (permiso == id) {
    query = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q left JOIN votaciones v on q.id=v.quizz WHERE creador = ? GROUP BY q.id order by fechacreacion DESC"
  } else {
    query = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q left JOIN votaciones v on q.id=v.quizz WHERE creador = ? AND publicado = 1 AND privado is null GROUP BY q.id order by fechacreacion DESC"
  }
  mysqlConnection.query(query, [id], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        res.json({
          status: "EMPTY",
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
//Obtener los quizzes de todos los seguidos (UNPROTECTED)
router.get('/quizz/:id/seguidos/:cadena', (req, res) => {
  console.log("Obtener quizz de los seguidos")
  const { id, cadena } = req.params;
  let limite = cadena.split("-");
  limite = "LIMIT " + limite[0] + "," + limite[1];
  let total = 0;
  let query2 = "SELECT count(id) as pls from quizz where publicado=1 and privado is null and  creador in ( SELECT destino from follows where origen = ? ) "
  mysqlConnection.query(query2, [id], (err, rows, fields) => {
    total = rows[0].pls;
    let query = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q left JOIN votaciones v on q.id=v.quizz WHERE creador in ( SELECT destino from follows where origen = ? ) AND publicado = 1 AND privado IS NULL GROUP BY q.id order by fechacreacion DESC " + limite
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
            cont: rows,
            total:total
          });
        }
        return res;
      } else {
        console.log(err);
      }
    });
  });
});
//Obtener los quizzes de la web (UNPROTECTED)
router.get('/quizz/todos/:cadena', (req, res) => {
  console.log("Obtener quizz de todos")
  const { cadena } = req.params;
  let limite = cadena.split("-");
  limite = "LIMIT " + limite[0] + "," + limite[1];
  console.log(limite)

  let total = 0;
  let query2 = "SELECT count(id) as pls from quizz where publicado=1 and privado IS NULL"
  mysqlConnection.query(query2, null, (err, rows, fields) => {
    total = rows[0].pls;
    let query = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q LEFT JOIN votaciones v on q.id=v.quizz"
      + " where publicado = 1 and privado is null GROUP BY q.id DESC " + limite;
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
            cont: rows,
            total: total
          });
        }
        return res;
      } else {
        console.log(err);
      }
    });
  });



});
// Obtener quizz según nombre 
router.get('/quizzes/:nombre', (req, res) => {
  let { nombre } = req.params;
  console.log("Obtener quizz por nombre " + nombre);
  mysqlConnection.query('SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q left join votaciones v on q.id=v.quizz WHERE LOWER(q.titulo) LIKE LOWER(?) AND q.publicado=1 AND privado IS NULL GROUP BY q.id order by q.titulo', ['%' + nombre + "%"], (err, rows, fields) => {
    if (!err) {
      res.send({
        status: '200',
        quizzes: rows
      })
    } else {
      res.send({
        status: 'Error sql'
      })
    }
  });

});
//Obtener los quizzes a moderar (UNPROTECTED)
router.post('/quizz/moderacion', (req, res) => {
  console.log("obtener quizz a moderar")
  const { id } = req.body;
  let query = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q left join votaciones v on q.id=v.quizz where publicado = 0 AND privado is null AND creador != ? AND id not in " +
    "(select quizz from moderacion where usuario = ? ) group by q.id"
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
//guarda una accion de moderacion (PROTECTED)
router.post('/modera', (req, res) => {
  console.log("Guarda una acción de moderar")
  const { quizz, usuario, decision } = req.body;
  let titulo = null;
  let creador = null;
  console.log(quizz + "--" + "--" + usuario + "---" + decision)
  let permiso = verificaToken(req.headers);
  if (permiso) {
    let queryDatos = "SELECT creador,titulo from Quizz where id = ?";
    mysqlConnection.query(queryDatos, [quizz], (err, rows, fields) => {
      if (!err) {
        creador = rows[0].creador;
        titulo = rows[0].titulo;
        console.log(creador, titulo)
        mysqlConnection.query('SELECT id FROM users WHERE id = ? and admin is not null', [permiso], (err, rows, fields) => {
          if (!err) {
            if (rows.length > 0) {
              //PUBLICO
              //TRUE
              if (decision) {
                let queryadmin = "UPDATE quizz set publicado =1 where id = ?";
                mysqlConnection.query(queryadmin, [quizz], (err, rows, fields) => {
                  if (!err) {
                    let queryadmin2 = "DELETE FROM moderacion WHERE quizz = ?";
                    mysqlConnection.query(queryadmin2, [quizz], (err, rows, fields) => {
                      if (!err) {
                        if (!err) {
                          let mensajito = "¡Enhorabuena, su Quiz " + titulo + " ha sido publicado en la web!";
                          let queryNotify = "insert into notificaciones (usuario,mensaje) values(?,?)";
                          mysqlConnection.query(queryNotify, [creador, mensajito], (err, rows, fields) => {
                            if (!err) {
                              res.send({
                                status: '200'
                              })
                            } else {
                              console.log(err)
                              res.send({
                                status: 'Error sql'
                              })
                            }
                          })
                        } else {
                          console.log(err)
                          res.send({
                            status: 'Error sql'
                          })
                        }
                      } else {
                        console.log(err)
                        res.send({
                          status: 'Error sql'
                        })
                      }
                    })
                  } else {
                    console.log(err);
                    res.send({
                      status: 'Error sql'
                    })
                  }
                });
              } else {
                //BORRO
                let queryadmin = "DELETE FROM moderacion WHERE quizz = ?";
                mysqlConnection.query(queryadmin, [quizz], (err, rows, fields) => {
                  if (!err) {
                    let queryadmin2 = "DELETE FROM quizz where id = ?";
                    mysqlConnection.query(queryadmin2, [quizz], (err, rows, fields) => {
                      if (!err) {
                        let mensajito = "Lo sentimos, su Quiz " + titulo + " no ha superado el proceso de moderación, revisa los criterios e intentalo de nuevo.";
                        let queryNotify = "insert into notificaciones (usuario,mensaje) values(?,?)";
                        mysqlConnection.query(queryNotify, [creador, mensajito], (err, rows, fields) => {
                          if (!err) {
                            res.send({
                              status: '200'
                            })
                          } else {
                            console.log(err)
                            res.send({
                              status: 'Error sql'
                            })
                          }
                        })
                      } else {
                        console.log(err)
                        res.send({
                          status: 'Error sql'
                        })
                      }
                    })
                  } else {
                    console.log(err);
                    res.send({
                      status: 'Error sql'
                    })
                  }
                });
              }
            } else {
              //APRUEBO
              const query2 = "insert into moderacion (quizz,usuario,decision) VALUES(?,?,?)";
              mysqlConnection.query(query2, [quizz, usuario, decision], (err, rows, fields) => {
                if (!err) {
                } else {
                  console.log(err);
                }
              });
            }
          }
        });
      } else {
        console.log(err)
        res.send({
          status: 'Error sql'
        })
      }
    })
  } else {
    res.send({
      status: 'Token invalido'
    })
  }
});

//Obtener un solo quizz (UNPROTECTED)
router.get('/quizz/:id', (req, res) => {
  console.log("Obtener quizz del id")
  const { id } = req.params;
  let query = "";
  console.log(id);
  if (!isNaN(id)) {
    query = "SELECT * FROM quizz WHERE id = ? and publicado = 1";
  } else {
    query = "SELECT * FROM quizz where privado = ?";
  }

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
  let query = "SELECT count(quizz) as m FROM votaciones WHERE quizz = ? OR quizz in(SELECT id from quizz where privado = ?)"
  mysqlConnection.query(query, [id,id], (err, rows, fields) => {
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
router.post('/usuario/stats', (req, res) => {
  let resultados = [0,0,0,0];
  const { origen, destino } = req.body;
  console.log("Obtener estadisticas de un perfil")
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
  let queryLogros = "SELECT count(*) as logros FROM `logros_obtenidos` WHERE usuario=?";
  mysqlConnection.query(queryLogros, [destino], (err, rows, fields) => {
    if (!err) {
      if (rows.length == 0) {
        resultados[3] = 0;
      } else {
        resultados[3] = rows[0].logros
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


//Peticion para crear un quizz (UNPROTECTED)
router.post('/creaQuizz', cors(), (req, res, next) => {
  console.log("PETICION subir un quizz")
  console.log("PARAMETROS")
  const { creador, titulo, contenido, fecha, privado } = req.body;
  console.log(creador + "--" + titulo + " " + privado);
  const query = "insert into quizz (creador,titulo,contenido,fechacreacion,publicado,privado) VALUES(?,?,?,?,0,?)";
  mysqlConnection.query(query, [creador, titulo, contenido, fecha, privado], (err, rows, fields) => {
    if (!err) {
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
  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    const { origen, quizz, cantidad } = req.body;
    console.log("O:" + origen + " Q:" + quizz + " C:" + cantidad)
    const query = "SELECT * from votaciones where origen = ? and quizz = ?";
    mysqlConnection.query(query, [origen, quizz], (err, rows, fields) => {
      if (!err) {
        if (rows.length == 0) {
          console.log("Voy a insertar votación");
          inserta(origen, quizz, cantidad)
        } else {
          console.log("Voy a actualizar votación");
          updatea(origen, quizz, cantidad);
        }
      }
    });


    function inserta(origen, quizz, cantidad) {
      const query = "insert into votaciones (origen,quizz,cantidad) VALUES(?,?,?)";
      mysqlConnection.query(query, [origen, quizz, cantidad], (err, rows, fields) => {
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
    }

    function updatea(origen, quizz, cantidad) {
      const query = "update votaciones set cantidad = ? where origen= ? AND quizz = ?";
      mysqlConnection.query(query, [cantidad, origen, quizz], (err, rows, fields) => {
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
//Peticion para marcar como leido una notificación
router.post('/usuario/read', cors(), (req, res, next) => {
  console.log("PETICION para leer una notificacion")
  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    const { mensaje } = req.body;
    const query = "UPDATE notificaciones set leido = 1 where usuario = ? AND mensaje = ?";
    mysqlConnection.query(query, [permiso, mensaje], (err, rows, fields) => {
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
      status: 'Token invalido'
    })
  }
});

//Peticion para privatizar o desprivatizar un quiz (PROTECTED)
//cambiaTipo
router.post('/cambiaTipo', cors(), (req, res, next) => {
  console.log("PETICION para cambiar privacidad")
  console.log(req.headers);
  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    const { quizz, privado } = req.body;
    console.log(quizz + "--" + privado)
    let query = "";
    if (privado == null) {
      query = "UPDATE quizz set privado = null where id = ?"
      mysqlConnection.query(query, [quizz], (err, rows, fields) => {
        if (!err) {
          res.send({
            status: '200',
            cont: rows
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
      query = "UPDATE quizz set privado = ? where id = ?";
      mysqlConnection.query(query, [privado, quizz], (err, rows, fields) => {
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
    }

  } else {
    res.send({
      status: 'Token invalido'
    })
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
