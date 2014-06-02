<?php

$table_details=Array("web"=>"Menus",
		     "champs"=>Array("id_site_menu","designation","title","menu","link","rank","id_site_accreditation","color","open",
				     "maj_timestamp","maj_id_site_user"),
		     "select"=>Array("defaut" =>" ORDER BY id_site_accreditation,rank"),
		     "nouveau"=>"New element",
		     "options"=>Array()
		     );

function affiche_table_site_menus_th()
{
  return("\n<th>Désignation</th><th>Menu</th><th>Rank</th><th>Accreditation</th><th></th>");
}


function affiche_table_site_menus_tds($element,$bd)
{
  $txt="<td>".$element->designation."</td>";
  $txt.="<td>".$element->menu."</td>";
  $txt.="<td>".$element->rank."</td>";
  $elt=trouve_champs("site_accreditations",Array("accreditation"),$element->id_site_accreditation,$bd);
  $txt.="\n<td align=center>".$elt."</td>";
  if ($element->open)
    $txt.="\n<td><img src=\"images/Checked.png\" /></td>";
  else
    $txt.="\n<td></td>";
  
  return($txt);
}


function affiche_formulaire_site_menus($element,$bd)
{
  $texte="\n<tr><td align=right> Designation :</td>";
  $texte.="\n<td><input type=\"text\" name=\"designation\" value=\""
    .$element->designation."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Title :</td>";
  $texte.="\n<td><input type=\"text\" name=\"title\" value=\""
    .$element->title."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Menu :</td>";
  $texte.="\n<td><input type=\"text\" name=\"menu\" value=\""
    .$element->menu."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Rank :</td>";
  $texte.="\n<td><input type=\"text\" name=\"rank\" value=\""
    .$element->rank."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Link :</td>";
  $texte.="\n<td><input type=\"text\" name=\"link\" value=\""
    .$element->link."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right>Accreditation :</td>";
  $texte.="\n<td><select name=\"id_site_accreditation\">";
  $texte.=select_option("site_accreditations",Array("accreditation"),"id_site_accreditation",
                        $element->id_site_accreditation,$bd);
  $texte.="\n</select></td></tr>";
  $texte.="\n<tr><td align=right> Color :</td>";
  $texte.="\n<td><input type=\"text\" name=\"color\" value=\""
    .$element->color."\" size=30></td></tr>";
  $texte.="\n<tr><td align=right> Open :</td>";
  $texte.="\n<td><select name=\"open\">";
  $texte.=select_option_array(array("oui"=>1,"non"=>0),$element->open);
  $texte.="\n</select></td></tr>";

  return($texte);
}


?>