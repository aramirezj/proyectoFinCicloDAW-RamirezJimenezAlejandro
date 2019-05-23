-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-05-2019 a las 14:51:59
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
-- Estructura de tabla para la tabla `quizz`
--

CREATE TABLE `quizz` (
  `id` int(50) NOT NULL,
  `creador` int(50) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `contenido` varchar(20000) DEFAULT NULL,
  `fechacreacion` date NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `quizz`
--

INSERT INTO `quizz` (`id`, `creador`, `titulo`, `contenido`, `fechacreacion`, `publicado`) VALUES
(33, 18, '¿Qué Pokemon inicial eres? (1ª Gen)', '{\"id\":null,\"creador\":18,\"titulo\":\"¿Qué Pokemon inicial eres?(1ª Gen)\",\"image\":\"s1pe0ah16c.jpg\",\"soluciones\":[{\"id\":1,\"titulo\":\"Squirtle\",\"descripcion\":\"Estas lleno de orgullo, pero por que sabes que puedes, tienes coraje y ambición y pocas personas te superan\",\"image\":\"mhwd26mwthp.jpg\"},{\"id\":2,\"titulo\":\"Charmander\",\"descripcion\":\"Amigo de tus amigos, un tío legal, pasional y el motivo del dicho quien tiene un amigo tiene un tesoro\",\"image\":\"wiyanbsxyrk.jpg\"},{\"id\":3,\"titulo\":\"Bulbasaur\",\"descripcion\":\"Eres tranquilo, paciente, de los que piensan todo antes dos veces, aunque muy despistado e inocente\",\"image\":\"qcdg7u4onur.jpeg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"Hay una pelea en el patio, ¿Quién eres?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"El que está metido en el fregado, dándole su merecido a un payaso\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":3,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"El que mete mierda para que se den de hostias\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"3\"}]},{\"id\":3,\"enunciado\":\"El que busca a los profesores para que paren de hacer los tontos\",\"madre\":1,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"5\"}]},{\"id\":4,\"enunciado\":\"Al que van a zurrar, mala idea recordar a la profesora que había examen\",\"madre\":1,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"3\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"¿Eres más de...?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Libro\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Pelicula\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":3,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Para que ver otras historias cuando la mía es mejor\",\"madre\":2,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":2,\"cantidad\":0},{\"idr\":3,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"¿Qué valoras más en un amigo?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Su lealtad\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"2\"}]},{\"id\":2,\"enunciado\":\"Que me sea útil\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"1\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"1\"}]},{\"id\":3,\"enunciado\":\"Que me aprecie\",\"madre\":3,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"8\"}]},{\"id\":4,\"enunciado\":\"Que tenga piscina lol\",\"madre\":3,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":2,\"cantidad\":0},{\"idr\":4,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"¿Con qué Vengador te defines más?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Doctor Strange\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"6\"}]},{\"id\":2,\"enunciado\":\"Iron Man\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":\"4\"}]},{\"id\":3,\"enunciado\":\"Capitán América\",\"madre\":4,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":3,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"1\"}]},{\"id\":4,\"enunciado\":\"Thor\",\"madre\":4,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"2\"}]},{\"id\":5,\"enunciado\":\"Pantera negra\",\"madre\":4,\"afinidades\":[{\"idr\":5,\"ids\":1,\"cantidad\":\"2\"},{\"idr\":5,\"ids\":2,\"cantidad\":0},{\"idr\":5,\"ids\":3,\"cantidad\":\"8\"}]}],\"eleccion\":null},{\"id\":5,\"enunciado\":\"La tortilla...\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Con cebolla\",\"madre\":5,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Sin cebolla\",\"madre\":5,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-05-19T20:42:05.550Z\"}', '2019-05-19', 1),
(34, 19, 'Amoderar1', '{\"id\":null,\"creador\":19,\"titulo\":\"Amoderar1\",\"image\":\"y7y9trur3uk.jpg\",\"soluciones\":[{\"id\":1,\"titulo\":\"Sol1\",\"descripcion\":\"exp1\",\"image\":\"fo5zjhejymn.jpg\"},{\"id\":2,\"titulo\":\"Sol2\",\"descripcion\":\"exp2\",\"image\":\"am1uf411fgg.jpg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"p1\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r1\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"1\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r2\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"1\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"p2\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r3\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"1\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r4\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"1\"}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-05-23T11:34:00.477Z\"}', '2019-05-23', 0),
(35, 19, 'Amoderar2', '{\"id\":null,\"creador\":19,\"titulo\":\"Amoderar2\",\"image\":\"xt53cq4sm48.jpg\",\"soluciones\":[{\"id\":1,\"titulo\":\"Sol1\",\"descripcion\":\"exp1\",\"image\":\"qa6gootfz7.jpg\"},{\"id\":2,\"titulo\":\"Sol2\",\"descripcion\":\"exp2\",\"image\":\"s6imyyy4su.jpg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"p1\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r1\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"7\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r2\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"3\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"p2\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r3\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r4\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"9\"}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-05-23T11:34:48.697Z\"}', '2019-05-23', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `quizz`
--
ALTER TABLE `quizz`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `quizz`
--
ALTER TABLE `quizz`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
