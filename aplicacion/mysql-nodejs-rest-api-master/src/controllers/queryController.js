const mysqlConnection = require('../database.js');
const listaQuerys = require('../querys');
const { validationResult } = require('express-validator');
var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        //label({ label: 'right meow!' }),
        timestamp(),
        prettyPrint()
    ),
    defaultMeta: { Componente: 'Query Controller' },
    transports: [
        new winston.transports.File({ filename: 'logs/errores.log', level: 'error' }),
    ]
});

class QueryController {
    constructor() { }
    ejecutaConsulta(query, valores, res, callback, limite) {
        let queryElegida = limite == undefined ? listaQuerys[query] : listaQuerys[query] + limite;
        mysqlConnection.query(queryElegida, valores, (err, rows, fields) => {
            if (!err) {
                return callback(rows);
            } else {
                logger.log({
                    level: 'error',
                    message: err
                });
                if (err.code == 'ER_DUP_ENTRY') {
                    this.gestionaEnvioErrores(3, res);
                } else {
                    console.log(err)
                    this.gestionaEnvioErrores(1, res);
                }
                return callback(false);
            }
        });
    }
    gestionaEnvioErrores(opcion, res, errores) {
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
    compruebaErrores(req, res) {
        const errores = validationResult(req);
        if (errores.isEmpty()) {
            return false;
        } else {
            this.gestionaEnvioErrores(5, res, errores);
            return true;
        }
    }
}

const queryService = new QueryController();
module.exports = queryService;