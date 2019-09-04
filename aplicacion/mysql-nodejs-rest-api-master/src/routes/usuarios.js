var cors = require('cors')
const express = require('express');
const router = express.Router();
const app = express();
var jwt = require('jsonwebtoken');
var crypto = require('crypto')
app.use(cors())
const algorithm = 'aes-192-cbc';

const { validationResult } = require('express-validator');
var tokenService = require('../tokenService');
let secretWord = tokenService;

const listaQuerys = require('../querys');
const listaValidaciones = require('../validaciones');
const mysqlConnection = require('../database.js');

function creaToken(id) {
  var token = jwt.sign({ id: id }, secretWord, {
    expiresIn: 86400 // expires in 24 hours
  });
  console.log(token)
  return token;
}



function verificaToken(headers, res, verdad) {
  let bearerHeader = headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    try {
      let decoded = jwt.verify(bearerToken, secretWord)
      return decoded.id;
    } catch (err) {
      if (verdad) {
        return 0;
      }
      console.log("Es un token erroneo");
      gestionaEnvioErrores(2, res);
      return false;
    }
  } else {
    console.log("Es un token invalido");
    gestionaEnvioErrores(2, res);
    return false;


  }
}

function encripta(texto) {
  const passwordraw = crypto.scryptSync(secretWord, texto, 24);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv(algorithm, passwordraw, iv);
  let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function logroAvatar(id, avatar, oldAvatar, res) {
  ejecutaConsulta("buscaLogro", [id, 6], res,
    function (rows) {
      if (rows) {
        if (rows.length == 0) {
          if (oldAvatar != avatar) {
            ejecutaConsulta("insertLogro", [id, 6], res,
              function (rows) { console.log("Logro insertado") });
          }
        }
      }
    });
}

function logroUsuarios(id, res) {
  ejecutaConsulta("checkLogrosByUser", [id, id, id], res,
    function (rows) {
      if (rows) {
        for (let i = 1; i <= 2; i++) {
          if (rows[0]["logro" + i] != null) {
            ejecutaConsulta("buscaLogro", [id, i], res,
              function (rows2) {
                if (rows2) {
                  if (rows2.length == 0) {
                    ejecutaConsulta("insertLogro", [id, i], res,
                      function (rows) { console.log("Logro insertado") });
                  }
                }
              });
          }
        }
      };
    });
}

function compruebaErrores(req, res) {
  const errores = validationResult(req);
  if (errores.isEmpty()) {
    return false;
  } else {
    gestionaEnvioErrores(5, res, errores);
    return true;
  }
}
function gestionaEnvioErrores(opcion, res, errores) {
  switch (opcion) {
    case 1:
      console.log("Error sql");
      res.statusCode = 500;
      res.send({ status: "Error sql" });
      break;
    case 2:
      console.log("Token invalido");
      res.statusCode = 403;
      res.send({ status: 'Token invalido' })
      break;
    case 3:
      console.log("Duplicate");
      res.send({ auth: false });
      break;
    case 4:
      console.log("Contraseña incorrecta");
      res.send({ status: "Wrong password" });
      break;
    case 5:
      console.log("Error en validación de campos")
      res.status(422).send({ error: errores.array() });
  }
}

function ejecutaConsulta(query, valores, res, callback, limite) {
  let queryElegida = limite == undefined ? listaQuerys[query] : listaQuerys[query] + limite;
  mysqlConnection.query(queryElegida, valores, (err, rows, fields) => {
    if (!err) {
      return callback(rows);
    } else {
      console.log("HA OCURRIDO UN ERROR");

      if (err.code == 'ER_DUP_ENTRY') {
        gestionaEnvioErrores(3, res);
      } else {
        console.log(err)
        gestionaEnvioErrores(1, res);
      }
      return callback(false);
    }
  });
}


//Petición para registrar un usuario .
router.post('/register', listaValidaciones["registro"], (req, res, next) => {
  console.log("Petición de registro de un usuario")
  if (!compruebaErrores(req, res)) {
    let { name, email, password } = req.body;
    password = encripta(password);
    ejecutaConsulta("registro", [name, email, password], res,
      function (rows) {
        if (rows) {
          res.send({ status: "200", auth: true, token: creaToken(rows.insertId), id: rows.insertId });
        }
      });
  }
});
//Petición para iniciar sesión
router.post('/authenticate', listaValidaciones["login"], (req, res, next) => {
  console.log("Petición de inicio de sesión")
  if (!compruebaErrores(req, res)) {
    let { email, password } = req.body;
    password = encripta(password);
    ejecutaConsulta("login", [email, password], res, function (rows) {
      if (rows) {
        if (rows.length > 0) {//Datos correctos
          res.send({ auth: true, token: creaToken(rows[0].id), respuesta: rows[0] });
        } else {//Datos incorrectos
          res.send({ auth: false });
        }
      }
    });
  }

});

//Actualizar perfil de un usuario (PROTECTED)
router.put('/usuario/actualizar/:id', listaValidaciones["editar"], (req, res, next) => {
  console.log("Petición para actualizar el perfil de un usuario")
  if (!compruebaErrores(req, res)) {
    let permiso = verificaToken(req.headers, res);
    if (permiso) {
      let { name, oldpass, newpass, avatar } = req.body;
      const { id } = req.params; 3
      //Logro 6
      ejecutaConsulta("getUsuario", [id], res, function (rows) {
        if (rows) {
          logroAvatar(permiso, avatar, rows[0].avatar, res);
        }
      })
      //Logro 6 

      if (oldpass == undefined || newpass == undefined) {//Modificamos solo nombre y avatar
        ejecutaConsulta("editarPerfil1", [name, avatar, id], res, function (rows) {
          if (rows) {
            res.send({ status: '200' });
          }
        })
      } else {//Modificamos contraseñas también
        oldpass = encripta(oldpass);
        newpass = encripta(newpass);
        ejecutaConsulta("editarPerfil2", [oldpass, id], res, function (rows2) {
          if (rows2) {
            if (rows2.length > 0) {
              ejecutaConsulta("editarPerfil3", [name, newpass, avatar, id], res, function (rows3) {
                if (rows3) {
                  res.send({ status: '200' });
                }
              });
            } else {//Contraseña incorrecta
              gestionaEnvioErrores(4, res);
            }
          }
        });
      }
    }
  }
});


// Ver si un usuario es admin (PROTECTED)
router.get('/usuario/admin', (req, res) => {
  console.log("Preguntar si un usuario es administrador")
  let permiso = verificaToken(req.headers, res);
  if (permiso) {
    ejecutaConsulta("isAdmin", [permiso], res, function (rows) {
      if (rows) {
        let respuesta = rows.length > 0 ? true : false;
        res.send({ status: '200', respuesta: respuesta })
      }
    })
  }
});
//Guarda una acción de reporte (PROTECTED)
router.post('/reportar', (req, res) => {
  console.log("Guarda una acción de reporte")
  const { destino, motivo } = req.body;
  let permiso = verificaToken(req.headers, res);
  console.log(permiso + "--" + destino + "--" + destino)
  if (permiso) {
    ejecutaConsulta("getReport", [permiso, destino, motivo], res, function (rows) {
      if (rows) {
        if (rows.length < 1) {
          ejecutaConsulta("setReport", [permiso, destino, motivo], res, function (rows) { })
        }
        res.send({ status: '200' })
      }
    })
  }
});
// Obtener los logros de un usuario (PROTECTED)
router.get('/usuario/:id/logros', (req, res) => {
  console.log("Obtener logros de un usuario")
  const { id } = req.params;
  ejecutaConsulta("buscaLogros", [id], res, function (rows) {
    if (rows) {
      res.send({ status: '200', respuesta: rows });
    }
  });
});
// Obtener notificaciones de un usuario (PROTECTED)
router.get('/usuario/notificaciones', (req, res) => {
  console.log("Obtener las notificaciones de un usuario")
  let permiso = verificaToken(req.headers, res);
  if (permiso) {
    ejecutaConsulta("getNotis", [permiso], res, function (rows) {
      if (rows) {
        res.send({ respuesta: rows })
      }
    });
  }
});

// Obtener un usuario (UNPROTECTED)
router.get('/usuario/:id', (req, res) => {
  console.log("Obtener un usuario mediante una id")
  const { id } = req.params;
  ejecutaConsulta("getUsuario", [id], res, function (rows) {
    if (rows) {
      res.send({ status: '200', respuesta: rows[0] })
    };
  });

});
// Obtener varios usuarios según nombre (PROTECTED)
router.get('/usuarios/:nombre', (req, res) => {
  console.log("Obtener usuarios por nombre");
  let permiso = verificaToken(req.headers, res);
  let { nombre } = req.params;
  if (permiso) {
    ejecutaConsulta("getUsuariosByNombre", [nombre + "%"], res, function (rows) {
      if (rows) {
        res.send({ status: '200', respuesta: rows })
      };
    });
  }
});
//Obtener todos los quizz de alguien (SEMI-PROTECTED)
router.get('/usuario/:id/wall', (req, res) => {
  console.log("Obtener todos los quizz de un perfil")
  const { id } = req.params;
  let permiso = verificaToken(req.headers, res, true);
  let query = permiso == id ? "getUsuarioWallPrivate" : "getUsuarioWallPublic"
  ejecutaConsulta(query, [id], res, function (rows) {
    if (rows) {
      res.send({ respuesta: rows });
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

  ejecutaConsulta("getSeguidos1", [id], res, function (rows) {
    if (rows) {
      total = rows[0].pls;
      ejecutaConsulta("getSeguidos2", [id], res, function (rows2) {
        if (rows2) {
          res.send({ cont: rows2, total: total });
        }
      }, limite);
    }
  })
});
//Obtener los quizzes de la web (UNPROTECTED)
router.get('/quizz/todos/:cadena', (req, res) => {
  console.log("Petición para obtener todos los quizzes de la web")
  const { cadena } = req.params;
  let total = 0;
  let limite = cadena.split("-");
  limite = "LIMIT " + limite[0] + "," + limite[1];
  console.log(limite)
  ejecutaConsulta("getAllQuizzes1", null, res, function (rows) {
    if (rows) {
      total = rows[0].pls;
      ejecutaConsulta("getAllQuizzes2", null, res, function (rows2) {
        if (rows2) {
          res.send({ cont: rows2, total: total });
        }
      }, limite);
    }
  });
});

// Obtener quizzes según nombre 
router.get('/quizzes/:nombre', (req, res) => {
  let { nombre } = req.params;
  console.log("Obtener quizzes por nombre " + nombre);
  ejecutaConsulta("getQuizzesByName", ['%' + nombre + "%"], res, function (rows) {
    if (rows) {
      res.send({ respuesta: rows });
    }
  });
});

//Obtener los quizzes a moderar (UNPROTECTED)
router.post('/quizz/moderacion', (req, res) => {
  console.log("obtener quizzes a moderar")
  const { id } = req.body;

  ejecutaConsulta("getQuizzesaModerar", [id, id], res, function (rows) {
    if (rows) {
      res.send({ respuesta: rows });
    }
  });
});
//guarda una accion de moderacion (PROTECTED)
router.post('/modera', (req, res) => {
  console.log("Guarda una acción de moderar")
  const { quizz, usuario, decision } = req.body;
  let titulo = null;
  let creador = null;
  let permiso = verificaToken(req.headers, res);
  if (permiso) {
    ejecutaConsulta("setModerar1", [quizz], res, function (rows) {
      if (rows) {
        creador = rows[0].creador;
        titulo = rows[0].titulo;
        ejecutaConsulta("setModerar2", [permiso], res, function (rows2) {//Compruebo si el usuario es administrador
          if (rows2) {
            if (rows2.length > 0) {//Si soy administrador
              if (decision) {//Si quiero PUBLICAR el quiz
                ejecutaConsulta("setModerar3", [quizz], res, function (rows3) {
                  if (rows3) {
                    ejecutaConsulta("setModerar4", [quizz], res, function (rows4) {
                      if (rows4) {
                        let mensajito = "¡Enhorabuena, su Quiz " + titulo + " ha sido publicado en la web!";
                        ejecutaConsulta("setModerar5", [creador, mensajito], res, function (rows5) {
                          logroUsuarios(creador, res);
                          if (rows5) {
                            res.send({ status: '200' });
                          }
                        });
                      }
                    });
                  }
                });
              } else {//Si quiero BORRAR el quiz
                ejecutaConsulta("setModerar4", [quizz], res, function (rows6) {
                  if (rows6) {
                    ejecutaConsulta("setModerar6", [quizz], res, function (rows7) {
                      if (rows7) {
                        let mensajito = "Lo sentimos, su Quiz " + titulo + " no ha superado el proceso de moderación, revisa los criterios e intentalo de nuevo.";
                        ejecutaConsulta("setModerar7", [creador, mensajito], res, function (rows8) {
                          res.send({ status: '200' });
                        });
                      }
                    })
                  }
                });
              }
            } else {//SI NO SOY ADMINISTRADOR, GUARDO ACCIÓN MODERAR
              ejecutaConsulta("setModerar8", [quizz, usuario, decision], res, function (rows8) {
                res.send({ status: '200' });
              });
            }
          }
        });
      }
    });
  }
});

//Obtener un solo quizz (UNPROTECTED)
router.get('/quizz/:id', (req, res) => {
  console.log("Obtener quizz del id")
  const { id } = req.params;
  let query = !isNaN(id) ? "getOneQuizz1" : "getOneQuizz2";
  ejecutaConsulta(query, [id], res, function (rows) {
    if (rows) {
      res.send({ respuesta: rows[0] });
    }
  });

});

//Obtener número de seguidores (UNPROTECTED)
router.post('/usuario/stats', (req, res) => {
  console.log("Obtener estadisticas de un perfil")
  const { origen, destino } = req.body;
  ejecutaConsulta("getEstadisticas", [origen, destino, destino, origen, destino, destino, destino, destino], res, function (rows) {
    if (rows) {
      res.send({ status: "200", respuesta: rows[0] });
    }
  });
});


//Peticion para crear un quiz (UNPROTECTED)
router.post('/creaQuizz', cors(), (req, res, next) => {
  console.log("Petición para crear un quiz")
  const { creador, titulo, contenido, fecha, privado } = req.body;
  ejecutaConsulta("setQuiz", [creador, titulo, contenido, fecha, privado], res, function (rows) {
    if (rows) {
      res.send({ respuesta: rows.insertId });
    }
  })
});

//Peticion para borrar un quizz
router.post('/borraQuizz', cors(), (req, res, next) => {
  console.log("Petición para borrar un quizz")
  const { quizz } = req.body;
  let permiso = verificaToken(req.headers, res);
  if (permiso) {
    ejecutaConsulta("deleteQuiz", [quizz, permiso], res, function (rows) {
      if (rows) {
        res.send({ status: '200' });
      }
    });
  }
});


//Peticion para puntuar un test (PROTECTED)
router.post('/vota', cors(), (req, res, next) => {
  console.log("Petición para puntuar un test")
  const { origen, quizz, cantidad } = req.body;
  let permiso = verificaToken(req.headers, res);

  if (permiso) {
    ejecutaConsulta("setVotacion1", [origen, quizz], res, function (rows) {
      if (rows) {
        if (rows.length == 0) {
          ejecutaConsulta("setVotacion2", [origen, quizz, cantidad], res, function (rows2) {

            res.send({});
          });
        } else {
          ejecutaConsulta("setVotacion3", [cantidad, origen, quizz], res, function (rows3) {
            res.send({});
          });
        }
      }
    });
  }
});


//Peticion post para ver si sigue a x persona (UNPROTECTED)
router.post('/isFollowing', cors(), (req, res, next) => {
  console.log("Petición para ver si hay un seguimiento")
  const { origen, destino } = req.body;

  ejecutaConsulta("isFollowing", [origen, destino], res, function (rows) {
    if (rows) {
      let verdad = rows.length < 1 ? false : true;
      res.send({ respuesta: verdad });
    }
  });
});

//Peticion post para comenzar a seguir (PROTECTED)
router.post('/follow', cors(), (req, res, next) => {
  console.log("Petición para comenzar a seguir")
  const { origen, destino } = req.body;
  let permiso = verificaToken(req.headers, res);
  if (permiso) {
    ejecutaConsulta("setFollow", [origen, destino], res, function (rows) {
      if (rows) {
        logroUsuarios(destino, res);
        res.send({ status: '200' });
      }
    });
  }
});
//Peticion para marcar como leido una notificación
router.post('/usuario/read', cors(), (req, res, next) => {
  console.log("Petición para leer una notificación");
  const { mensaje } = req.body;
  let permiso = verificaToken(req.headers, res);
  if (permiso) {
    ejecutaConsulta("readNoti", [permiso, mensaje], res, function (rows) {
      if (rows) {
        res.send({ status: '200' });
      }
    });
  }
});

//Peticion para privatizar o desprivatizar un quiz (PROTECTED)
router.post('/cambiaTipo', cors(), (req, res, next) => {
  console.log("Petición para cambiar la privacidad")
  const { quizz, privado } = req.body;
  let permiso = verificaToken(req.headers, res);
  let query = privado == null ? "setPrivacidad1" : "setPrivacidad2";
  let valores = privado == null ? [quizz] : [privado, quizz];
  if (permiso) {
    ejecutaConsulta(query, valores, res, function (rows) {
      if (rows) {
        res.send({ status: '200', cont: rows });
      }
    });
  }
});

//Peticion post para borrar un seguimiento (PROTECTED)
router.post('/unfollow', cors(), (req, res, next) => {
  console.log("Petición para borrar un seguimiento");
  const { origen, destino } = req.body;
  let permiso = verificaToken(req.headers, res);
  if (permiso) {
    ejecutaConsulta("deleteFollow", [origen, destino], res, function (rows) {
      res.send({ status: '200' });
    });
  }
});

module.exports = router;
