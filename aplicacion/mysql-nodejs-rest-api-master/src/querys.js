let querys = [];
querys["busca_logros"] = "SELECT L.*,(SELECT fecha from logros_obtenidos where usuario= ? and logro = L.id) as fecha from logros L";
querys["check_logro1"] = "SELECT count(*) as total from quizz where creador = ? and publicado = 1 having total>5";
module.exports=querys;