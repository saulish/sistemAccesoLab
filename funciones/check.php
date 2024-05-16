<?php
require "conexion.php";
$conexion = conecta();


$codigo = $_REQUEST['codigo'];
$huella = $_REQUEST['huella'];
$tarjeta = $_REQUEST['tarjeta'];
$facial = $_REQUEST['facial'];







$sql = "SELECT codigo FROM datos_biometricos WHERE Dhuella='$huella' OR Dfacial='$facial' OR Dtarjeta='$tarjeta'";


$resDatos = $conexion->query($sql);
if($resDatos->num_rows>0){
    $row = $resDatos->fetch_assoc();
    $codigo = $row['codigo'];
    #echo $codigo;

    $sqlNombre="SELECT nombre,activo FROM usuarios WHERE codigo=$codigo";
    $resNombre = $conexion->query($sqlNombre);
    if($resNombre){
        $row = $resNombre->fetch_assoc();
        $nombre = $row['nombre'];
        $activo=$row['activo'];
        if($activo==0){
            $sqlCambio="UPDATE usuarios SET activo=1 WHERE codigo=$codigo";
            $resCambio = $conexion->query($sqlCambio);
            if($resCambio){
                echo "Bienvenido $nombre";
            }
            else{
                echo "Error al cambiar estado";
            }
        }
        else{
            $sqlCambio="UPDATE usuarios SET activo=0 WHERE codigo=$codigo";
            $resCambio = $conexion->query($sqlCambio);

            if($resCambio){
                echo "Hasta luego $nombre";
            }
            else{
                echo "Error al cambiar estado";
            }
        }
    }
    else{
        echo "Error al obtener nombre";
    }

}else{
    echo "Datos incorrectos";
}





?>