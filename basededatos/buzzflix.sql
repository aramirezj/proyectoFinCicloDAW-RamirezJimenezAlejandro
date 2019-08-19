-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-08-2019 a las 14:51:58
-- Versión del servidor: 10.1.39-MariaDB
-- Versión de PHP: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `buzzflix`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `follows`
--

CREATE TABLE `follows` (
  `origen` int(11) NOT NULL,
  `destino` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `follows`
--

INSERT INTO `follows` (`origen`, `destino`) VALUES
(18, 19),
(18, 20),
(18, 36),
(18, 40),
(19, 18),
(19, 21),
(19, 25),
(19, 27),
(20, 18),
(32, 18),
(32, 19),
(34, 19),
(37, 19),
(37, 27),
(40, 18);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logros`
--

CREATE TABLE `logros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `logros`
--

INSERT INTO `logros` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Un maquina pisha', 'Realiza 5 quizzes.'),
(2, 'Influencer', 'Consigue que te sigan 5 personas'),
(3, 'Artista', 'Ten un Quiz que ha sido puntuado mas de 10 veces');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logros_obtenidos`
--

CREATE TABLE `logros_obtenidos` (
  `id` int(11) NOT NULL,
  `usuario` int(11) NOT NULL,
  `logro` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `logros_obtenidos`
--

INSERT INTO `logros_obtenidos` (`id`, `usuario`, `logro`, `fecha`) VALUES
(1, 40, 1, '2019-08-19 14:22:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `moderacion`
--

CREATE TABLE `moderacion` (
  `quizz` int(50) NOT NULL,
  `usuario` int(11) NOT NULL,
  `decision` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario` int(50) NOT NULL,
  `mensaje` varchar(1000) NOT NULL,
  `leido` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `usuario`, `mensaje`, `leido`) VALUES
