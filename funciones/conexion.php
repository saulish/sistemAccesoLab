<?php
define ("HOST",'Localhost');
define("BD",'sistemaaccesolab');
define("USER_BD",'root');
define("PASS_BD",'');

function conecta(){
    $con =new mysqli (HOST, USER_BD, PASS_BD, BD);
    return $con;
}

?>