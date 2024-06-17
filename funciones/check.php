<?php
require "conexion.php";
$conexion = conecta();
error_log("Si entra en el PHP"); // Log para verificar que el PHP se ejecuta

$codigoo = $_REQUEST['codigo'];
$huella = $_REQUEST['huella'];
$tarjeta = $_REQUEST['tarjeta'];
$facial = $_REQUEST['facial'];

$sql = "SELECT codigo, turno FROM datos_biometricos WHERE codigo='$codigoo' OR Dhuella='$huella' OR Dfacial='$facial' OR Dtarjeta='$tarjeta'";
$resDatos = $conexion->query($sql);
if ($resDatos->num_rows > 0) {
    $row = $resDatos->fetch_assoc();
    $codigo = $row['codigo'];

    $shift = $row['turno']; // Obtener el turno desde la tabla datos_biometricos
    error_log("Código: $codigo, Turno: $shift"); // Log para verificar que los datos se obtuvieron correctamente


    $sqlNombre = "SELECT id, nombre, activo FROM usuarios WHERE codigo=$codigo";
    $resNombre = $conexion->query($sqlNombre);

    if ($resNombre) {
        $row = $resNombre->fetch_assoc();
        $user_id = $row['id'];
        $nombre = $row['nombre'];
        $activo = $row['activo'];


        if ($activo == 0) {
            $sqlCambio = "UPDATE usuarios SET activo=1 WHERE codigo=$codigo";
            $resCambio = $conexion->query($sqlCambio);
            if ($resCambio) {
                echo "0," . $nombre;
            } else {
                echo "2," . $nombre;
            }
        } else {
            $sqlCambio = "UPDATE usuarios SET activo=0 WHERE codigo=$codigo";
            $resCambio = $conexion->query($sqlCambio);
            if ($resCambio) {
                echo "4," . $nombre;
            } else {
                echo "2," . $nombre;
            }
        }
    } else {
        echo "2,"; // Error al obtener el nombre
    }
} else {
    echo "1,"; // Datos incorrectos
}

function isWithinShift($shift) {
    $currentDateTime = new DateTime('now', new DateTimeZone('America/Mexico_City')); // Adjust timezone as needed
    $currentTime = $currentDateTime->format('H:i');
    $currentDay = $currentDateTime->format('N'); // 1 (for Monday) through 7 (for Sunday)
    error_log("Current Time: $currentTime"); // Log current time for debugging
    error_log("Current Day: $currentDay"); // Log current day for debugging
    error_log("Shift: $shift"); // Log shift for debugging

    $withinShift = false; // Default value

    switch ($shift) {
        case 1: // Matutino (Monday to Friday, 8am to 12pm)
            $withinShift = $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '08:00' && $currentTime <= '12:00';
            break;
        case 2: // Medio día (Monday to Friday, 12pm to 4pm)
            $withinShift = $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '12:00' && $currentTime <= '16:00';
            break;
        case 3: // Vespertino (Monday to Friday, 4pm to 8pm)
            $withinShift = $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '16:00' && $currentTime <= '20:00';
            break;
        case 4: // Sabatino (Saturday, 7am to 12pm)
            $withinShift = $currentDay == 6 && $currentTime >= '07:00' && $currentTime <= '12:00';
            break;
        case 5: // Turno abierto (puede acceder a cualquier hora)
            $withinShift = true;
            break;
        default:
            error_log("Invalid shift: $shift");
            break;
    }

    error_log("Within Shift: " . ($withinShift ? "true" : "false")); // Log result for debugging
    return $withinShift;
}
?>
