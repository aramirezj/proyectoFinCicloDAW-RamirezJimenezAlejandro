var cors = require('cors')
const express = require('express');
const router = express.Router();
const app = express();
var jwt = require('jsonwebtoken');
var crypto = require('crypto')
app.use(cors())
const algorithm = 'aes-192-cbc';

var tokenService = require('../tokenService');
let secretWord = tokenService;

const listaQuerys = require('../querys');


const mysqlConnection = require('../database.js');



function creaToken(id) {
  console.log(id)
  var token = jwt.sign({ id: id }, secretWord, {
    expiresIn: 86400 // expires in 24 hours
  });
  console.log(token)
  return token;
}



function verificaToken(headers) {
  //console.log(headers.authorization);
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
  const passwordraw = crypto.scryptSync(secretWord, texto, 24);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv(algorithm, passwordraw, iv);
  let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function compruebaLogros(id) {
  mysqlConnection.query(listaQuerys["buscaLogros"], [id], (err, rows, fields) => {
    if (!err) {
      for(let logro of rows){
        if(logro.fecha == null){
          mysqlConnection.query(listaQuerys["checkLogro"+logro.id], [id], (err2, rows2, fields2) => {
            if(rows2.length>0 && rows2[0]!=null){
              let parametros ="("+id+","+logro.id+")";
              insertaLogro(listaQuerys["insertLogro"]+parametros);
            }
          })
        }
      }
    }else{
      res.send({ status: "Error sql" });
    }
  });

}

function insertaLogro(query){
  mysqlConnection.query(query, null, (err, rows, fields) => {
    console.log("Se ha insertado un logro");
  })
}

//Petición para registrar un usuario .
router.post('/register', cors(), (req, res, next) => {
  console.log("PETICION REGISTRO")
  let { name, email, password } = req.body;
  password = encripta(password);
  mysqlConnection.query(listaQuerys["registro"], [name, email, password], (err, rows, fields) => {
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
  let { email, password } = req.body;
  password = encripta(password);

  console.log("Parametros:" + email, password);
  mysqlConnection.query(listaQuerys["login"], [email, password], (err, rows, fields) => {
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
    if (oldpass == undefined || newpass == undefined) {
      mysqlConnection.query(listaQuerys["editarPerfil1"], [name, avatar, id], (err, rows, fields) => {
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
      mysqlConnection.query(listaQuerys["editarPerfil2"], [oldpass, id], (err, rows, fields) => {
        if (!err) {
          if (rows.length > 0) {
            mysqlConnection.query(listaQuerys["editarPerfil3"], [name, newpass, avatar, id], (err, rows, fields) => {
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
  compruebaLogros(permiso);
  if (permiso) {
    mysqlConnection.query(listaQuerys["isAdmin"], [permiso], (err, rows, fields) => {
      console.log(rows.length)
      if (!err) {
        let respuesta = false;
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
    mysqlConnection.query(listaQuerys["buscaLogros"], [id], (err, rows, fields) => {
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
    mysqlConnection.query(listaQuerys["getNotis"], [permiso], (err, rows, fields) => {
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
  if (permiso) {
    const { id } = req.params;
    mysqlConnection.query(listaQuerys["getUsuario"], [id], (err, rows, fields) => {
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
    mysqlConnection.query(listaQuerys["getUsuariosByNombre"], [nombre + "%"], (err, rows, fields) => {
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
  let query = ""
  if (permiso == id) {
    query = listaQuerys["getUsuarioWallPrivate"];
  } else {
    query = listaQuerys["getUsuarioWallPublic"];
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
  mysqlConnection.query(listaQuerys["getSeguidos1"], [id], (err, rows, fields) => {
    total = rows[0].pls;
    mysqlConnection.query(listaQuerys["getSeguidos2"]+limite, [id], (err, rows, fields) => {
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
//Obtener los quizzes de la web (UNPROTECTED)
router.get('/quizz/todos/:cadena', (req, res) => {
  console.log("Obtener quizz de todos")
  const { cadena } = req.params;
  let limite = cadena.split("-");
  limite = "LIMIT " + limite[0] + "," + limite[1];
  let total = 0;
  mysqlConnection.query(listaQuerys["getAllQuizzes1"], null, (err, rows, fields) => {
    total = rows[0].pls;
    mysqlConnection.query(listaQuerys["getAllQuizzes2"]+limite, null, (err, rows, fields) => {
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
  mysqlConnection.query(listaQuerys["getQuizzesByName"], ['%' + nombre + "%"], (err, rows, fields) => {
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
  mysqlConnection.query(listaQuerys["getQuizzesaModerar"], [id, id], (err, rows, fields) => {
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
    mysqlConnection.query(listaQuerys["setModerar1"], [quizz], (err, rows, fields) => {
      if (!err) {
        creador = rows[0].creador;
        titulo = rows[0].titulo;
        mysqlConnection.query(listaQuerys["setModerar2"], [permiso], (err, rows, fields) => {
          if (!err) {
            if (rows.length > 0) {
              //PUBLICO
              //TRUE
              if (decision) {
                mysqlConnection.query(listaQuerys["setModerar3"], [quizz], (err, rows, fields) => {
                  if (!err) {
                    mysqlConnection.query(listaQuerys["setModerar4"], [quizz], (err, rows, fields) => {
                      if (!err) {
                        if (!err) {
                          let mensajito = "¡Enhorabuena, su Quiz " + titulo + " ha sido publicado en la web!";
                          mysqlConnection.query(listaQuerys["setModerar5"], [creador, mensajito], (err, rows, fields) => {
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
                mysqlConnection.query(listaQuerys["setModerar4"], [quizz], (err, rows, fields) => {
                  if (!err) {
                    mysqlConnection.query(listaQuerys["setModerar6"], [quizz], (err, rows, fields) => {
                      if (!err) {
                        let mensajito = "Lo sentimos, su Quiz " + titulo + " no ha superado el proceso de moderación, revisa los criterios e intentalo de nuevo.";
                        mysqlConnection.query(listaQuerys["setModerar7"], [creador, mensajito], (err, rows, fields) => {
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
              mysqlConnection.query(listaQuerys["setModerar8"], [quizz, usuario, decision], (err, rows, fields) => {
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
    query = listaQuerys["getOneQuizz1"];
  } else {
    query = listaQuerys["getOneQuizz2"];
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
  mysqlConnection.query(listaQuerys["getCantidadQuizzes"], [id], (err, rows, fields) => {
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
  mysqlConnection.query(listaQuerys["getCantidadVotos"], [id, id], (err, rows, fields) => {
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
  let resultados = [0, 0, 0, 0];
  const { origen, destino } = req.body;
  console.log("Obtener estadisticas de un perfil")
  mysqlConnection.query(listaQuerys["getEstadisticas1"], [origen, destino, origen, destino], (err, rows, fields) => {
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

  mysqlConnection.query(listaQuerys["getEstadisticas2"], [destino], (err, rows, fields) => {
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
  mysqlConnection.query(listaQuerys["getEstadisticas3"], [destino], (err, rows, fields) => {
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
  mysqlConnection.query(listaQuerys["getEstadisticas4"], [destino], (err, rows, fields) => {
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
  mysqlConnection.query(listaQuerys["setQuiz"], [creador, titulo, contenido, fecha, privado], (err, rows, fields) => {
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
    const { quizz } = req.body;
    mysqlConnection.query(listaQuerys["deleteQuiz"], [quizz, permiso], (err, rows, fields) => {
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
    mysqlConnection.query(listaQuerys["setVotacion1"], [origen, quizz], (err, rows, fields) => {
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
      mysqlConnection.query(listaQuerys["setVotacion2"], [origen, quizz, cantidad], (err, rows, fields) => {
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
      mysqlConnection.query(listaQuerys["setVotacion3"], [cantidad, origen, quizz], (err, rows, fields) => {
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
  const { origen, destino } = req.body;
  mysqlConnection.query(listaQuerys["isFollowing"], [origen, destino], (err, rows, fields) => {
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
      mysqlConnection.query(listaQuerys["setFollow"], [origen, destino], (err, rows, fields) => {
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
    mysqlConnection.query(listaQuerys["readNoti"], [permiso, mensaje], (err, rows, fields) => {
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
  let permiso = verificaToken(req.headers);
  if (permiso != false) {
    const { quizz, privado } = req.body;
    if (privado == null) {
      mysqlConnection.query(listaQuerys["setPrivacidad1"], [quizz], (err, rows, fields) => {
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
      mysqlConnection.query(listaQuerys["setPrivacidad2"], [privado, quizz], (err, rows, fields) => {
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
      mysqlConnection.query(listaQuerys["deleteFollow"], [origen, destino], (err, rows, fields) => {
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
