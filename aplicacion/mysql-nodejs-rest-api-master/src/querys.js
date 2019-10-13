let querys = [];

//Querys de logros
//Logros implementados automatizados: (USUARIOS: 2,6,8) (QUIZZES: 3) (UNICO: 1) (INCR+: 4,5,7,9)
querys["buscaLogro"] = "SELECT usuario FROM logros_obtenidos where usuario = ? and logro = ?";
querys["buscaLogroProceso"] = "SELECT usuario FROM logros_proceso where usuario = ? and logro = ?";
querys["buscaLogros"] = "SELECT L.*,(SELECT fecha FROM logros_obtenidos where usuario= ? and logro = L.id) as fecha FROM logros L";
querys["checkLogrosByUser"] = "SELECT (SELECT DISTINCT Q.creador FROM quizz Q where Q.publicado=1 and Q.creador = ?) as logro0, (SELECT Q.creador FROM quizz Q where creador = ?  group by Q.creador having COUNT(*) >=5) as logro1, (SELECT F.destino FROM follows F where destino = ? having count(*) >= 5) as logro2, (SELECT v.origen FROM votaciones v where v.origen = ? having count(v.origen)>29) as logro3 FROM dual"
querys["checkLogrosByQuiz"] = "SELECT (SELECT U.id FROM users U where U.id in (SELECT Q.creador FROM quizz Q where Q.id in (SELECT V.quizz FROM votaciones V where V.quizz = ? having count(*) > 10 ) )) as logro1" //Logro 3
querys["checkLogrosByIncr"] = "SELECT (SELECT LP.usuario as usuario FROM logros_proceso LP where LP.logro = 4 AND LP.cantidad1>14 AND LP.cantidad2>14 AND LP.usuario = ?) as logro1, (SELECT LP.usuario as usuario FROM logros_proceso LP where LP.logro = 5 AND LP.cantidad1>29 AND LP.usuario = ?) as logro2, (SELECT LP.usuario as usuario FROM logros_proceso LP where LP.logro = 7 AND LP.cantidad1>99 AND LP.usuario = ?) as logro3, (SELECT LP.usuario as usuario FROM logros_proceso LP where LP.logro = 9 AND LP.cantidad1>29 AND LP.usuario = ?) as logro4 FROM dual"


querys["setLogroProceso"] = "INSERT INTO logros_proceso (usuario,logro,cantidad1,cantidad2) values(?,?,?,?)";
querys["updateLogroProceso"] = "UPDATE logros_proceso set cantidad1 = cantidad1 + ? , cantidad2 = cantidad2 + ? WHERE usuario = ? AND logro = ?";


querys["insertLogro"] = "INSERT INTO logros_obtenidos (usuario,logro) values (?,?) ";

//Querys de usuarios
querys["registro"] = "INSERT INTO users (name,nickname,email,password,confirmado) VALUES(?,?,?,?,?)";
querys["login"] = "SELECT id,name,nickname,avatar,confirmado FROM users where email = ? AND password = ?";
querys["confirmaEmail"] = "SELECT id,nickname,name,avatar from users where confirmado = ?";
querys["confirmaEmail2"] = "UPDATE users set confirmado = 1 where id =?";
querys["setRecuperacion"] = "UPDATE users set recuperacion = ? where email = ?";
querys["endRecuperacion"] = "UPDATE users set password = ?, recuperacion = NULL where recuperacion = ?";
querys["editarPerfil1"] = "UPDATE users set name = ?, nickname = ?, avatar = ? WHERE id = ?";
querys["editarPerfil2"] = "SELECT password FROM users where password = ? AND id = ?";
querys["editarPerfil3"] = "UPDATE users set name = ? , password = ?, avatar = ? WHERE id = ?";
querys["isAdmin"] = "SELECT id FROM users WHERE id = ? and admin is not null";
querys["getNotis"] = "SELECT mensaje FROM notificaciones WHERE usuario = ? and leido is null";
querys["readNoti"] = "UPDATE notificaciones set leido = 1 where usuario = ? AND mensaje = ?";
querys["getUsuario"] = "SELECT id,nickname,name,avatar FROM users WHERE nickname = ?";
querys["getUsuarioById"] = "SELECT id,nickname,name,avatar FROM users WHERE id = ?";

querys["getUsuariosByNombre"] = "SELECT nickname FROM users WHERE nickname LIKE ? order by nickname";
querys["getUsuarioWallPrivate"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id FROM quizz where privado = q.id)) as votantes FROM quizz q left JOIN votaciones v on q.id=v.quizz WHERE creador = ? GROUP BY q.id order by fechacreacion DESC";
querys["getUsuarioWallPublic"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id FROM quizz where privado = q.id)) as votantes,u.nickname as nickname  FROM quizz q left JOIN votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id  WHERE creador = ? AND publicado = 1 AND privado is null GROUP BY q.id order by fechacreacion DESC";
querys["isFollowing"] = "SELECT destino FROM follows where origen = ? AND destino = ?";
querys["setFollow"] = "INSERT INTO follows values(?,?)";
querys["deleteFollow"] = "DELETE FROM follows where origen = ? AND destino = ?";

