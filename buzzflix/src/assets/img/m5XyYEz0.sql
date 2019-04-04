-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-03-2019 a las 21:48:54
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
(1, 'alejandro', 'exilonmlol@gmail.com', '1234545', NULL),
(2, 'alejandro', 'exilonmlol@gmail.com', '1234545', NULL),
(3, 'Alejandro', 'hehe@gmail.com', 'lapassxd', NULL),
(4, 'Alejandro', 'hehe@gmail.com', 'lapassxd', NULL),
(5, 'Alejandro', 'hehe@gmail.com', 'lapassxd', NULL),
(6, 'Alejandro', 'hehe@gmail.com', 'lapassxd', 'assets/avatares/dva.jpg'),
(7, 'Alejandro', 'hehe@gmail.com', 'lapassxd', NULL),
(8, 'Alejandro', 'hehe@gmail.com', 'lapassxd', NULL),
(9, 'dawdawda', 'wdawdawd', 'awdawd', NULL),
(10, 'dawdawda', 'wdawdawd', 'awdawd', NULL),
(11, 'salu2', 'saludado@gmail.com', 'hehawhdaw', NULL),
(12, 'salu2', 'adwdawdo@gmail.com', 'hehawhdaw', NULL),
(13, 'salu2', 'adwdawdo@gmail.com', 'hehawhdaw', NULL),
(14, 'dsawdw', 'dawdawdawd', 'awdawd', NULL),
(15, 'test', 'testeando', 'tresadd', NULL),
(16, 'dawdawd', 'awdawdawd', 'awdawda', NULL),
(17, 'hehexd', 'hehehehehe', 'dawdawdaw', NULL),
(18, 'Manolo2', 'manolo2', 'manolo', NULL),
(19, 'Alejandro', 'alejandro@gmail.com', 'alejandro', NULL),
(20, 'evaa', 'eva@gmail.com', 'evaeva', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
