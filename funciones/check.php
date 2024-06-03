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


    $sqlNombre = "SELECT id, nombre, activo FROM usuarios WHERE codigo=$codigo";
    $resNombre = $conexion->query($sqlNombre);

    $sqlNombre = "SELECT nombre, activo FROM usuarios WHERE codigo='$codigo'";
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
                case 'matutino': // Matutino (Monday to Friday, 7am to 12pm)
                    return $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '07:00' && $currentTime <= '12:00';
                case 'medio dia': // Medio Dia (Monday to Friday, 12pm to 4pm)
                    return $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '12:00' && $currentTime <= '16:00';
                case 'vespertino': // Vespertino (Monday to Friday, 4pm to 8pm)
                    return $currentDay >= 1 && $currentDay <= 5 && $currentTime >= '16:00' && $currentTime <= '20:00';
                case 'sabatino': // Sabatino (Saturday, 7am to 4pm)
                    return $currentDay == 6 && $currentTime >= '07:00' && $currentTime <= '16:00';
                default:
                    return false;
            }
        }

        // Query to get the user's shift for the current day
        $currentDayOfWeek = (new DateTime('now', new DateTimeZone('America/Mexico_City')))->format('l'); // e.g., 'Monday'
        $sqlShift = "SELECT shift FROM turno_personalizado WHERE user_id=$user_id AND day_of_week='$currentDayOfWeek'";
        $resShift = $conexion->query($sqlShift);
        if ($resShift->num_rows > 0) {
            $rowShift = $resShift->fetch_assoc();
            $shift = $rowShift['shift'];

            // Check if the current time is within the user's shift
            if (!isWithinShift($shift)) {
                echo "Fuera de turno";
                error_log("Shift: $shift, Fuera de turno"); // Log shift and message for debugging
                $conexion->close();
                exit();
            }
        } else {
            echo "No hay turno asignado para hoy";
            error_log("No shift assigned for today"); // Log no shift assigned for debugging
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

        if ($activo == 0) {
            $sqlCambio = "UPDATE usuarios SET activo=1 WHERE codigo='$codigo'";
            $resCambio = $conexion->query($sqlCambio);
            if ($resCambio) {
                // Devuelve 0 y el nombre si la verificación es exitosa
                echo "0," . $nombre;
            } else {
                // Devuelve 2 y el nombre si hay un error al cambiar el estado
                echo "2," . $nombre;
            }
        } else {
            $sqlCambio = "UPDATE usuarios SET activo=0 WHERE codigo='$codigo'";
            $resCambio = $conexion->query($sqlCambio);

            if ($resCambio) {
                // Devuelve 1 y el nombre si la verificación es exitosa
                echo "4," . $nombre;
            } else {
                // Devuelve 2 y el nombre si hay un error al cambiar el estado
                echo "2," . $nombre;
            }
        }
    } else {
        // Devuelve 2 si hay un error al obtener el nombre
        echo "2,";
    }
} else {
    // Devuelve 2 si los datos son incorrectos
    echo "1,";
}

?>
