-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-06-2024 a las 18:58:15
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
  `codigo` int(11) NOT NULL,
  `Dhuella` varchar(255) NOT NULL,
  `Dtarjeta` varchar(255) NOT NULL,
  `Dfacial` varchar(255) NOT NULL,
  `turno` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_biometricos`
--

INSERT INTO `datos_biometricos` (`id`, `codigo`, `Dhuella`, `Dtarjeta`, `Dfacial`, `turno`) VALUES
(1, 218715581, 'huella_juan', 'tarjeta_juan', 'facial_juan', 1),
(2, 218715582, 'huella_maria', 'tarjeta_maria', 'facial_maria', 2),
(3, 218715583, 'huella_carlos', 'tarjeta_carlos', 'facial_carlos', 3),
(4, 218715584, 'huella_ana', 'tarjeta_ana', 'facial_ana', 4),
(5, 218715585, 'huella_luis', 'tarjeta_luis', 'facial_luis', 5),
(8, 1, 'pabloH', 'pabloT', 'pabloC', 2);

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
(1, 218879131, 2147483647, 'Saul', 1),
(5, 218715589, 333842711, 'Oscar Martinez', 1),
(11, 218715581, 555, 'Juan Pérez', 1),
(12, 218715582, 555, 'María López', 1),
(13, 218715583, 555, 'Carlos García', 0),
(14, 218715584, 555, 'Ana Fernández', 1),
(15, 218715585, 555, 'Luis Martínez', 0),
(17, 1, 1, 'aaaaa', 1);

--
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