querys["getReport"] = "SELECT * FROM reportes where origen = ? AND destino = ? AND motivo = ?";
querys["setReport"] = "INSERT INTO reportes (origen,destino,motivo) values (?,?,?)";

querys["checkNickname"] = "SELECT * from users where nickname = ?";
//Querys social login
querys["checkSocialUser"] = "SELECT * FROM users where idSocial = ? AND email = ?";
querys["setSocialUser"] = "INSERT INTO users (nickname,name,email,origen,idSocial) values(?,?,?,?,?)";
querys["loginSocialUser"] = "SELECT id,nickname,name,avatar from users where email = ? AND idSocial = ?";
//Querys de quizzes
querys["getOneQuizz1"] = "SELECT * FROM quizz WHERE id = ?";
querys["getOneQuizz2"] = "SELECT * FROM quizz where privado = ?";
querys["getAllQuizzes1"] = "SELECT count(id) as pls FROM quizz where publicado = 1 and privado IS NULL";
querys["getAllQuizzes2"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas, (SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id FROM quizz where privado = q.id)) as votantes ,u.nickname as nickname FROM quizz q LEFT JOIN votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id where publicado = 1 and privado is null GROUP BY q.id DESC ";
querys["getCantidadQuizzes"] = "SELECT count(id) as c FROM quizz WHERE creador = ? and publicado = 1";
querys["getSeguidos1"] = "SELECT count(id) as pls FROM quizz where publicado=1 and privado is null and  creador in ( SELECT destino FROM follows where origen = ? ) ";
querys["getSeguidos2"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id FROM quizz where privado = q.id)) as votantes,u.nickname as nickname FROM quizz q left JOIN votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id WHERE creador in ( SELECT destino FROM follows where origen = ? ) AND publicado = 1 AND privado IS NULL GROUP BY q.id order by fechacreacion DESC ";
querys["getQuizzesByName"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas,(SELECT count(quizz) FROM votaciones WHERE quizz = q.id OR quizz in(SELECT id FROM quizz where privado = q.id)) as votantes,u.nickname as nickname FROM quizz q left join votaciones v on q.id=v.quizz LEFT JOIN users u on q.creador= u.id WHERE LOWER(q.titulo) LIKE LOWER(?) AND q.publicado=1 AND privado IS NULL GROUP BY q.id order by q.titulo";
querys["getQuizzesaModerar"] = "SELECT q.*,COALESCE(SUM(v.cantidad),0) as estrellas FROM quizz q left join votaciones v on q.id=v.quizz where publicado = 0 AND privado is null AND creador != ? AND id not in (select quizz FROM moderacion where usuario = ? ) group by q.id";

querys["setModerar1"] = "SELECT creador,titulo FROM quizz where id = ?";
querys["setModerar2"] = "SELECT id FROM users WHERE id = ? and admin is not null";
querys["setModerar3"] = "UPDATE quizz set publicado = 1 where id = ?";
querys["setModerar4"] = "DELETE FROM moderacion WHERE quizz = ?";
querys["setModerar5"] = "INSERT INTO notificaciones (usuario,mensaje) values(?,?)";
//querys["setModerar6"] = "DELETE FROM quizz where id = ?";
querys["setModerar7"] = "INSERT INTO notificaciones (usuario,mensaje) values(?,?)";
querys["setModerar8"] = "INSERT INTO moderacion (quizz,usuario,decision) VALUES(?,?,?)";

querys["setQuiz"] = "INSERT INTO quizz (creador,titulo,contenido,fechacreacion,publicado,privado,banner) VALUES(?,?,?,?,0,?,?)";
querys["deleteQuiz"] = "DELETE FROM quizz WHERE id = ? AND creador = ?";
querys["deleteQuizByAdmin"] = "DELETE FROM quizz WHERE id = ? AND 40 = ?";
querys["setPrivacidad1"] = "UPDATE quizz set privado = null where id = ?";
querys["setPrivacidad2"] = "UPDATE quizz set privado = ? where id = ?";

//Querys de votación
querys["getCantidadVotos"] = "SELECT count(quizz) as m FROM votaciones WHERE quizz = ? OR quizz in(SELECT id FROM quizz where privado = ?)";
querys["setVotacion1"] = "SELECT * FROM votaciones where origen = ? and quizz = ?";
querys["setVotacion2"] = "INSERT INTO votaciones (origen,quizz,cantidad) VALUES(?,?,?)";
querys["setVotacion3"] = "UPDATE votaciones set cantidad = ? where origen= ? AND quizz = ?";

//Querys de estadisticas
querys["getEstadisticas"] = "SELECT (SELECT count(*) FROM follows WHERE origen = ? and destino = ? AND destino IN (SELECT destino FROM follows WHERE destino = ? and origen = ?) ) as mutual,  (SELECT count(destino) FROM follows WHERE destino = ?) as seguidores, (SELECT count(origen) FROM follows WHERE origen = ?) as seguidos,(SELECT count(*) FROM logros_obtenidos WHERE usuario = ?) as logros,(SELECT count(id) FROM quizz WHERE creador = ? AND publicado = 1 AND privado IS NULL) as cantidad FROM dual;"

module.exports = querys;