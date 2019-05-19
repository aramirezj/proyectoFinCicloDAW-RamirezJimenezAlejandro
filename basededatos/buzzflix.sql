-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2019 a las 23:06:00
-- Versión del servidor: 10.1.38-MariaDB
-- Versión de PHP: 7.3.2

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
(19, 18),
(19, 21),
(19, 25),
(19, 27),
(20, 18),
(32, 18),
(32, 19),
(34, 19),
(37, 19),
(37, 27);

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
-- Estructura de tabla para la tabla `quizz`
--

CREATE TABLE `quizz` (
  `id` int(50) NOT NULL,
  `creador` int(50) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `contenido` varchar(20000) DEFAULT NULL,
  `estrellas` int(50) NOT NULL,
  `fechacreacion` date NOT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `quizz`
--

INSERT INTO `quizz` (`id`, `creador`, `titulo`, `contenido`, `estrellas`, `fechacreacion`, `publicado`) VALUES
(32, 19, 'Prueba', '{\"id\":null,\"creador\":19,\"titulo\":\"Prueba\",\"image\":\"a4eu7mko76d.PNG\",\"soluciones\":[{\"id\":1,\"titulo\":\"Sol1\",\"descripcion\":\"exp\",\"image\":\"exmv2ht3ai4.PNG\"},{\"id\":2,\"titulo\":\"sol2\",\"descripcion\":\"exp2\",\"image\":\"x9gtwuxdfam.PNG\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"p1\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r1\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r2\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"p2\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r3\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r4\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"p3\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r5\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r6\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"p4\",\"respuestas\":[{\"id\":1,\"enunciado\":\"r7\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"r8\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":0}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-05-19T16:45:51.815Z\"}', 0, '2019-05-19', 1),
(33, 18, '¿Qué Pokemon inicial eres? (1ª Gen)', '{\"id\":null,\"creador\":18,\"titulo\":\"¿Qué Pokemon inicial eres?(1ª Gen)\",\"image\":\"s1pe0ah16c.jpg\",\"soluciones\":[{\"id\":1,\"titulo\":\"Squirtle\",\"descripcion\":\"Estas lleno de orgullo, pero por que sabes que puedes, tienes coraje y ambición y pocas personas te superan\",\"image\":\"mhwd26mwthp.jpg\"},{\"id\":2,\"titulo\":\"Charmander\",\"descripcion\":\"Amigo de tus amigos, un tío legal, pasional y el motivo del dicho quien tiene un amigo tiene un tesoro\",\"image\":\"wiyanbsxyrk.jpg\"},{\"id\":3,\"titulo\":\"Bulbasaur\",\"descripcion\":\"Eres tranquilo, paciente, de los que piensan todo antes dos veces, aunque muy despistado e inocente\",\"image\":\"qcdg7u4onur.jpeg\"}],\"preguntas\":[{\"id\":1,\"enunciado\":\"Hay una pelea en el patio, ¿Quién eres?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"El que está metido en el fregado, dándole su merecido a un payaso\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":3,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"El que mete mierda para que se den de hostias\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"3\"}]},{\"id\":3,\"enunciado\":\"El que busca a los profesores para que paren de hacer los tontos\",\"madre\":1,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"7\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"5\"}]},{\"id\":4,\"enunciado\":\"Al que van a zurrar, mala idea recordar a la profesora que había examen\",\"madre\":1,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"3\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"10\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"¿Eres más de...?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Libro\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Pelicula\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":3,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Para que ver otras historias cuando la mía es mejor\",\"madre\":2,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":2,\"cantidad\":0},{\"idr\":3,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"¿Qué valoras más en un amigo?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Su lealtad\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"6\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"2\"}]},{\"id\":2,\"enunciado\":\"Que me sea útil\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"1\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"1\"}]},{\"id\":3,\"enunciado\":\"Que me aprecie\",\"madre\":3,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"8\"}]},{\"id\":4,\"enunciado\":\"Que tenga piscina lol\",\"madre\":3,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":2,\"cantidad\":0},{\"idr\":4,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"¿Con qué Vengador te defines más?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Doctor Strange\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"4\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"6\"}]},{\"id\":2,\"enunciado\":\"Iron Man\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":\"4\"}]},{\"id\":3,\"enunciado\":\"Capitán América\",\"madre\":4,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"4\"},{\"idr\":3,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"1\"}]},{\"id\":4,\"enunciado\":\"Thor\",\"madre\":4,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"2\"}]},{\"id\":5,\"enunciado\":\"Pantera negra\",\"madre\":4,\"afinidades\":[{\"idr\":5,\"ids\":1,\"cantidad\":\"2\"},{\"idr\":5,\"ids\":2,\"cantidad\":0},{\"idr\":5,\"ids\":3,\"cantidad\":\"8\"}]}],\"eleccion\":null},{\"id\":5,\"enunciado\":\"La tortilla...\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Con cebolla\",\"madre\":5,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Sin cebolla\",\"madre\":5,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":2,\"cantidad\":0},{\"idr\":2,\"ids\":3,\"cantidad\":0}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-05-19T20:42:05.550Z\"}', 0, '2019-05-19', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(150) NOT NULL,
  `avatar` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`) VALUES
(18, 'Manolo3', 'manolo3@gmail.com', 'manolo', NULL),
(19, 'Alejandro Ramírez', 'alejandro@gmail.com', 'alejandro', 'bvhq8bh0zbf.PNG'),
(20, 'eva', 'eva@gmail.com', 'evaeva', ''),
(21, 'josemiii', 'josemi', 'josemi', NULL),
(22, 'pruebaa', 'pruebaa', 'pruebaa', NULL),
(25, 'josuejosue', 'josuejosue@gmail.com', 'josuejosue', NULL),
(27, 'dawdawd', 'dwadawdd@gmail.com', 'dwaddwa', NULL),
(28, 'tokene', 'tokene@gmail.com', 'tokene', NULL),
(29, 'tokene', 'tokene@gmail.com', 'tokene', NULL),
(30, 'testing1', 'testing1@gmail.com', 'testing1', NULL),
(31, 'registro@gmail.com', 'registro@gmail.com', 'registro', NULL),
(32, 'registro', 'registro@gmail.com', 'registro', NULL),
(33, 'pruebatoken3', '', 'pruebatoken', NULL),
(34, 'tony', 'tony@gmail.com', 'tony12', NULL),
(35, 'dawdawd', 'awdawda@dwad.com', 'dawdawd', NULL),
(36, 'dawdawd', 'awdawda@dwad.com', 'dawdawd', NULL),
(37, 'rindamere', 'rindamere@gmail.com', 'rindamere', '');

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
-- Indices de la tabla `moderacion`
--
ALTER TABLE `moderacion`
  ADD PRIMARY KEY (`quizz`,`usuario`),
  ADD KEY `fk_moderacion_users1_idx` (`usuario`);

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
-- AUTO_INCREMENT de la tabla `quizz`
--
ALTER TABLE `quizz`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
-- Filtros para la tabla `moderacion`
--
ALTER TABLE `moderacion`
  ADD CONSTRAINT `fk_moderacion_quizz1` FOREIGN KEY (`quizz`) REFERENCES `quizz` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_moderacion_users1` FOREIGN KEY (`usuario`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `votaciones`
--
ALTER TABLE `votaciones`
  ADD CONSTRAINT `fk_votaciones_quizz1` FOREIGN KEY (`quizz`) REFERENCES `quizz` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_votaciones_users1` FOREIGN KEY (`origen`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
