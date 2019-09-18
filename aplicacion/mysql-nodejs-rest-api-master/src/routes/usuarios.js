const express = require('express'), nodeMailer = require('nodemailer');
const app = express();
const router = express.Router();
var cors = require('cors')


const queryService = require('../controllers/queryController');
const logroService = require('../controllers/logroController');
const tokenService = require('../controllers/tokenController');
const listaValidaciones = require('../validaciones');


app.use(cors())




function enviaCorreo() {
  console.log("Procedo a enviar un correo??")
  let transporter = nodeMailer.createTransport({
    host: 'smtp.hasquiz.com',
    port: 465,
    secure: true,
    auth: {
      user: 'noreply@hasquiz.com',
      pass: 'Illidariweare16'
    }
  });
  let mailOptions = {
    from: '"Hasquiz" <noreply@hasquiz.com>', // sender address
    to: "exilonmlol@gmail.com", // list of receivers
    subject: "Asunto registro", // Subject line
    text: "El body churra", // plain text body
    html: '<b>NodeJS Email Tutorial</b>' // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    //res.render('index');
  });
}

//Petición para registrar un usuario .
router.post('/api/register', listaValidaciones["registro"], (req, res, next) => {
  console.log("Petición de registro de un usuario")
  if (!queryService.compruebaErrores(req, res)) {
    let { name, email, password } = req.body;
    password = tokenService.encripta(password);
    queryService.ejecutaConsulta("registro", [name, email, password], res,
      function (rows) {
        if (rows) {
          res.send({ status: "200", auth: true, token: tokenService.creaToken(rows.insertId), id: rows.insertId });
        }
      });
  }
});
//Petición para iniciar sesión
router.post('/api/authenticate', listaValidaciones["login"], (req, res, next) => {
  console.log("Petición de inicio de sesión")
  if (!queryService.compruebaErrores(req, res)) {
    let { email, password } = req.body;
    password = tokenService.encripta(password);
    queryService.ejecutaConsulta("login", [email, password], res, function (rows) {
      if (rows) {
        if (rows.length > 0) {//Datos correctos
          res.send({ auth: true, token: tokenService.creaToken(rows[0].id), respuesta: rows[0] });
        } else {//Datos incorrectos
          res.send({ auth: false });
        }
      }
    });
  }

});

//Actualizar perfil de un usuario (PROTECTED)
router.put('/api/usuario/actualizar/:id', listaValidaciones["editar"], (req, res, next) => {
  console.log("Petición para actualizar el perfil de un usuario")
  if (!queryService.compruebaErrores(req, res)) {
    let permiso = tokenService.verificaToken(req.headers, res);
    if (permiso) {
      let { name, oldpass, newpass, avatar } = req.body;
      const { id } = req.params; 3
      //Logro 1 (Nuevo outfit)
      queryService.ejecutaConsulta("getUsuario", [id], res, function (rows) {
        if (rows) {
          logroService.logroAvatar(permiso, avatar, rows[0].avatar, res);//Logro 1
        }
      })
      //Logro 1 (Nuevo outfit)

      if (oldpass == undefined || newpass == undefined) {//Modificamos solo nombre y avatar
        queryService.ejecutaConsulta("editarPerfil1", [name, avatar, id], res, function (rows) {
          if (rows) {
            res.send({ status: '200' });
          }
        })
      } else {//Modificamos contraseñas también
        oldpass = tokenService.encripta(oldpass);
        newpass = tokenService.encripta(newpass);
        queryService.ejecutaConsulta("editarPerfil2", [oldpass, id], res, function (rows2) {
          if (rows2) {
            if (rows2.length > 0) {
              queryService.ejecutaConsulta("editarPerfil3", [name, newpass, avatar, id], res, function (rows3) {
                if (rows3) {
                  res.send({ status: '200' });
                }
              });
            } else {//Contraseña incorrecta
              queryService.gestionaEnvioErrores(4, res);
            }
          }
        });
      }
    }
  }
});


