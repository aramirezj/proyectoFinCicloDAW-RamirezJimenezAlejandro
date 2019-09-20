let querys = [];

//Querys de logros
//Logros implementados automatizados: (USUARIOS: 2,6,8) (QUIZZES: 3) (UNICO: 1) (INCR+: 4,5,7,9)
querys["buscaLogro"] = "SELECT usuario from logros_obtenidos where usuario = ? and logro = ?";
querys["buscaLogroProceso"] = "SELECT usuario from logros_proceso where usuario = ? and logro = ?";
querys["buscaLogros"] = "SELECT L.*,(SELECT fecha from logros_obtenidos where usuario= ? and logro = L.id) as fecha from logros L";
//SELECT v.origen from votaciones v where v.origen = ? having count(v.origen)>29 ;
querys["checkLogrosByUser"] = "SELECT (SELECT DISTINCT Q.creador from quizz Q where Q.publicado=1 and Q.creador = ?) as logro0, (SELECT Q.creador from quizz Q where creador = ?  group by Q.creador having COUNT(*) >=5) as logro1, (SELECT F.destino from follows F where destino = ? having count(*) >= 5) as logro2, (SELECT v.origen from votaciones v where v.origen = ? having count(v.origen)>29) as logro3 from dual"
querys["checkLogrosByQuiz"] = "SELECT (SELECT U.id from users U where U.id in (SELECT Q.creador from quizz Q where Q.id in (SELECT V.quizz from votaciones V where V.quizz = ? having count(*) > 10 ) )) as logro1" //Logro 3
querys["checkLogrosByIncr"] = "SELECT (SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 4 AND LP.cantidad1>14 AND LP.cantidad2>14 AND LP.usuario = ?) as logro1, (SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 5 AND LP.cantidad1>29 AND LP.usuario = ?) as logro2, (SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 7 AND LP.cantidad1>99 AND LP.usuario = ?) as logro3, (SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 9 AND LP.cantidad1>29 AND LP.usuario = ?) as logro4 from dual"


querys["setLogroProceso"] = "INSERT INTO logros_proceso (usuario,logro,cantidad1,cantidad2) values(?,?,?,?)";
querys["updateLogroProceso"] = "UPDATE logros_proceso set cantidad1 = cantidad1 + ? , cantidad2 = cantidad2 + ? WHERE usuario = ? AND logro = ?";

/*
querys["checkLogro1"] = "SELECT count(*) as total from quizz where creador = ? and publicado = 1 having total>5";
querys["checkLogro2"] = "SELECT count(*) as total from follows where destino = ? having total>10";
querys["checkLogro3"] = "SELECT max(counted) FROM (SELECT count(*) as counted from votaciones where quizz in (SELECT id as elid from quizz where creador = ?) group by quizz having counted > 10 ) as counts";
querys["checkLogro4"] = "SELECT moderacion.usuario from moderacion where moderacion.quizz = ?";
querys["checkLogro4"] = "SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 4 AND LP.cantidad1>14 AND LP.cantidad2>14 AND LP.usuario = ?"
querys["checkLogro5"] = "SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 5 AND LP.cantidad1>29 AND LP.usuario = ?"
querys["checkLogro7"] = "SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 7 AND LP.cantidad1>99 AND LP.usuario = ?"
querys["checkLogro9"] = "SELECT LP.usuario as usuario from logros_proceso LP where LP.logro = 9 AND LP.cantidad1>29 AND LP.usuario = ?"
*/

querys["insertLogro"] = "INSERT INTO logros_obtenidos (usuario,logro) values (?,?) ";

//Querys de usuarios
querys["registro"] = "INSERT INTO users (name,email,password) VALUES(?,?,?)";
querys["login"] = "SELECT id,name,email,avatar from users where email = ? AND password = ?";
querys["editarPerfil1"] = "UPDATE users set name = ?, avatar = ? WHERE id = ?";
querys["editarPerfil2"] = "SELECT password from users where password = ? AND id = ?";
querys["editarPerfil3"] = "UPDATE users set name = ? , password = ?, avatar = ? WHERE id = ?";
querys["isAdmin"] = "SELECT id FROM users WHERE id = ? and admin is not null";
querys["getNotis"] = "SELECT mensaje FROM notificaciones WHERE usuario = ? and leido is null";
querys["readNoti"] = "UPDATE notificaciones set leido = 1 where usuario = ? AND mensaje = ?";
querys["getUsuario"] = "SELECT id,name,avatar FROM users WHERE id = ?";
querys["getUsuariosByNombre"] = "SELECT id,name FROM users WHERE name LIKE ? order by name";
querys["getUsuarioWallPrivate"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id from quizz where privado = q.id)) as votantes FROM quizz q left JOIN votaciones v on q.id=v.quizz WHERE creador = ? GROUP BY q.id order by fechacreacion DESC";
querys["getUsuarioWallPublic"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id from quizz where privado = q.id)) as votantes,u.name as nombre  FROM quizz q left JOIN votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id  WHERE creador = ? AND publicado = 1 AND privado is null GROUP BY q.id order by fechacreacion DESC";
querys["isFollowing"] = "SELECT destino FROM follows where origen = ? AND destino = ?";
querys["setFollow"] = "INSERT INTO follows values(?,?)";
querys["deleteFollow"] = "DELETE from follows where origen = ? AND destino = ?";

