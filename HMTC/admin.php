<?php

/////////////////////////////////////////////////////////////////////////////////////////////
require_once("outils.php");
/////////////////////////////////////////////////////////////////////////////////////////////
$head="";
echo hautdepage("Admin-Accueil",$head);
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
echo "<script type=\"text/javascript\" src=\"js/wz_tooltip.js\"></script>
<script type=\"text/javascript\" src=\"js/tip_balloon.js\"></script>
<script type=\"text/javascript\" src=\"js/tip_centerwindow.js\"></script>
";



function Reduire_Chaine($string, $word_limit, $lien)
{
  $string=strip_tags($string);
  $words = explode(" ", $string, ($word_limit + 1));
  if(count($words) > $word_limit){
    array_pop($words);
    $fin=" <a href=\"".$lien."\">[more]</a>";
  }else
    $fin="";
  return implode(" ", $words).$fin;
}


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

//////////////////////////////////////////////////////////////////////////////////////////////
$spans="";
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
      $texte.="\n\t<td align=center ><a  class=\"image\" href=\"javascript:void(0)\" onmouseover=\"TagToTip('n".$element->id_commentarie."',STICKY,true,CLICKCLOSE,true,CLOSEBTN,true,TITLE,'Commentarie', BGCOLOR,'#FFFFFF',BORDERCOLOR,'#AAAAAA',SHADOW, true, SHADOWWIDTH,1)\" onmouseout=\"Untip()\"><img src=\"images/Search.png\"></a></td>";
      
      
      $spans.="\n\t<span id=\"n".$element->id_commentarie."\">
      	<ul>";
      //	<li><b>Writer</b> : ";
      //      $elt=trouve_champs("writers",Array("firstname","lastname"),$_GET["id_writer"],$mysqli);
      //      $spans.=$elt["firstname"]." ".$elt["lastname"]." </li>
      //      //	<li> <b>Author </b> : Homer</li>
      //	<li><b>work</b>: Odyssey</li>
      //	<li><b>Boock</b>: 1
      //      <li><b>Comment</b>: "
      $elt=trouve_champs("commentaries",Array("comment","type"),$element->id_commentarie,$mysqli);
      $spans.="      <li><b>Type</b>: ".$elt["type"]."</li>";
      $spans.="<li><b>Comment</b>: <i>";

      $spans.=Reduire_Chaine($elt["comment"], 10, "more_table_id.php?id_writer=".$_GET["id_writer"]."&id_author=".$_GET["id_author"]."&id_work=".$_GET["id_work"]."&table=commentaries&id=".$element->id_commentarie."\" target=\"_blank\"");


      $spans.="</li>
	</ul>
</span>";
      $texte.="\n</tr>";
    }
  
  $texte.="\n</table><br /></center>";
  echo $texte;
  echo $spans;

} //if (isset($_GET["line_number"])) {
else {
  $form="\n<form action=\"admin.php\" method=\"GET\">
<input type=\"hidden\" name=\"postaction\" value=\"UPDATE\">
<br />";
  $form.="\n<center><table class=\"table\">
<tr><th colspan=2 align=center>Start</th></tr>";
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
    //////////////////////////////////////////////////////////////////////////////////////////////
      else {
	$form.="\n<tr><td align=right> Work :</td>";
	$form.="\n<td>";
	$query="SELECT * FROM works WHERE id_author=".$_GET["id_author"]." ORDER BY title";
	$result=$mysqli->query($query);
	while ($element = $result->fetch_object())  {
	  $form.="<a class=\"image\" href=\"admin.php?postaction=UPDATE&id_writer=".$_GET["id_writer"]."&id_author=".$_GET["id_author"]."&id_work=".$element->id_work."&submit=Search\">".$element->title."</a><br />";
	}
	
	//	$form.=select_option_condition("works",Array("title"),"id_work","WHERE id_author=".$_GET["id_author"]."",$mysqli);
	$form.="\n</td></tr>";
      }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    else {
      $form.="\n<tr><td align=right> Author :</td>";
      $form.="\n<td>";
      $query="SELECT * FROM authors WHERE id_author>8 ORDER BY lastname";
      $result=$mysqli->query($query);
      while ($element = $result->fetch_object())  {
	$form.="<a class=\"image\" href=\"admin.php?postaction=UPDATE&id_writer=".$_GET["id_writer"]."&id_author=".$element->id_author."&submit=Search\">".$element->lastname." ".$element->firstname."</a><br />";
      }
      //      $form.=select_option_condition("authors",Array("lastname","firstname"),"id_author","WHERE id_author > 8",$mysqli);
      //modif fait par SEB
      //$form.=select_option("authors",Array("lastname","firstname"),"id_author","",$mysqli);
      $form.="\n</td></tr>";
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////
  else {
      $form.="\n<tr><td align=right> Writer :</td>";
      $form.="\n<td>";
      $query="SELECT * FROM writers ORDER BY lastname";
      $result=$mysqli->query($query);
      while ($element = $result->fetch_object())  {
	$form.="<a class=\"image\" href=\"admin.php?postaction=UPDATE&id_writer=".$element->id_writer."&submit=Search\">".$element->lastname." ".$element->firstname."</a><br />";
      }
      //      $form.=select_option("writers",Array("lastname","firstname"),"id_writer","",$mysqli);
      $form.="\n</td></tr>";    
  }
  $form.="\n</table>";
  $form.="\n<br /><input type=\"submit\" name=\"submit\" value=\"Search\">";
  $form.="\n</center>";


  if (isset($_GET["id_work"])) {
    $form.="<div align=\"right\"><a href=\"table.php?prefixetable=&table=commentaries&quoi=modification&postaction=INSERT&id_writer=".$_GET["id_writer"]."&id_author=".$_GET["id_author"]."&id_work=".$_GET["id_work"]."&submit=Search\" class=\"image\">Add a new record</a></div>";
  }

  $form.="\n</form>";

echo $form;
}




/////////////////////////////////////////////////////////////////////////////////////////////
echo basdepage();
require_once("deconnexion.php");
/////////////////////////////////////////////////////////////////////////////////////////////
?>
