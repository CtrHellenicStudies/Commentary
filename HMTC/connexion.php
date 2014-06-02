<?php

$mysqli = new mysqli(BDD_SERVEUR, BDD_LOGIN, BDD_MOTDEPASSE, BDD_BASEDEDONNEES);

/* Vérification de la connexion */
if ($mysqli->connect_errno) {
    printf("Échec de la connexion : %s\n", $mysqli->connect_error);
    exit();
}
//$mysqli->query("SET CHARACTER SET utf8");
$mysqli->set_charset("utf8");
$mysqli->query('SET NAMES utf8'); 
?>