querys["getReport"] = "SELECT * FROM reportes where origen = ? AND destino = ? AND motivo = ?";
querys["setReport"] = "INSERT INTO reportes (origen,destino,motivo) values (?,?,?)";


//Querys de quizzes
querys["getOneQuizz1"] = "SELECT * FROM quizz WHERE id = ?";
querys["getOneQuizz2"] = "SELECT * FROM quizz where privado = ?";
querys["getAllQuizzes1"] = "SELECT count(id) as pls from quizz where publicado=1 and privado IS NULL";
querys["getAllQuizzes2"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas, (SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id from quizz where privado = q.id)) as votantes ,u.name as nombre FROM quizz q LEFT JOIN votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id where publicado = 1 and privado is null GROUP BY q.id DESC ";
querys["getCantidadQuizzes"] = "SELECT count(id) as c FROM quizz WHERE creador = ? and publicado = 1";
querys["getSeguidos1"] = "SELECT count(id) as pls from quizz where publicado=1 and privado is null and  creador in ( SELECT destino from follows where origen = ? ) ";
querys["getSeguidos2"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id from quizz where privado = q.id)) as votantes,u.name as nombre FROM quizz q left JOIN votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id WHERE creador in ( SELECT destino from follows where origen = ? ) AND publicado = 1 AND privado IS NULL GROUP BY q.id order by fechacreacion DESC ";
querys["getQuizzesByName"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id from quizz where privado = q.id)) as votantes,u.name as nombre FROM quizz q left join votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id WHERE LOWER(q.titulo) LIKE LOWER(?) AND q.publicado=1 AND privado IS NULL GROUP BY q.id order by q.titulo";
querys["getQuizzesaModerar"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q left join votaciones v on q.id=v.quizz where publicado = 0 AND privado is null AND creador != ? AND id not in (select quizz from moderacion where usuario = ? ) group by q.id";

querys["setModerar1"] = "SELECT creador,titulo from quizz where id = ?";
querys["setModerar2"] = "SELECT id FROM users WHERE id = ? and admin is not null";
querys["setModerar3"] = "UPDATE quizz set publicado = 1 where id = ?";
querys["setModerar4"] = "DELETE FROM moderacion WHERE quizz = ?";
querys["setModerar5"] = "INSERT INTO notificaciones (usuario,mensaje) values(?,?)";
querys["setModerar6"] = "DELETE FROM quizz where id = ?";
querys["setModerar7"] = "INSERT INTO notificaciones (usuario,mensaje) values(?,?)";
querys["setModerar8"] = "INSERT INTO moderacion (quizz,usuario,decision) VALUES(?,?,?)";

querys["setQuiz"] = "INSERT INTO quizz (creador,titulo,contenido,fechacreacion,publicado,privado) VALUES(?,?,?,?,0,?)";
querys["deleteQuiz"] = "DELETE FROM quizz WHERE id = ? AND creador = ?";
querys["setPrivacidad1"] = "UPDATE quizz set privado = null where id = ?";
querys["setPrivacidad2"] = "UPDATE quizz set privado = ? where id = ?";

//Querys de votación
querys["getCantidadVotos"] = "SELECT count(quizz) as m FROM votaciones WHERE quizz = ? OR quizz in(SELECT id from quizz where privado = ?)";
querys["setVotacion1"] = "SELECT * from votaciones where origen = ? and quizz = ?";
querys["setVotacion2"] = "INSERT INTO votaciones (origen,quizz,cantidad) VALUES(?,?,?)";
querys["setVotacion3"] = "UPDATE votaciones set cantidad = ? where origen= ? AND quizz = ?";

//Querys de estadisticas
querys["getEstadisticas"] = "SELECT (SELECT count(*) FROM follows WHERE origen = ? and destino = ? AND destino IN (SELECT destino from follows WHERE destino = ? and origen = ?) ) as mutual,  (SELECT count(destino) FROM follows WHERE destino = ?) as seguidores, (SELECT count(origen) FROM follows WHERE origen = ?) as seguidos,(SELECT count(*) FROM logros_obtenidos WHERE usuario = ?) as logros,(SELECT count(id) FROM quizz WHERE creador = ? and publicado = 1) as cantidad FROM dual;"

module.exports = querys;