// Ver si un usuario es admin (PROTECTED)
router.get('/api/usuario/admin', (req, res) => {
  console.log("Preguntar si un usuario es administrador");
  let permiso = tokenService.verificaToken(req.headers, res);
  if (permiso) {
    queryService.ejecutaConsulta("isAdmin", [permiso], res, function (rows) {
      if (rows) {
        let respuesta = rows.length > 0 ? true : false;
        res.send({ status: '200', respuesta: respuesta })
      }
    })
  }
});
//Guarda una acción de reporte (PROTECTED)
router.post('/api/reportar', listaValidaciones["reporte"], (req, res) => {
  console.log("Guarda una acción de reporte")
  if (!queryService.compruebaErrores(req, res)) {
    let permiso = tokenService.verificaToken(req.headers, res);
    const { destino, motivo } = req.body;
    if (permiso) {
      queryService.ejecutaConsulta("getReport", [permiso, destino, motivo], res, function (rows) {
        if (rows) {
          if (rows.length < 1) {
            queryService.ejecutaConsulta("setReport", [permiso, destino, motivo], res, function (rows) { })
          }
          res.send({ status: '200' })
        }
      })
    }
  }

});
// Obtener los logros de un usuario (PROTECTED)
router.get('/api/usuario/:id/logros', listaValidaciones["numerico"], (req, res) => {
  console.log("Obtener logros de un usuario")
  if (!queryService.compruebaErrores(req, res)) {
    const { id } = req.params;
    queryService.ejecutaConsulta("buscaLogros", [id], res, function (rows) {
      if (rows) {
        res.send({ status: '200', respuesta: rows });
      }
    });
  }
});
// Obtener notificaciones de un usuario (PROTECTED)
router.get('/api/usuario/notificaciones', (req, res) => {
  console.log("Obtener las notificaciones de un usuario")
  let permiso = tokenService.verificaToken(req.headers, res);
  if (permiso) {
    queryService.ejecutaConsulta("getNotis", [permiso], res, function (rows) {
      if (rows) {
        res.send({ respuesta: rows })
      }
    });
  }

});

// Obtener un usuario (UNPROTECTED)
router.get('/api/usuario/:id', listaValidaciones["numerico"], (req, res) => {
  console.log("Obtener un usuario mediante una id")
  if (!queryService.compruebaErrores(req, res)) {
    const { id } = req.params;
    queryService.ejecutaConsulta("getUsuario", [id], res, function (rows) {
      if (rows) {
        res.send({ status: '200', respuesta: rows[0] })
      };
    });
  }
});
// Obtener varios usuarios según nombre (PROTECTED)
router.get('/api/usuarios/:nombre', listaValidaciones["texto"], (req, res) => {
  console.log("Obtener usuarios por nombre");
  if (!queryService.compruebaErrores(req, res)) {
    let permiso = tokenService.verificaToken(req.headers, res);
    let { nombre } = req.params;
    if (permiso) {
      queryService.ejecutaConsulta("getUsuariosByNombre", [nombre + "%"], res, function (rows) {
        if (rows) {
          res.send({ status: '200', respuesta: rows })
        };
      });
    }
  }
});
//Obtener todos los quizz de alguien (SEMI-PROTECTED)
router.get('/api/usuario/:id/wall', listaValidaciones["numerico"], (req, res) => {
  console.log("Obtener todos los quizz de un perfil")
  if (!queryService.compruebaErrores(req, res)) {
    const { id } = req.params;
    let permiso = tokenService.verificaToken(req.headers, res, true);
    let query = permiso == id ? "getUsuarioWallPrivate" : "getUsuarioWallPublic"
    queryService.ejecutaConsulta(query, [id], res, function (rows) {
      if (rows) {
        res.send({ respuesta: rows });
      }
    });
  }
});
//Obtener los quizzes de todos los seguidos (UNPROTECTED)
router.get('/api/quizz/:id/seguidos/:cadena', (req, res) => {
  console.log("Obtener quizz de los seguidos")
  const { id, cadena } = req.params;
  let limite = cadena.split("-");
  limite = "LIMIT " + limite[0] + "," + limite[1];
  let total = 0;

  queryService.ejecutaConsulta("getSeguidos1", [id], res, function (rows) {
    if (rows) {
      total = rows[0].pls;
      queryService.ejecutaConsulta("getSeguidos2", [id], res, function (rows2) {
        if (rows2) {
          res.send({ cont: rows2, total: total });
        }
      }, limite);
    }
  })
});
//Obtener los quizzes de la web (UNPROTECTED)
router.get('/api/quizz/todos/:cadena', (req, res) => {
  console.log("Petición para obtener todos los quizzes de la web")
  const { cadena } = req.params;
  let total = 0;
  let limite = cadena.split("-");
  limite = "LIMIT " + limite[0] + "," + limite[1];
  queryService.ejecutaConsulta("getAllQuizzes1", null, res, function (rows) {
    if (rows) {
      total = rows[0].pls;
      queryService.ejecutaConsulta("getAllQuizzes2", null, res, function (rows2) {
        if (rows2) {
          res.send({ cont: rows2, total: total });
        }
      }, limite);
    }
  });
});

// Obtener quizzes según nombre 
router.get('/api/quizzes/:nombre', listaValidaciones["texto"], (req, res) => {
  if (!queryService.compruebaErrores(req, res)) {
    let { nombre } = req.params;
    console.log("Obtener quizzes por nombre " + nombre);
    queryService.ejecutaConsulta("getQuizzesByName", ['%' + nombre + "%"], res, function (rows) {
      if (rows) {
        res.send({ respuesta: rows });
      }
    });
  }
});

