<?php
require "conexion.php";
$conexion = conecta();


$codigo = $_POST['codigo'];
$sql="SELECT * FROM usuarios WHERE codigo=$codigo";


$peticionExiste=$conexion->query($sql);
if($peticionExiste->num_rows>0){
    echo 1;
}else{
    echo 0;
}


?>