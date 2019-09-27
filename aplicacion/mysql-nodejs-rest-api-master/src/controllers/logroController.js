const queryService = require('../controllers/queryController');

/*
Doc de implementación de Logros
(USUARIOS: 2,6,8,9) (QUIZZES: 3) (UNICO: 1) (INCR+: 4,5,7,)

Logro 1 (Nuevo outfit) : /api/usuario/actualizar/:id
Logro 2 (Influencer de tu casa) : /api/follow
Logro 3 (Artista) : /api/vota
Logro 4 (Kami) : /api/modera
Logro 5 (Pregonero) PENDIENTE
Logro 6 (Un maquina) /api/creaQuizz
Logro 7 (Juez)  : /api/modera
Logro 8 (Diana) : /api/modera
Logro 9 (Crítico) : /api/vota
*/

class LogroController {
    constructor() { }
    logroAvatar(id, avatar, oldAvatar, res) {
        queryService.ejecutaConsulta("buscaLogro", [id, 1], res,
            function (rows) {
                if (rows) {
                    if (rows.length == 0) {
                        if (oldAvatar != avatar) {
                            queryService.ejecutaConsulta("insertLogro", [id, 1], res,
                                function (rows) { console.log("Logro insertado") });
                        }
                    }
                }
            });
    }
    logroIncremento(id, res) {
        const logrosTipoIncr = [4, 5, 7];
        queryService.ejecutaConsulta("checkLogrosByIncr", [id, id, id, id], res,
            function (rows) {
                if (rows) {
                    for (let i = 0; i < logrosTipoIncr.length; i++) {
                        if (rows[0]["logro" + i] != null) {
                            queryService.ejecutaConsulta("buscaLogro", [id, logrosTipoIncr[i]], res,
                                function (rows2) {
                                    if (rows2) {
                                        if (rows2.length == 0) {
                                            queryService.ejecutaConsulta("insertLogro", [id, logrosTipoIncr[i]], res,
                                                function (rows) { console.log("Logro insertado") });
                                        }
                                    }
                                });
                        }
                    }
                };
            });
    }

    logroUsuarios(id, res) {
        const logrosTipoUsuarios = [8, 6, 2, 9];
        queryService.ejecutaConsulta("checkLogrosByUser", [id, id, id, id], res,
            function (rows) {
                if (rows) {
                    for (let i = 0; i < logrosTipoUsuarios.length; i++) {
                        if (rows[0]["logro" + i] != null) {
                            queryService.ejecutaConsulta("buscaLogro", [id, logrosTipoUsuarios[i]], res,
                                function (rows2) {
                                    if (rows2) {
                                        if (rows2.length == 0) {
                                            queryService.ejecutaConsulta("insertLogro", [id, logrosTipoUsuarios[i]], res,
                                                function (rows2) { console.log("Logro insertado") });
                                        }
                                    }
                                });
                        }
                    }
                };
            });
    }

    logroQuizzes(id, res) {
        const logrosTipoQuizzes = [3];
        queryService.ejecutaConsulta("checkLogrosByQuiz", [id, id, id], res,
            function (rows) {
                if (rows) {
                    for (let i = 0; i < logrosTipoQuizzes.length; i++) {
                        if (rows[0]["logro" + i] != null) {
                            queryService.ejecutaConsulta("buscaLogro", [id, logrosTipoQuizzes[i]], res,
                                function (rows2) {
                                    if (rows2) {
                                        if (rows2.length == 0) {
                                            queryService.ejecutaConsulta("insertLogro", [id, logrosTipoQuizzes[i]], res,
                                                function (rows) { console.log("Logro insertado") });
                                        }
                                    }
                                });
                        }
                    }
                };
            });
    }

    incrementaLogro(usuario, logro, cantidad1, cantidad2, res) {
        queryService.ejecutaConsulta("buscaLogroProceso", [usuario, logro], res,
            function (rows) {
                if (rows) {
                    if (rows.length == 0) {
                        queryService.ejecutaConsulta("setLogroProceso", [usuario, logro, cantidad1, cantidad2], res,
                            function (rows) {
                                if (rows) {
                                    console.log("LogroProcesoInsertado")
                                };
                            });
                    } else {
                        queryService.ejecutaConsulta("updateLogroProceso", [cantidad1, cantidad2, usuario, logro], res,
                            function (rows) {
                                if (rows) {
                                    console.log("LogroProcesoActualizado")
                                };
                            });
                    }
                };
            });
        this.logroIncremento(usuario, res);
    }
}

const logroService = new LogroController();
module.exports = logroService;