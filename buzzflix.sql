-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-04-2019 a las 23:51:24
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
  `origen` int(10) NOT NULL,
  `destino` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `follows`
--

INSERT INTO `follows` (`origen`, `destino`) VALUES
(19, 18),
(20, 18),
(18, 19),
(18, 20),
(32, 19),
(32, 18),
(34, 19),
(19, 27),
(19, 21);

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
  `fechacreacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `quizz`
--

INSERT INTO `quizz` (`id`, `creador`, `titulo`, `contenido`, `estrellas`, `fechacreacion`) VALUES
(8, 25, '¿Qué personaje de Dragon Ball eres?', '{\"id\":null,\"creador\":25,\"titulo\":\"¿Qué personaje de Dragon Ball eres?\",\"soluciones\":[{\"id\":1,\"titulo\":\"Goku\",\"descripcion\":\"Eres un luchador bobo pero admirable.\",\"image\":null},{\"id\":2,\"titulo\":\"Vegeta\",\"descripcion\":\"Eres un luchador excepcional pero tu ego está en las nubes\",\"image\":null},{\"id\":3,\"titulo\":\"Piccolo\",\"descripcion\":\"Eres un luchador malvado pero con corazón blando, nenaza.\",\"image\":null},{\"id\":4,\"titulo\":\"Mr. Satán\",\"descripcion\":\"Eres un luchador de pacotilla y crees que el mundo gira a tu alrededor.\",\"image\":null}],\"preguntas\":[{\"id\":1,\"enunciado\":\"¿Qué arma usarías en un combate?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Cuchillo de combate\",\"madre\":1,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"2\"},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":\"7\"},{\"idr\":1,\"ids\":4,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"Ninguna, no me hacen falta\",\"madre\":1,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":\"8\"},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"5\"},{\"idr\":2,\"ids\":4,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Puños\",\"madre\":1,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"5\"},{\"idr\":3,\"ids\":4,\"cantidad\":0}]},{\"id\":4,\"enunciado\":\"Trampas\",\"madre\":1,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"2\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":4,\"cantidad\":\"7\"}]}],\"eleccion\":null},{\"id\":2,\"enunciado\":\"Tienes un sueño, tu mejor amigo está en peligro rodeado de unos extraños. Te despiertas a las 5 am. ¿Qué haces?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Ir lo más rápido posible en su busca a comprobar si está en peligro o no.\",\"madre\":2,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"5\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"2\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"0\"},{\"idr\":1,\"ids\":4,\"cantidad\":\"7\"}]},{\"id\":2,\"enunciado\":\"Sabes que era un sueño y sigues durmiendo\",\"madre\":2,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"7\"},{\"idr\":2,\"ids\":4,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Lo llamas por telefono pero como no te lo coge, sigues durmiendo \",\"madre\":2,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":0},{\"idr\":3,\"ids\":2,\"cantidad\":\"2\"},{\"idr\":3,\"ids\":3,\"cantidad\":0},{\"idr\":3,\"ids\":4,\"cantidad\":\"10\"}]},{\"id\":4,\"enunciado\":\"Vas al lugar donde ocurria el sueño y esperas durante horas\",\"madre\":2,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":2,\"cantidad\":0},{\"idr\":4,\"ids\":3,\"cantidad\":0},{\"idr\":4,\"ids\":4,\"cantidad\":\"5\"}]}],\"eleccion\":null},{\"id\":3,\"enunciado\":\"Estás herido en combate, pero te quedan fuerzas para luchar. Tu único compañero de combate ha caído y vuestros dos enemigos siguen en pie riéndose de lo débiles que sois. ¿Qué haces?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Declaras la guerra a muerte y te enfureces hasta alcanzar un nivel de fuerza descomunal\",\"madre\":3,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":1,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":1,\"ids\":3,\"cantidad\":\"2\"},{\"idr\":1,\"ids\":4,\"cantidad\":0}]},{\"id\":2,\"enunciado\":\"Sales corriendo a buscar ayuda porque sabes que sólo no tienes nada que hacer.\",\"madre\":3,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"5\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"8\"},{\"idr\":2,\"ids\":4,\"cantidad\":\"10\"}]},{\"id\":3,\"enunciado\":\"Huyes cuando están distraidos y reflexionas cómo vencerlos\",\"madre\":3,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"2\"},{\"idr\":3,\"ids\":2,\"cantidad\":\"8\"},{\"idr\":3,\"ids\":3,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":4,\"cantidad\":\"5\"}]},{\"id\":4,\"enunciado\":\"Te escondes para recuperarte y poder hacerles frente de nuevo\",\"madre\":3,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":\"8\"},{\"idr\":4,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"2\"},{\"idr\":4,\"ids\":4,\"cantidad\":0}]}],\"eleccion\":null},{\"id\":4,\"enunciado\":\"Vas paseando por la calle de noche. Un asesino saca su arma y acaba con la vida de una anciana. Eres el único que lo ha visto desde lejos¿Qué haces?\",\"respuestas\":[{\"id\":1,\"enunciado\":\"Te escondes y llamas a la policía\",\"madre\":4,\"afinidades\":[{\"idr\":1,\"ids\":1,\"cantidad\":0},{\"idr\":1,\"ids\":2,\"cantidad\":0},{\"idr\":1,\"ids\":3,\"cantidad\":0},{\"idr\":1,\"ids\":4,\"cantidad\":\"10\"}]},{\"id\":2,\"enunciado\":\"No es tu problema, sigues paseando\",\"madre\":4,\"afinidades\":[{\"idr\":2,\"ids\":1,\"cantidad\":0},{\"idr\":2,\"ids\":2,\"cantidad\":\"10\"},{\"idr\":2,\"ids\":3,\"cantidad\":\"8\"},{\"idr\":2,\"ids\":4,\"cantidad\":0}]},{\"id\":3,\"enunciado\":\"Corres hasta el asesino para darle su merecido\",\"madre\":4,\"afinidades\":[{\"idr\":3,\"ids\":1,\"cantidad\":\"10\"},{\"idr\":3,\"ids\":2,\"cantidad\":0},{\"idr\":3,\"ids\":3,\"cantidad\":0},{\"idr\":3,\"ids\":4,\"cantidad\":\"2\"}]},{\"id\":4,\"enunciado\":\"Sacas tu arma y acabas con él\",\"madre\":4,\"afinidades\":[{\"idr\":4,\"ids\":1,\"cantidad\":0},{\"idr\":4,\"ids\":2,\"cantidad\":\"5\"},{\"idr\":4,\"ids\":3,\"cantidad\":\"10\"},{\"idr\":4,\"ids\":4,\"cantidad\":\"2\"}]}],\"eleccion\":null}],\"estrellas\":0,\"fechacreacion\":\"2019-03-29T11:18:15.877Z\"}', 11, '2019-03-29');

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
(19, 'Alejandro2', 'alejandro@gmail.com', 'alejandro', NULL),
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
(36, 'dawdawd', 'awdawda@dwad.com', 'dawdawd', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votaciones`
--

CREATE TABLE `votaciones` (
  `id` int(10) NOT NULL,
  `origen` int(10) NOT NULL,
  `quizz` int(10) NOT NULL,
  `cantidad` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

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
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `quizz`
--
ALTER TABLE `quizz`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `votaciones`
--
ALTER TABLE `votaciones`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
