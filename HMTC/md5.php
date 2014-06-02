<?php

if (isset($_POST['mdp']))
  echo md5($_POST['mdp']);
else
  {
    echo "\n<form action=\"md5.php\" method=\"POST\">";
    echo "\n<input type=\"text\" name=\"mdp\">";
    echo "\n<input type=\"submit\" name=\"ajout\" value=\"md5\">";
    echo "\n</form>";
  }
?>