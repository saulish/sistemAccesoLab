<?php
require "conexion.php";
$conexion = conecta();

$codigoo = $_REQUEST['codigo'];
$huella = $_REQUEST['huella'];
$tarjeta = $_REQUEST['tarjeta'];
$facial = $_REQUEST['facial'];

$sql = "SELECT codigo FROM datos_biometricos WHERE codigo='$codigoo' OR Dhuella='$huella' OR Dfacial='$facial' OR Dtarjeta='$tarjeta'";
$resDatos = $conexion->query($sql);

if ($resDatos->num_rows > 0) {
    $row = $resDatos->fetch_assoc();
    $codigo = $row['codigo'];

    $sqlNombre = "SELECT nombre, activo, turno FROM usuarios WHERE codigo=$codigo";
    $resNombre = $conexion->query($sqlNombre);
    if ($resNombre) {
        $row = $resNombre->fetch_assoc();
        $nombre = $row['nombre'];
        $activo = $row['activo'];
        $turno = $row['turno'];

        // Function to check if the current time is within the allowed shift time
        function isWithinShift($turno) {
            // Get the current time
            $currentDateTime = new DateTime('now', new DateTimeZone('America/Mexico_City')); // Adjust timezone as needed
            $currentTime = $currentDateTime->format('H:i');
            error_log("Current Time: $currentTime"); // Log current time for debugging

            switch ($turno) {
                case 0: // Matutino
                    return $currentTime >= '07:00' && $currentTime <= '12:00';
                case 1: // Medio Dia
                    return $currentTime >= '12:00' && $currentTime <= '16:00';
                case 2: // Vespertino
                    return $currentTime >= '16:00' && $currentTime <= '20:00';
                default:
                    return false;
            }
        }

        // Check if the current time is within the user's shift
        if (!isWithinShift($turno)) {
            echo "Fuera de turno";
            error_log("Shift: $turno, Fuera de turno"); // Log shift and message for debugging
            $conexion->close();
            exit();
        }

        if ($activo == 0) {
            $sqlCambio = "UPDATE usuarios SET activo=1 WHERE codigo=$codigo";
            $resCambio = $conexion->query($sqlCambio);
            if ($resCambio) {
                echo "Bienvenido $nombre";
            } else {
                echo "Error al cambiar estado";
            }
        } else {
            $sqlCambio = "UPDATE usuarios SET activo=0 WHERE codigo=$codigo";
            $resCambio = $conexion->query($sqlCambio);
            if ($resCambio) {
                echo "Hasta luego $nombre";
            } else {
                echo "Error al cambiar estado";
            }
        }
    } else {
        echo "Error al obtener nombre";
    }
} else {
    echo "Datos incorrectos";
}

$conexion->close();
?>
