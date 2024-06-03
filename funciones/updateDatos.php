<?php
require "conexion.php";

$conexion = conecta();
$codigo = $_REQUEST['codigo'];
$huella = $_REQUEST['huella'];
$tarjeta = $_REQUEST['tarjeta'];
$facial = $_REQUEST['facial'];

$sql = "SELECT * FROM usuarios WHERE codigo=$codigo";
$peticionExiste = $conexion->query($sql);
if ($peticionExiste->num_rows < 1) {
    echo "El usuario no existe";
} else {
    $sql = "SELECT * FROM datos_biometricos WHERE codigo=$codigo";
    $peticionExiste = $conexion->query($sql);

    if (!empty($huella)) {
        $sql = "UPDATE datos_biometricos SET Dhuella='$huella' WHERE codigo=$codigo";
        $resHuella = $conexion->query($sql);
    }
    if (!empty($facial)) {
        $sql = "UPDATE datos_biometricos SET Dfacial='$facial' WHERE codigo=$codigo";
        $resFacial = $conexion->query($sql);
    }
    if (!empty($tarjeta)) {
        $sql = "UPDATE datos_biometricos SET Dtarjeta='$tarjeta' WHERE codigo=$codigo";
        $resTarjeta = $conexion->query($sql);
    }

    if ($resHuella || $resFacial || $resTarjeta) {
        echo "Datos actualizados correctamente";
    } else {
        echo "No se han proporcionado datos para actualizar";
    }
}


?>