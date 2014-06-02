<?php

/////////////////////////////////////////////////////////////////////////////////////////////
require_once("outils.php");
/////////////////////////////////////////////////////////////////////////////////////////////
echo hautdepage("Admin-Accueil");
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$short="\n<br />";
if (isset($_GET["id_writer"])) {
  if ($_GET["id_writer"]==0) 
    $short.="\n<a href=\"admin.php\">All writers</a>";
  $elt=trouve_champs("writers",array("lastname","firstname"),$_GET["id_writer"],$mysqli);
  $short.="\n<a href=\"admin.php?id_writer=".$_GET["id_writer"]."\">".$elt["lastname"]." ".$elt["firstname"]."</a>";
}
if (isset($_GET["id_author"])) {
  $elt=trouve_champs("authors",array("lastname","firstname"),$_GET["id_author"],$mysqli);
  $short.="\n - <a href=\"admin.php?id_writer=".$_GET["id_writer"]."&id_author=".$_GET["id_author"]."\">".$elt["lastname"]." ".$elt["firstname"]."</a>";
}
if (isset($_GET["id_work"])) {
  $short.=" >> \n<a href=\"admin.php?id_writer=".$_GET["id_writer"]."&id_author=".$_GET["id_author"]."&id_work=".$_GET["id_work"]."\">".trouve_champs("works",array("title"),$_GET["id_work"],$mysqli)."</a>";
}

echo $short;      


