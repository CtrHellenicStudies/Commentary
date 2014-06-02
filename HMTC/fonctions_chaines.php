<?php

///////////////////////////////////////////////////////////////////////////
function tel_espace($notel) {
  $notelesp="";
  for ($i=0;$i<=5;$i++)
    $notelesp.=substr($notel,2*$i,2)." ";
  return(trim($notelesp));
}
///////////////////////////////////////////////////////////////////////////
function dernier_mot($str) {
  $pattern = '/[^ ]*$/';
  preg_match($pattern, $str, $results);
  return($results[0]);
  }
///////////////////////////////////////////////////////////////////////////
function formate_entier($entier,$sur=FORMAT_ENTIER) {
  if (isset($sur))
    return(sprintf("%1\$0".$sur."d",$entier));
  else
    return(sprintf("%1\$0".FORMAT_ENTIER."d",$entier));
  }
///////////////////////////////////////////////////////////////////////////
function chaine_sans_accent($str, $encoding='utf-8')
{
// transformer les caractères accentués en entités HTML
$str = htmlentities($str, ENT_NOQUOTES, $encoding);
 
// remplacer les entités HTML pour avoir juste le premier caractères non accentués
// Exemple : "&ecute;" => "e", "&Ecute;" => "E", "Ã " => "a" ...
$str = preg_replace('#&([A-za-z])(?:acute|grave|cedil|circ|orn|ring|slash|th|tilde|uml);#', '\1', $str);
 
// Remplacer les ligatures tel que : Œ, Æ ...
// Exemple "Å“" => "oe"
$str = preg_replace('#&([A-za-z]{2})(?:lig);#', '\1', $str);
// Supprimer tout le reste
$str = preg_replace('#&[^;]+;#', '', $str);
 
return $str;
}
///////////////////////////////////////////////////////////////////////////
function chaine_moins($chaine,$nb){
  return(substr($chaine,0,strlen($chaine)-$nb));
  }
///////////////////////////////////////////////////////////////////////////
function chaine_alea($car,$alphabet){
  $string = "";
  if ($alphabet=="hexa")
    $chaine = "abcdef0123456789";
  else
    $chaine = "abcdefghijklmnpqrstuvwxy0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  srand((double)microtime()*1000000);
  for($i=0; $i<$car; $i++){
    $string .= $chaine[rand()%strlen($chaine)];
  }
  return $string;
} 
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////


?>