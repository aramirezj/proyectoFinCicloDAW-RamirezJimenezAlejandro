const queryService = require('../controllers/queryController');
let secretWord = "a670711037";
var jwt = require('jsonwebtoken');
class TokenController {
    constructor() { }
    creaToken(id) {
        var token = jwt.sign({ id: id }, secretWord, {
            expiresIn: 86400 // expires in 24 hours
        });
        console.log(token)
        return token;
    }
    verificaToken(headers, res, verdad) {
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
                queryService.gestionaEnvioErrores(2, res);
                return false;
            }
        } else {
            console.log("Es un token invalido");
            queryService.gestionaEnvioErrores(2, res);
            return false;


        }
    }
}

const tokenService = new TokenController();
module.exports = tokenService;