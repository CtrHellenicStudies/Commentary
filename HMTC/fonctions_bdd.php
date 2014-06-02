<?php


///////////////////////////////////////////////////////////////////////////
function select_option_array($tableau,$valeur)
{
  $retour="";
  foreach ($tableau as $title=>$value){
    $retour.="\n<option ";
    if ($valeur==$value) 
      $retour.="selected ";
    $retour.="value=\"".$value."\">";
    $retour.="&nbsp;".$title."&nbsp;";
    $retour.="</option>";
  }
  return($retour);
}
///////////////////////////////////////////////////////////////////////////
function select_option_condition($table,$champs_a_voir,$champ,$condition,$bd)
{
  $retour="";
  $retour.="\n<option ";
  $retour.="value=\"\">&nbsp;";
  $retour.="&nbsp; </option>";
  $query="SELECT * FROM ".BDD_PREFIXE.$table." ".$condition." ORDER BY ".$champs_a_voir[0]."";
  //  echo "$query<br />";
  $result=$bd->query($query);
  while ($element = $result->fetch_object())
    {
      $retour.="\n<option value=\"".$element->$champ."\">&nbsp;";
      foreach($champs_a_voir as $cechamp)
	$retour.=$element->$cechamp." ";
      $retour.="&nbsp; </option>";
    }
  return($retour);
}
///////////////////////////////////////////////////////////////////////////
function select_option_condition_selected($table,$champs_a_voir,$champ,$condition,$valeur,$bd)
{
  $retour="";
  $retour.="\n<option ";
  $retour.="value=\"\">&nbsp;";
  $retour.="&nbsp; </option>";
  $query="SELECT * FROM ".BDD_PREFIXE.$table." ".$condition." ORDER BY ".$champs_a_voir[0]."";
  //echo "$query<br />-$valeur-";
  $result=$bd->query($query);
  while ($element = $result->fetch_object())
    {
      $retour.="\n<option ";
      if ($element->$champ==$valeur) 
	$retour.="selected ";
      $retour.="value=\"".$element->$champ."\">&nbsp;";
      foreach($champs_a_voir as $cechamp)
	$retour.=$element->$cechamp." ";
      $retour.="&nbsp; </option>";
    }
  return($retour);
}
///////////////////////////////////////////////////////////////////////////
function select_option_champ($table,$champs_a_voir,$champ,$bd)
{
  $retour="";
  $retour.="\n<option ";
  $retour.="value=\"\">&nbsp;";
  $retour.="&nbsp; </option>";
  $query="SELECT DISTINCT ".$champ." FROM ".BDD_PREFIXE."$table ORDER BY ".$champs_a_voir[0]."";
  //echo "$query<br />";
  $result=$bd->query($query);
  while ($element = $result->fetch_object())
    {
      $retour.="\n<option value=\"".$element->$champ."\">&nbsp;";
      foreach($champs_a_voir as $cechamp)
	$retour.=$element->$cechamp." ";
      $retour.="&nbsp; </option>";
    }
  return($retour);
}
///////////////////////////////////////////////////////////////////////////
function select_option($table,$champs_a_voir,$champ,$valeur,$bd)
{
  $retour="";
  $retour.="\n<option ";
  $retour.="value=\"\">&nbsp;";
  $retour.="&nbsp; </option>";
  $query="SELECT * FROM ".BDD_PREFIXE."$table ORDER BY ".$champs_a_voir[0]."";
  //echo "$query<br />-$valeur-";
  $result=$bd->query($query);
  while ($element = $result->fetch_object())
    {
      $retour.="\n<option ";
      if ($element->$champ==$valeur) 
	$retour.="selected ";
      $retour.="value=\"".$element->$champ."\">&nbsp;";
      foreach($champs_a_voir as $cechamp)
	$retour.=$element->$cechamp." ";
      $retour.="&nbsp; </option>";
    }
  return($retour);
}
///////////////////////////////////////////////////////////////////////////
function trouve_champs($table,$champs,$id,$bd){
  $retour=Array();
  $query="SELECT * FROM ".BDD_PREFIXE."$table WHERE id_".chaine_moins($table,1)."='$id'";
  //echo "=======<br />trouve champ : $query<br />";
  $result=$bd->query($query);
  $element = $result->fetch_object();
  //print_r($champs);echo "table=".$table."<br />";
  foreach($champs as $cechamp)
    $retour[$cechamp]=$element->$cechamp;
  if (count($retour)==1)
    $retour=$retour[$champs[0]];
  //print_r($retour);echo "<br />";
  return($retour);
}
///////////////////////////////////////////////////////////////////////////


?>