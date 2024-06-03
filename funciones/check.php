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

    $sqlNombre = "SELECT nombre, activo FROM usuarios WHERE codigo='$codigo'";
    $resNombre = $conexion->query($sqlNombre);

    if ($resNombre) {
        $row = $resNombre->fetch_assoc();
        $nombre = $row['nombre'];
        $activo = $row['activo'];

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