//Obtener los quizzes a moderar (UNPROTECTED)
router.get('/api/quizz/moderacion', (req, res) => {
  console.log("obtener quizzes a moderar")
  let permiso = tokenService.verificaToken(req.headers, res);
  if (permiso) {
    queryService.ejecutaConsulta("getQuizzesaModerar", [permiso, permiso], res, function (rows) {
      if (rows) {
        res.send({ respuesta: rows });
      }
    });
  }
});
//guarda una accion de moderacion (PROTECTED)
router.post('/api/modera', listaValidaciones["modera"], (req, res) => {
  console.log("Guarda una acción de moderar")
  if (!queryService.compruebaErrores(req, res)) {
    const { quizz, usuario, decision } = req.body;
    let titulo = null;
    let creador = null;
    let permiso = tokenService.verificaToken(req.headers, res);
    if (permiso) {
      queryService.ejecutaConsulta("setModerar1", [quizz], res, function (rows) {
        if (rows) {
          creador = rows[0].creador;
          titulo = rows[0].titulo;
          queryService.ejecutaConsulta("setModerar2", [permiso], res, function (rows2) {//Compruebo si el usuario es administrador
            if (rows2) {
              if (rows2.length > 0) {//Si soy administrador
                if (decision) {//Si quiero PUBLICAR el quiz
                  queryService.ejecutaConsulta("setModerar3", [quizz], res, function (rows3) {
                    if (rows3) {
                      queryService.ejecutaConsulta("setModerar4", [quizz], res, function (rows4) {
                        if (rows4) {
                          let mensajito = "¡Enhorabuena, su Quiz " + titulo + " ha sido publicado en la web!";
                          queryService.ejecutaConsulta("setModerar5", [creador, mensajito], res, function (rows5) {
                            logroService.incrementaLogro(permiso, 4, 1, 0, res); //Para el logro 4 (Kami)
                            logroService.logroUsuarios(creador, res);//Para el logro 8 (Diana)

                            if (rows5) {
                              res.send({ status: '200' });
                            }
                          });
                        }
                      });
                    }
                  });
                } else {//Si quiero BORRAR el quiz
                  queryService.ejecutaConsulta("setModerar4", [quizz], res, function (rows6) {
                    if (rows6) {
                      queryService.ejecutaConsulta("setModerar6", [quizz], res, function (rows7) {
                        if (rows7) {
                          logroService.incrementaLogro(permiso, 4, 0, 1, res); //Para el logro 4 (Kami)
                          let mensajito = "Lo sentimos, su Quiz " + titulo + " no ha superado el proceso de moderación, revisa los criterios e intentalo de nuevo.";
                          queryService.ejecutaConsulta("setModerar7", [creador, mensajito], res, function (rows8) {
                            res.send({ status: '200' });
                          });
                        }
                      })
                    }
                  });
                }
              } else {//SI NO SOY ADMINISTRADOR, GUARDO ACCIÓN MODERAR
                queryService.ejecutaConsulta("setModerar8", [quizz, usuario, decision], res, function (rows8) {
                  logroService.incrementaLogro(permiso,7,1,0,res);
                  res.send({ status: '200' });
                });
              }
            }
          });
        }
      });
    }
  }
});

//Obtener un solo quizz (UNPROTECTED)
router.get('/api/quizz/:id', listaValidaciones["numerico"], (req, res) => {
  console.log("Obtener quiz del id")
  if (!queryService.compruebaErrores(req, res)) {
    const { id } = req.params;
    let query = !isNaN(id) ? "getOneQuizz1" : "getOneQuizz2";
    queryService.ejecutaConsulta(query, [id], res, function (rows) {
      if (rows) {
        res.send({ respuesta: rows[0] });
      }
    });
  }
});

//Obtener número de seguidores (UNPROTECTED)
router.post('/api/usuario/stats', listaValidaciones["stats"], (req, res) => {
  console.log("Obtener estadisticas de un perfil")
  if (!queryService.compruebaErrores(req, res)) {
    const { origen, destino } = req.body;
    queryService.ejecutaConsulta("getEstadisticas", [origen, destino, destino, origen, destino, destino, destino, destino], res, function (rows) {
      if (rows) {
        res.send({ status: "200", respuesta: rows[0] });
      }
    });
  }
});