if (isset($_GET["line_number"])) {
  $urn="urn:".trouve_champs("authors",array("urn"),$_GET["id_author"],$mysqli)
    .".".trouve_champs("works",array("urn"),$_GET["id_work"],$mysqli);
  if ($_GET["line_number"]=="")
    if ($_GET["book_number"]=="")
      $where="((textURN LIKE '".$urn.":%')) ";
    else
      $where="((textURN LIKE '".$urn.":".$_GET["book_number"].".%')) ";
  else
    if ($_GET["book_number"]=="")
      $where="((textURN LIKE '".$urn.":".$_GET["line_number"]."') "
	."OR (textURN LIKE '".$urn.":".$_GET["line_number"]."-%')) ";
    else
        $where="((textURN LIKE '".$urn.":".$_GET["book_number"].".".$_GET["line_number"]."') "
	."OR (textURN LIKE '".$urn.":".$_GET["book_number"].".".$_GET["line_number"]."-%')) ";
  
  $tri=", CONVERT(SUBSTRING_INDEX(SUBSTRING_INDEX(textURN,':',-1),'-',1), SIGNED INTEGER) as nob, CONVERT(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(textURN,':',-1),'-',1),'.',-1), SIGNED INTEGER) as nol  ";
  $order=" ORDER BY CAST(nob AS int), CAST(nol as int)";
  $order=" ORDER BY nob, nol";


  $query="SELECT * ".$tri." FROM commentaries WHERE id_writer=".$_GET["id_writer"]." AND ".$where."".$order;// ORDER BY textURN";
  //    echo $query."<br/>";
  $result=$mysqli->query($query);
  
  $texte="\n<br />";
  $texte.="\n<center>";
  $texte.="\nBook : ".$_GET["book_number"]." - Line : ".$_GET["line_number"]."<br />";
  $texte.="\n</center>";
  $texte.="\n<br />";
  $texte.="\n<center><table class=\"table\">";
  $texte.="\n<thead><tr><th>Edit</th>";
  $texte.="<th>textURN</th>";
  $texte.="<th>Commentary</th>";
  $texte.="<th>Writer</th>";
  $texte.="\n<th>Preview</th></tr></thead>";
  while ($element = $result->fetch_object()) 
    {
      $elt=trouve_champs("site_users",Array("firstname","lastname"),$element->maj_id_site_user,$mysqli);
      $texte.="\n<tr>";
      $texte.="\n\t<td align=center><a href=\"table.php?prefixetable=&table=commentaries&quoi=modification&id=".$element->id_commentarie."\" "
	."class=\"image\" "
	."\n\ttitle=\"Created on ".sqltimestamp2txt($element->created_timestamp,"amjjhms").""
	."\nUpdated on ".sqltimestamp2txt($element->maj_timestamp,"amjjhms")." by ".$elt["firstname"]." ".$elt["lastname"]."\">"
	."\n\t<img src=\"images/Edit.png\"></a></td>";
      //".$element->nol."
      $texte.="\n\t<td>".substr($element->textURN,strlen($urn)+1)."</td>";  //$urn."<br />".$element->textURN."<br />".
      $texte.="\n\t<td>".substr($element->comment,0,20)."...</td>";
      $elt=trouve_champs("writers",array("lastname","firstname"),$element->id_writer,$mysqli);
      $texte.="\n\t<td align=center>".substr($elt["firstname"],0,1).". ".$elt["lastname"]."</td>";
      $texte.="\n\t<td></td>";
      $texte.="\n</tr>";
    }
  
  $texte.="\n</table><br /></center>";
  echo $texte;

}
else {
  $form="\n<form action=\"admin.php\" method=\"GET\">
<input type=\"hidden\" name=\"postaction\" value=\"UPDATE\">
<br />";
  $form.="\n<center><table class=\"table\">
<tr><th colspan=2 align=center>Search</th></tr>";
  if (isset($_GET["id_writer"])) {
    $form.="\n<tr><td align=right> Writer :</td>";
    $elt=trouve_champs("writers",array("lastname","firstname"),$_GET["id_writer"],$mysqli);
    $form.="\n<td>".$elt["lastname"]." ".$elt["firstname"]."</td></tr>";
    $form.="\n<input type=\"hidden\" name=\"id_writer\" value=\"".$_GET["id_writer"]."\" >";

    if (isset($_GET["id_author"])) {
      $form.="\n<tr><td align=right> Author :</td>";
      $elt=trouve_champs("authors",array("lastname","firstname"),$_GET["id_author"],$mysqli);
      $form.="\n<td>".$elt["lastname"]." ".$elt["firstname"]."</td></tr>";
      $form.="\n<input type=\"hidden\" name=\"id_author\" value=\"".$_GET["id_author"]."\" >";
      
      if (isset($_GET["id_work"])){
	$form.="\n<tr><td align=right> Work :</td>";
	$form.="\n<td>".trouve_champs("works",array("title"),$_GET["id_work"],$mysqli)."</td></tr>";
	$form.="\n<input type=\"hidden\" name=\"id_work\" value=\"".$_GET["id_work"]."\" >";
	$form.="\n<tr><td align=right> Book :</td>";
	$form.="\n<td><input type=\"text\" name=\"book_number\" size=\"3\" value=\"\"></td></tr>";
	$form.="\n<tr><td align=right> Line (approx.) :</td>";
	$form.="\n<td><input type=\"text\" name=\"line_number\" size=\"5\" value=\"\"></td></tr>";
      }
      else {
	$form.="\n<tr><td align=right> Work :</td>";
	$form.="\n<td><select name=\"id_work\">";
	$form.=select_option_condition("works",Array("title"),"id_work","WHERE id_author=".$_GET["id_author"]."",$mysqli);
	$form.="\n</select></td></tr>";
      }
    }
    else {
      $form.="\n<tr><td align=right> Author :</td>";
      $form.="\n<td><select name=\"id_author\">";
$form.=select_option_condition("authors",Array("lastname","firstname"),"id_author","WHERE id_author > 8",$mysqli);
//modif fait par SEB
      //$form.=select_option("authors",Array("lastname","firstname"),"id_author","",$mysqli);
      $form.="\n</select></td></tr>";
    }
  }
  else {
      $form.="\n<tr><td align=right> Writer :</td>";
      $form.="\n<td><select name=\"id_writer\">";
      $form.=select_option("writers",Array("lastname","firstname"),"id_writer","",$mysqli);
      $form.="\n</select></td></tr>";    
  }
  $form.="\n</table>";
  $form.="\n<br /><input type=\"submit\" name=\"submit\" value=\"Search\">";
  $form.="\n</center>";
  $form.="\n</form>";

echo $form;

}




/////////////////////////////////////////////////////////////////////////////////////////////
echo basdepage();
require_once("deconnexion.php");
/////////////////////////////////////////////////////////////////////////////////////////////
?>
