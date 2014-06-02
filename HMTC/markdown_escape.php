<?php

include_once("markdown.php");
//include_once("Michelf/Markdown.php");
//include_once("Michelf/MarkdownInterface.php");
//include_once("Michelf/MarkdownExtra.php");

if(isset($_GET['mode']) && $_GET['mode'] == 'ajax')
  die(Markdown($_POST['markdown']));

?>