//Peticion para crear un quiz (PROTECTED)
router.post('/api/creaQuizz', listaValidaciones["creaQuiz"], (req, res, next) => {
  console.log("Petición para crear un quiz")
  if (!queryService.compruebaErrores(req, res)) {
    let permiso = tokenService.verificaToken(req.headers, res);
    if (permiso) {
      const { creador, titulo, contenido, fecha, privado } = req.body;
      queryService.ejecutaConsulta("setQuiz", [creador, titulo, contenido, fecha, privado], res, function (rows) {
        if (rows) {
          logroService.logroUsuarios(); //Logro 6
          res.send({ respuesta: rows.insertId });
        }
      })
    }
  }
});

//Peticion para borrar un quizz (PROTECTED)
router.post('/api/borraQuizz', listaValidaciones["numerico"], (req, res, next) => {
  console.log("Petición para borrar un quizz")
  if (!queryService.compruebaErrores(req, res)) {
    const { id } = req.body;
    let permiso = tokenService.verificaToken(req.headers, res);
    if (permiso) {
      queryService.ejecutaConsulta("deleteQuiz", [id, permiso], res, function (rows) {
        if (rows) {
          res.send({ status: '200' });
        }
      });
    }
  }
});


//Peticion para puntuar un test (PROTECTED)
router.post('/api/vota', listaValidaciones["vota"], (req, res, next) => {
  console.log("Petición para puntuar un test")
  if (!queryService.compruebaErrores(req, res)) {
    const { origen, quizz, cantidad } = req.body;
    let permiso = tokenService.verificaToken(req.headers, res);

    if (permiso) {
      queryService.ejecutaConsulta("setVotacion1", [origen, quizz], res, function (rows) {
        if (rows) {
          logroService.logroQuizzes(quizz, res); //Logro 3 (Artista)
          logroService.logroUsuarios(permiso,res); //Logro 9 (Crítico)
          if (rows.length == 0) {
            queryService.ejecutaConsulta("setVotacion2", [origen, quizz, cantidad], res, function (rows2) {
              res.send({});
            });
          } else {
            queryService.ejecutaConsulta("setVotacion3", [cantidad, origen, quizz], res, function (rows3) {
              res.send({});
            });
          }
        }
      });
    }
  }
});


//Peticion post para ver si sigue a x persona (UNPROTECTED)
router.post('/api/isFollowing', listaValidaciones["stats"], (req, res, next) => {
  console.log("Petición para ver si hay un seguimiento")
  if (!queryService.compruebaErrores(req, res)) {
    const { origen, destino } = req.body;
    queryService.ejecutaConsulta("isFollowing", [origen, destino], res, function (rows) {
      if (rows) {
        let verdad = rows.length < 1 ? false : true;
        res.send({ respuesta: verdad });
      }
    });
  }
});

//Peticion post para comenzar a seguir (PROTECTED)
router.post('/api/follow', listaValidaciones["stats"], (req, res, next) => {
  console.log("Petición para comenzar a seguir")
  if (!queryService.compruebaErrores(req, res)) {
    const { origen, destino } = req.body;
    let permiso = tokenService.verificaToken(req.headers, res);
    if (permiso) {
      queryService.ejecutaConsulta("setFollow", [origen, destino], res, function (rows) {
        if (rows) {
          logroService.logroUsuarios(destino, res);
          res.send({ status: '200' });
        }
      });
    }
  }
});
//Peticion para marcar como leido una notificación
router.post('/api/usuario/read', cors(), (req, res, next) => {
  console.log("Petición para leer una notificación");
  const { mensaje } = req.body;
  let permiso = tokenService.verificaToken(req.headers, res);
  if (permiso) {
    queryService.ejecutaConsulta("readNoti", [permiso, mensaje], res, function (rows) {
      if (rows) {
        res.send({ status: '200' });
      }
    });
  }
});

//Peticion para privatizar o desprivatizar un quiz (PROTECTED)
router.post('/api/cambiaTipo', cors(), (req, res, next) => {
  console.log("Petición para cambiar la privacidad")
  const { quizz, privado } = req.body;
  let permiso = tokenService.verificaToken(req.headers, res);
  let query = privado == null ? "setPrivacidad1" : "setPrivacidad2";
  let valores = privado == null ? [quizz] : [privado, quizz];
  if (permiso) {
    queryService.ejecutaConsulta(query, valores, res, function (rows) {
      if (rows) {
        res.send({ status: '200', cont: rows });
      }
    });
  }
});

//Peticion post para borrar un seguimiento (PROTECTED)
router.post('/api/unfollow', listaValidaciones["stats"], (req, res, next) => {
  console.log("Petición para borrar un seguimiento");
  if (!queryService.compruebaErrores(req, res)) {
    const { origen, destino } = req.body;
    let permiso = tokenService.verificaToken(req.headers, res);
    if (permiso) {
      queryService.ejecutaConsulta("deleteFollow", [origen, destino], res, function (rows) {
        res.send({ status: '200' });
      });
    }
  }
});

module.exports = router;