(1, 19, 'Lo sentimos, su Quiz Amoderar2 no ha superado el proceso de moderación, revisa los criterios e intentalo de nuevo.', 1),
(2, 20, 'Lo sentimos, su Quiz Amoderar1 no ha superado el proceso de moderación, revisa los criterios e intentalo de nuevo.', NULL),
(3, 20, '¡Enhorabuena, su Quiz PRIV YES ha sido publicado en la web!', NULL),
(4, 40, 'Lo sentimos, su Quiz PRIV YES no ha superado el proceso de moderación, revisa los criterios e intentalo de nuevo.', 1),
(5, 40, '¡Enhorabuena, su Quiz ¿Tienes Lo Que Hay Que Tener Para Sobrevivir A Un Apocalipsis Zombie? ha sido publicado en la web!', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `quizz`
--

CREATE TABLE `quizz` (
  `id` int(50) NOT NULL,
  `creador` int(50) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `contenido` varchar(20000) DEFAULT NULL,
  `fechacreacion` date NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0',
  `privado` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `quizz`
--

INSERT INTO `quizz` (`id`, `creador`, `titulo`, `contenido`, `fechacreacion`, `publicado`, `privado`) VALUES
(33, 18, '¿Qué Pokemon inicial eres? (1ª Gen)', '{\"id\":null,\"creador\":18,\"titulo\":\"¿Qué Pokemon inicial eres?(1ª Gen)\",\"image\":\"s1pe0ah16c.jpg\",\"soluciones\":[{\"id\":1,\"titulo\":\"Squirtle\",\"descripcion\":\"Estas lleno de orgullo, pero por que sabes que puedes, tienes coraje y ambición y pocas personas te superan\",\"image\":\"mhwd26mwthp.jpg\"},{\"id\":2,\"titulo\":\"Charmander\",\"descripcion\":\"Amigo de tus amigos, un tío legal, pasional y el motivo del dicho quien tiene un amigo tiene un tesoro\",\"image\":\"wiyanbsxyrk.jpg\"},{\"id\":3,\"titulo\":\"Bulbasaur\",\"descripcion\":\"Eres tranquilo, paciente, de los que piensan todo antes dos veces, aunque muy despistado e inocente\",\"image\":\"qcdg7u4onur.jpeg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"Hay una pelea en el patio, ¿Quién eres?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"El que está metido en el fregado, dándole su merecido a un payaso\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":3,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"El que mete mierda para que se den de hostias\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"3\"}]},{\"id\":3,\"enunciado\":\"El que busca a los profesores para que paren de hacer los tontos\",\"madre\":1,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"5\"}]},{\"id\":4,\"enunciado\":\"Al que van a zurrar, mala idea recordar a la profesora que había examen\",\"madre\":1,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"3\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"¿Eres más de...?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Libro\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Pelicula\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":3,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Para que ver otras historias cuando la mía es mejor\",\"madre\":2,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":2,\"cantidad\":0},{\"idr\":3,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"¿Qué valoras más en un amigo?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Su lealtad\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"2\"}]},{\"id\":2,\"enunciado\":\"Que me sea útil\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"1\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"1\"}]},{\"id\":3,\"enunciado\":\"Que me aprecie\",\"madre\":3,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"8\"}]},{\"id\":4,\"enunciado\":\"Que tenga piscina lol\",\"madre\":3,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":2,\"cantidad\":0},{\"idr\":4,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"¿Con qué Vengador te defines más?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Doctor Strange\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"6\"}]},{\"id\":2,\"enunciado\":\"Iron Man\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":\"4\"}]},{\"id\":3,\"enunciado\":\"Capitán América\",\"madre\":4,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":3,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"1\"}]},{\"id\":4,\"enunciado\":\"Thor\",\"madre\":4,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"2\"}]},{\"id\":5,\"enunciado\":\"Pantera negra\",\"madre\":4,\"afinidades\":[{\"idr\":5,\"ids\":1,\"cantidad\":\"2\"},{\"idr\":5,\"ids\":2,\"cantidad\":0},{\"idr\":5,\"ids\":3,\"cantidad\":\"8\"}]}],\"eleccion\":null},{\"id\":5,\"enunciado\":\"La tortilla...\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Con cebolla\",\"madre\":5,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Sin cebolla\",\"madre\":5,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-05-19T20:42:05.550Z\"}', '2019-05-19', 1, NULL),
(38, 19, 'ISWRONG?', '{\"id\":null,\"creador\":19,\"titulo\":\"ISWRONG?\",\"image\":\"9afi38pbbf.PNG\",\"soluciones\":[{\"id\":1,\"titulo\":\"SOL1\",\"descripcion\":\"EXP1\",\"image\":\"if0apoqxec.jpg\"},{\"id\":2,\"titulo\":\"SOL2\",\"descripcion\":\"EXP\",\"image\":\"0osgsgizydi.jpg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"P1\",\"respuestas\":[{\"id\":1,\"enunciado\":\"R1\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"R2\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"P2\",\"respuestas\":[{\"id\":1,\"enunciado\":\"R3\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"R4\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-06-05T15:49:01.234Z\"}', '2019-06-05', 0, NULL),
(39, 40, '¿Tienes lo que hay que tener para sobrevivir a un apocalipsis zombie?', '{\"id\":null,\"creador\":40,\"titulo\":\"¿Tienes lo que hay que tener para sobrevivir a un apocalipsis zombie?\",\"image\":\"keax1y47q8.jpg\",\"soluciones\":[{\"id\":1,\"titulo\":\"!Por supuesto que si!\",\"descripcion\":\"Sobrevivirias sin problemas, eres un estratega nato y sabrás desenvolverte llegado el momento.\",\"image\":\"rkxmjxlk32p.jpg\"},{\"id\":2,\"titulo\":\"Nope, que desastre\",\"descripcion\":\"La verdad es que luces pocas, para que nos vamos a engañar, mira el lado positivo, te van a reciclar.\",\"image\":\"xsa1zz7ws4n.jpg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"¿Viajarías solo?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Si\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"No\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"¿Cuántas personas tendrías en tu equipo de supervivencia?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"1\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"4\"}]},{\"id\":2,\"enunciado\":\"2\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"5\"}]},{\"id\":3,\"enunciado\":\"3\",\"madre\":2,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":3,\"ids\":2,\"cantidad\":0}]},{\"id\":4,\"enunciado\":\"4\",\"madre\":2,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"9\"},{\"idr\":4,\"ids\":2,\"cantidad\":0}]},{\"id\":5,\"enunciado\":\"5\",\"madre\":2,\"afinidades\":[{\"idr\":5,\"ids\":1,\"cantidad\":\"5\"},{\"idr\":5,\"ids\":2,\"cantidad\":\"5\"}]},{\"id\":6,\"enunciado\":\"6\",\"madre\":2,\"afinidades\":[{\"idr\":6,\"ids\":1,\"cantidad\":0},{\"idr\":6,\"ids\":2,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"Elige un arma\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Escopeta\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"2\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"6\"}]},{\"id\":2,\"enunciado\":\"Espada\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"7\"},{\"idr\":2,\"ids\":2,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Motosierra\",\"madre\":3,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":4,\"enunciado\":\"Arco\",\"madre\":3,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":4,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"¿Sacrificarías a alguien de tu equipo si eso asegura TU supervivencia?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Si\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"No\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":5,\"enunciado\":\"¿Prepararías un campamento o algún tipo de base?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Si\",\"madre\":5,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"No, seria más bien nómada\",\"madre\":5,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"9\"}]}],\"eleccion\":null},{\"id\":6,\"enunciado\":\"Elige un lugar para que sea tu escondite\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Una pequeña tienda\",\"madre\":6,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"6\"}]},{\"id\":2,\"enunciado\":\"Un hospital\",\"madre\":6,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":2,\"ids\":2,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Una casa\",\"madre\":6,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"8\"}]},{\"id\":4,\"enunciado\":\"Una gasolinera\",\"madre\":6,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":4,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-06-13T19:51:20.437Z\"}', '2019-06-13', 1, 'eiz8fol3k1m'),
(40, 40, '¿Cuál sería tu X-Men superpoder/mutación?', '{\"id\":null,\"creador\":40,\"titulo\":\"¿Cuál sería tu X-Men superpoder/mutación?\",\"image\":\"enmdhocfv1.jpg\",\"soluciones\":[{\"id\":1,\"titulo\":\"Inmortalidad\",\"descripcion\":\"Tienes el regalo de la inmortalidad, has estado en todos lados, con todo el mundo, y visto todo, Prefieres vivir en una aldea pequeña, tranquilo, rodeado de naturaleza. \",\"image\":\"y9aky0tne4.jpg\"},{\"id\":2,\"titulo\":\"Hipnosis\",\"descripcion\":\"El contacto visual contigo es muy peligroso porque puedes controlar la mente de los demás, puedes hacer lo que quieras con ellos con una simple mirada, así que asegurate de usar gafas de sol para protegerte a ti mismo y a los demás.\",\"image\":\"ar3iwq4kscm.jpg\"},{\"id\":3,\"titulo\":\"Ser una sombra\",\"descripcion\":\"Puedes convertirte en una sombra para ser completamente sigiloso, escabullirte en cada edificio, y espiar cada conversación. Tienes un gran potencial tanto para lo bueno como para lo malo.\",\"image\":\"19nbu6quqsf.jpg\"},{\"id\":4,\"titulo\":\"Cambiador de emociones\",\"descripcion\":\"Puedes sentir las emociones de los demás como si fueran tuyas, además, puedes jugar con ellas, tanto para hacerle comprender cosas, como para controlarles.\",\"image\":\"zvifl2qyewr.jpg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"¿En que lado estas?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Con los malos\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":4,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"Empecé con los malos, pero me acabe volviendo de los buenos\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":\"5\"},{\"idr\":2,\"ids\":4,\"cantidad\":\"7\"}]},{\"id\":3,\"enunciado\":\"Con los buenos\",\"madre\":1,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"8\"},{\"idr\":3,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":3,\"ids\":3,\"cantidad\":0},{\"idr\":3,\"ids\":4,\"cantidad\":\"5\"}]},{\"id\":4,\"enunciado\":\"Con los buenos, pero me volví malvado\",\"madre\":1,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"7\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":4,\"cantidad\":\"3\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"¿Cuando usas tu poder?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"No lo utilizo\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":3,\"cantidad\":0},{\"idr\":1,\"ids\":4,\"cantidad\":\"0\"}]},{\"id\":2,\"enunciado\":\"Todos los días\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":0},{\"idr\":2,\"ids\":4,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Cuando me es necesario\",\"madre\":2,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":0},{\"idr\":3,\"ids\":3,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":4,\"cantidad\":0}]},{\"id\":4,\"enunciado\":\"Lo uso en extraños, para experimentar con el\",\"madre\":2,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":0},{\"idr\":4,\"ids\":3,\"cantidad\":0},{\"idr\":4,\"ids\":4,\"cantidad\":\"8\"}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"¿Le contarías a la gente de tu alrededor sobre tu poder?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"No\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"0\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":1,\"ids\":3,\"cantidad\":0},{\"idr\":1,\"ids\":4,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Solo si fuera necesario\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"5\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":\"6\"},{\"idr\":2,\"ids\":4,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Solo a mi familia\",\"madre\":3,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"8\"},{\"idr\":3,\"ids\":2,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":3,\"cantidad\":0},{\"idr\":3,\"ids\":4,\"cantidad\":0}]},{\"id\":4,\"enunciado\":\"A todo el mundo\",\"madre\":3,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":2,\"cantidad\":\"5\"},{\"idr\":4,\"ids\":3,\"cantidad\":0},{\"idr\":4,\"ids\":4,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"¿Te pondrías un nombre de superheroe?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Si\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":4,\"cantidad\":\"6\"}]},{\"id\":2,\"enunciado\":\"No\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"7\"},{\"idr\":2,\"ids\":3,\"cantidad\":0},{\"idr\":2,\"ids\":4,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Solo si me lo eligieran mis amigos\",\"madre\":4,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"5\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":4,\"cantidad\":0}]},{\"id\":4,\"enunciado\":\"Quizás\",\"madre\":4,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"2\"},{\"idr\":4,\"ids\":2,\"cantidad\":0},{\"idr\":4,\"ids\":3,\"cantidad\":0},{\"idr\":4,\"ids\":4,\"cantidad\":\"5\"}]}],\"eleccion\":null},{\"id\":5,\"enunciado\":\"¿Te unirías a los X-Men?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Si\",\"madre\":5,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"0\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":4,\"cantidad\":\"8\"}]},{\"id\":2,\"enunciado\":\"No\",\"madre\":5,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":0},{\"idr\":2,\"ids\":4,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Sería un superhéroe por mi cuenta\",\"madre\":5,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"5\"},{\"idr\":3,\"ids\":2,\"cantidad\":0},{\"idr\":3,\"ids\":3,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":4,\"cantidad\":0}]},{\"id\":4,\"enunciado\":\"Quizás si me convencieran\",\"madre\":5,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"7\"},{\"idr\":4,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":4,\"ids\":3,\"cantidad\":0},{\"idr\":4,\"ids\":4,\"cantidad\":\"10\"}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-06-15T15:55:02.400Z\"}', '2019-06-15', 1, NULL),
(41, 40, '¿Eres mas Yzma o Kronk de \"El emperador y sus locuras?', '{\"id\":null,\"creador\":40,\"titulo\":\"¿Eres mas Yzma o Kronk de \\\"El emperador y sus locuras?\",\"image\":\"xy962ow91lg.png\",\"soluciones\":[{\"id\":1,\"titulo\":\"Yzma\",\"descripcion\":\"Estás decidido a conseguir lo que quieres. Harás cualquier cosa para asegurarte de que logras lo que te has propuesto\",\"image\":\"5ndft4b51w.jpg\"},{\"id\":2,\"titulo\":\"Kronk\",\"descripcion\":\" Tienes una personalidad amable y compasiva. Eres leal y harás cualquier cosa para proteger a las personas que te importan.\",\"image\":\"gnlshvdtgbn.jpg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"Escoge:\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Un sombrero nuevo\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Un paraguas \",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Un sillón masajeador\",\"madre\":1,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":2,\"cantidad\":0}]},{\"id\":4,\"enunciado\":\"Una sartén \",\"madre\":1,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":4,\"ids\":2,\"cantidad\":\"0\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"Escoge:\",\"respuestas\":[{\"id\":1,\"enunciado\":\"PC\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Mac\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"¿De qué color es la parte de arriba que llevas?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Rojo\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Naranja\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":3,\"enunciado\":\"Amarillo\",\"madre\":3,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":4,\"enunciado\":\"Verde\",\"madre\":3,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"3\"},{\"idr\":4,\"ids\":2,\"cantidad\":\"6\"}]},{\"id\":5,\"enunciado\":\"Azul\",\"madre\":3,\"afinidades\":[{\"idr\":5,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":5,\"ids\":2,\"cantidad\":0}]},{\"id\":6,\"enunciado\":\"Otro\",\"madre\":3,\"afinidades\":[{\"idr\":6,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":6,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"Elige:\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Perro\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"Gato\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":5,\"enunciado\":\"¿A qué hora te acostaste anoche?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"8 p.m.\",\"madre\":5,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"11 p.m.\",\"madre\":5,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"6\"}]},{\"id\":3,\"enunciado\":\"Ni idea\",\"madre\":5,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"10\"}]},{\"id\":4,\"enunciado\":\"1 .a.m o más tarde\",\"madre\":5,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-06-16T14:19:10.676Z\"}', '2019-06-16', 1, 'd6zxgbfd2mk');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(150) NOT NULL,
  `avatar` varchar(50) DEFAULT NULL,
  `admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `admin`) VALUES
(18, 'Manolo3', 'manolo3@gmail.com', 'manolo', NULL, NULL),
(19, 'Alejandro Ramírez', 'alejandro@gmail.com', 'alejandro', '5qc2rjtah9t.jpg', 1),
(20, 'eva', 'eva@gmail.com', 'evaeva', '', NULL),
(21, 'josemiii', 'josemi', 'josemi', NULL, NULL),
(22, 'pruebaa', 'pruebaa', 'pruebaa', NULL, NULL),
(25, 'josuejosue', 'josuejosue@gmail.com', 'josuejosue', NULL, NULL),
(27, 'dawdawd', 'dwadawdd@gmail.com', 'dwaddwa', NULL, NULL),
(28, 'tokene', 'tokene@gmail.com', 'tokene', NULL, NULL),
(29, 'tokene', 'tokene@gmail.com', 'tokene', NULL, NULL),
(30, 'testing1', 'testing1@gmail.com', 'testing1', NULL, NULL),
(31, 'registro@gmail.com', 'registro@gmail.com', 'registro', NULL, NULL),
(32, 'registro', 'registro@gmail.com', 'registro', NULL, NULL),
(33, 'pruebatoken3', '', 'pruebatoken', NULL, NULL),
(34, 'tony', 'tony@gmail.com', 'tony12', NULL, NULL),
(35, 'dawdawd', 'awdawda@dwad.com', 'dawdawd', NULL, NULL),
(36, 'dawdawd', 'awdawda@dwad.com', 'dawdawd', NULL, NULL),
(37, 'rindamere', 'rindamere@gmail.com', 'rindamere', '', NULL),
(38, 'unpro', 'chaval@gmail.com', '7001de3eb9a48a0d25ee09b889a922ac63e5b6717a37961ff1d72ea36cbd3699', NULL, NULL),
(39, 'noteolvides', 'noteolvides@gmail.com', '0dbb7629a74c8f47b10184fab7c96736b42f292c14fe632c2bc5746188b9db67', NULL, NULL),
(40, 'Exilonmhehexd', 'exilonmlol@gmail.com', '20b8bb20c0f2e2684a6e40e4147adf3f60fa8fbe53bbad75ed73a0c7e06606db', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votaciones`
--

CREATE TABLE `votaciones` (
  `origen` int(11) NOT NULL,
  `quizz` int(50) NOT NULL,
  `cantidad` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `votaciones`
--

INSERT INTO `votaciones` (`origen`, `quizz`, `cantidad`) VALUES
(19, 33, 4),
(20, 33, 3),
(40, 33, 4),
(20, 39, 3),
(40, 39, 5),
(40, 41, 4);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`origen`,`destino`),
  ADD KEY `fk_users_has_users_users2_idx` (`destino`),
  ADD KEY `fk_users_has_users_users1_idx` (`origen`);

--
-- Indices de la tabla `logros`
--
ALTER TABLE `logros`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `logros_obtenidos`
--
ALTER TABLE `logros_obtenidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_fk` (`usuario`),
  ADD KEY `logro_fk` (`logro`);

--
-- Indices de la tabla `moderacion`
--
ALTER TABLE `moderacion`
  ADD PRIMARY KEY (`quizz`,`usuario`),
  ADD KEY `fk_moderacion_users1_idx` (`usuario`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `quizz`
--
ALTER TABLE `quizz`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `votaciones`
--
ALTER TABLE `votaciones`
  ADD PRIMARY KEY (`quizz`,`origen`),
  ADD KEY `fk_votaciones_users1_idx` (`origen`),
  ADD KEY `fk_votaciones_quizz1_idx` (`quizz`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `logros`
--
ALTER TABLE `logros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `logros_obtenidos`
--
ALTER TABLE `logros_obtenidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `quizz`
--
ALTER TABLE `quizz`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `fk_users_has_users_users1` FOREIGN KEY (`origen`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_has_users_users2` FOREIGN KEY (`destino`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `logros_obtenidos`
--
ALTER TABLE `logros_obtenidos`
  ADD CONSTRAINT `logro_fk` FOREIGN KEY (`logro`) REFERENCES `logros` (`id`),
  ADD CONSTRAINT `usuario_fk` FOREIGN KEY (`usuario`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `moderacion`
--
ALTER TABLE `moderacion`
  ADD CONSTRAINT `fk_moderacion_quizz1` FOREIGN KEY (`quizz`) REFERENCES `quizz` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_moderacion_users1` FOREIGN KEY (`usuario`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `votaciones`
--
ALTER TABLE `votaciones`
  ADD CONSTRAINT `fk_votaciones_quizz1` FOREIGN KEY (`quizz`) REFERENCES `quizz` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_votaciones_users1` FOREIGN KEY (`origen`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
