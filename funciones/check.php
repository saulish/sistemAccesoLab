<?php
require "conexion.php";
$conexion = conecta();

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

    $sqlNombre = "SELECT id, nombre, activo FROM usuarios WHERE codigo=$codigo";
    $resNombre = $conexion->query($sqlNombre);

    if ($resNombre) {
        $row = $resNombre->fetch_assoc();
        $user_id = $row['id'];
        $nombre = $row['nombre'];
        $activo = $row['activo'];

        // Function to check if the current time is within the allowed shift time and day
        function isWithinShift($shift) {
            // Get the current time and day
            $currentDateTime = new DateTime('now', new DateTimeZone('America/Mexico_City')); // Adjust timezone as needed
            $currentTime = $currentDateTime->format('H:i');
            $currentDay = $currentDateTime->format('N'); // 1 (for Monday) through 7 (for Sunday)
            error_log("Current Time: $currentTime"); // Log current time for debugging
            error_log("Current Day: $currentDay"); // Log current day for debugging

            switch ($shift) {
                case 1: // Matutino (Monday to Friday, 7am to 12pm)
                    return $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '07:00' && $currentTime <= '12:00';
                case 2: // Vespertino (Monday to Friday, 4pm to 8pm)
                    return $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '16:00' && $currentTime <= '20:00';
                case 3: // Nocturno (Monday to Friday, 8pm to 6am)
                    return ($currentDay >= 1 && $currentDay <= 5 && $currentTime >= '20:00') || 
                           ($currentDay >= 2 && $currentDay <= 6 && $currentTime <= '06:00');
                case 4: // Sabatino (Saturday, 7am to 4pm)
                    return $currentDay == 6 && $currentTime >= '07:00' && $currentTime <= '16:00';
                case 5: // Turno 5 (puede acceder a cualquier hora)
                    return true;
                default:
                    return false;
            }
        }

        // Check if the current time is within the user's shift
        if (!isWithinShift($shift)) {
            echo "Fuera de turno";
            error_log("Shift: $shift, Fuera de turno"); // Log shift and message for debugging
            exit();
        }
        
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
        // Devuelve 2 si hay un error al obtener el nombre
        echo "2,";
    }
} else {
    // Devuelve 1 si los datos son incorrectos
    echo "1,";
}

?>
