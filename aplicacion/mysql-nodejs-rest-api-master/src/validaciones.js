const { check } = require('express-validator');
let validaciones = [];

//Validaciones usuario
validaciones["registro"] = [
    check('email').isEmail(),
    check('email').isLength({ max: 50 }),
    check('name').isLength({ min: 4 }),
    check('name').isLength({ max: 20 }),
    check('password').isLength({ min: 6 }),
    check('password').isLength({ max: 30 }),
    check('confirm').trim()
];
validaciones["login"] = [
    check('email').isEmail(),
    check('email').isLength({ max: 50 }),
    check('password').isLength({ min: 6 }),
    check('password').isLength({ max: 30 })
];
validaciones["editar"] = [
    check('name').isLength({ min: 4 }),
    check('name').isLength({ max: 20 }),
];
validaciones["creaQuiz"] = [
    check('titulo').isLength({ min: 10 }),
    check('titulo').isLength({ max: 75 }),
    check('creador').isNumeric(),
    check('contenido').isLength({ max: 20000 })
];
validaciones["reporte"] = [
    check('destino').isNumeric(),
    check('motivo').isLength({ min: 4 }),
    check('motivo').isLength({ max: 7 }),
];
validaciones["numerico"] = [
    check('id').isNumeric()
];
validaciones["texto"] = [
    check("nombre").isString(),
    check("nombre").trim(),
    check("nombre").isLength({max:20})
]
validaciones["modera"] = [
    check("quizz").isNumeric(),
    check("usuario").isNumeric()
]
validaciones["vota"] = [
    check("quizz").isNumeric(),
    check("origen").isNumeric(),
    check("cantidad").isNumeric()
]
validaciones["stats"] = [ //isFollowing también
    check("origen").isNumeric(),
    check("destino").isNumeric()
]


module.exports = validaciones;