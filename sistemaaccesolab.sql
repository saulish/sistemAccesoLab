-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-05-2024 a las 18:12:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistemaaccesolab`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_biometricos`
--

CREATE TABLE `datos_biometricos` (
  `id` int(11) NOT NULL,
  `codigo` int(10) NOT NULL,
  `Dhuella` varchar(100) NOT NULL,
  `Dfacial` varchar(100) NOT NULL,
  `DTarjeta` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_biometricos`
--

INSERT INTO `datos_biometricos` (`id`, `codigo`, `Dhuella`, `Dfacial`, `DTarjeta`) VALUES
(1, 218879131, 'huella1', 'facil1', 'tarjeta1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `codigo` int(10) NOT NULL,
  `telefono` int(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `codigo`, `telefono`, `nombre`, `activo`) VALUES
(1, 218879131, 2147483647, 'Saul', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno_personalizado`
--

CREATE TABLE `turno_personalizado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `day_of_week` varchar(10) NOT NULL,
  `shift` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
INSERT INTO `turno_personalizado` (`user_id`, `day_of_week`, `shift`) VALUES
(5, 'Monday', 'matutino'),
(5, 'Tuesday', 'matutino'),
(5, 'Wednesday', 'matutino'),
(5, 'Thursday', 'vespertino'),
(5, 'Friday', 'vespertino');

-- Índices para tablas volcadas
--

--
-- Indices de la tabla `datos_biometricos`
--
ALTER TABLE `datos_biometricos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `datos_biometricos`
--
ALTER TABLE `datos_biometricos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `turno_personalizado`
--
ALTER TABLE `turno_personalizado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
