<?php

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_finale() {
  //print_r($_SESSION);
  $html="";
  $tab=array(
	     "Premier mél"=>"finale_premier_mel.php",
	     "Pré-inscriptions"=>"finale_preinscriptions.php",
	     "Inscrits"=>"finale_inscriptions.php",
	     );
  $html.=sousmenu_array("Finale Inscriptions","h1",$tab);

  
  if (($_SESSION["login"]=="cassel")) {
    $tab=array(
	       "Documents"=>"finale_documents.php",
	       "Gestion des scores"=>"finale_scores.php");
    $html.=sousmenu_array("Finale Organisation","h1",$tab);
  }  
  if ($_SESSION["accreditation"]=="Super-Utilisateur") {
    $tab=array(
	       "Documents"=>"finale_documents.php",
	       "Gestion des scores"=>"finale_scores.php",
	       "Orbites"=>"table.php?prefixetable=finale&table=finale_orbites&quoi=contenu&detail=defaut",
	       "Emplacements"=>"table.php?prefixetable=finale&table=finale_emplacements&quoi=contenu&detail=defaut",
	       "Arbitres"=>"table.php?prefixetable=finale&table=finale_arbitres&quoi=contenu&detail=defaut",
	       "&Eacute;quipes"=>"table.php?prefixetable=finale&table=finale_equipes&quoi=contenu&detail=defaut",
	       "Gestion documents"=>"table.php?prefixetable=finale&table=finale_documents&quoi=contenu&detail=defaut",
	       );
    $html.=sousmenu_array("Finale Organisation","h1",$tab);
  }


  $tab=array(
	     "Demandes"=>"bus_demandes.php",
	     "Devis"=>"table.php?prefixetable=bus&table=bus_devis&quoi=contenu&detail=defaut",
	     "Entreprises"=>"table.php?prefixetable=bus&table=bus_entreprises&quoi=contenu&detail=defaut",
	     "Chauffeurs"=>"table.php?prefixetable=bus&table=bus_chauffeurs&quoi=contenu&detail=defaut",
	     "Arrêts"=>"table.php?prefixetable=bus&table=bus_arrets&quoi=contenu&detail=defaut",
	     "Heures"=>"table.php?prefixetable=bus&table=bus_heures&quoi=contenu&detail=defaut",
	     "Lignes"=>"table.php?prefixetable=bus&table=bus_lignes&quoi=contenu&detail=defaut",
	     "Horaires"=>"table.php?prefixetable=bus&table=bus_horaires&quoi=contenu&detail=defaut",
	     );
  $html.=sousmenu_array("Bus","h1",$tab);
  
  return($html);
}
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_logistique() {
  $tab=array(
	     "Dépôt"=>"index_participant_logistique_depot.php",
	     "Orbites"=>"index_participant_logistique_orbites.php",
	     "Modifications des données"=>"index_participant_logistique_modif.php",
	     );
  return(sousmenu_array("Logistique","h1",$tab));
}
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_reservations() {
  $html="";
  if (isset($_GET["mois"])) 
    $mois=$_GET["mois"];
  else {
    $today = getdate();
    $mois=$today["mon"];
  }
  $tab=array(
	     "Nombre de réservations"=>"qualifications_reservations.php?quoi=reservations&mois=".$mois."",
	     "Nombre de valises"=>"qualifications_reservations.php?quoi=valises&mois=".$mois."",
	     );
  $html.=sousmenu_array("Réservations","h1",$tab);

  $tab=array(
	     "Jours à venir"=>"qualifications_valises.php",
	     "Qualifications"=>"qualifications_valises.php?tout=oui",
	     );
  $html.=sousmenu_array("Valises","h1",$tab);

  return($html);
}
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_lecontact($designation) {
  $tab=menu($designation,88,"array");
  foreach($tab as $cle=>$valeur)
    if (strstr($valeur,"?"))
      $tab[$cle]=$valeur."&alea=".$_GET["alea"];
    else
      $tab[$cle]=$valeur."?alea=".$_GET["alea"];

  unset($tab["Déconnexion"]);
  unset($tab["Accueil"]);
   
  return(sousmenu_array("Menu perso","h1",$tab));

}
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_ail() {
  global $mysqli;

  $query="SELECT DISTINCT(qe.id_qualifications_etablissement), qe.collyc, qe.pripub, qe.nom, qe.code_postal, qe.ville "
    ."FROM ".BDD_PREFIXE."qualifications_etablissements qe, ".BDD_PREFIXE."qualifications_reservations qr, "
    .BDD_PREFIXE."ail_transactions_attentes ata "
    ."WHERE qe.id_qualifications_etablissement=ata.id_qualifications_etablissement "
    ."AND  qe.id_qualifications_etablissement NOT IN "
    ."  (SELECT qe.id_qualifications_etablissement "
    ."   FROM ".BDD_PREFIXE."qualifications_etablissements qe, ".BDD_PREFIXE."qualifications_reservations qr, ".BDD_PREFIXE."ail_transactions at "
    ."   WHERE qr.id_qualifications_reservation=at.id_qualifications_reservation "
    ."   AND qe.id_qualifications_etablissement=qr.id_qualifications_etablissement ) "
    ."ORDER BY nom";
  //echo $query."<br />";
  $result=$mysqli->query($query);
  $title="";
  //$title.="\n<ul>";
  while($row=$result->fetch_object())
    $title.="\n".$row->collyc." ".$row->pripub." ".$row->nom." (".$row->code_postal." - ".$row->ville.")";
  // $title.="\n<li>".$row->collyc." ".$row->pripub." ".$row->nom." (".$row->code_postal." - ".$row->ville.")</li>";
  //  $title.="\n</ul>";
  

  $tab=array(
	     "ayant payés"=>"ail_bus.php?bus=1&ordre=nom&sens=ASC",
	     //	     "aze"=>"-",
	     "n'ayant pas payés"=>"ail_bus.php?bus=0&ordre=qr.souhait_timestamp&sens=ASC",
	     );
  $temp=sousmenu_array("Bus","h1",$tab);

  $tab=array(
	     "adhérents"=>"ail_adhesions.php?adh=1&ordre=nom&sens=ASC",
	     //	     "aze"=>"-",
	     "non adhérents"=>"ail_adhesions.php?adh=0&ordre=qr.souhait_timestamp&sens=ASC",
	     "qsd"=>"-",
	     "souhaitant adhérer"=>array(
					 "href"=>"index_participant_etablissement.php?quoi=modification",
					 "title"=>$title,
					 ),	     );
  $temp.=sousmenu_array("Adhésions","h1",$tab);

  $tab=array(
	     "Adhésions"=>"ail_finances.php?quoi=Adhésion",
	     );
  $temp.=sousmenu_array("Finances","h1",$tab);

  // $tab=array(
  // 	     "&Eacute;tab. payés"=>"ail_bus.php?adh=1&ordre=nom&sens=ASC",
  // 	     "-"=>"-",
  // 	     "&Eacute;tab. non payés"=>"ail_bus.php?adh=0&ordre=qr.souhait_timestamp&sens=ASC",
  // 	     );
  // $temp.=sousmenu_array("Bus","h1",$tab);
  if (!(isset($_GET["alea"])))
    return($temp);
  else
    return("");

}
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_contacts() {
  $tab=array(
	     "Avec réservation"=>"contacts.php?resa=1&ordre=nom&sens=ASC",
	     "Sans réservation"=>"contacts.php?resa=0&ordre=nom&sens=ASC",
	     );
  return(sousmenu_array("Contacts","h1",$tab));
}
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_public() {
  if (isset($_SESSION["id_site_accreditation"]) and ($_SESSION["id_site_accreditation"]<99))    
    return(sousmenu_designation("Site Public","h1","Rallye-",99));
}
///////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_tables() {
  global $les_tables;
  //Si on est dans le fichier table
  $html="";
  if (isset($_SESSION["id_site_accreditation"]) and ($_SESSION["id_site_accreditation"]==10) 
      and (substr(end(explode("/",$_SERVER['SCRIPT_NAME'])),0,5)=="table")) {
    ///////////////////////////////////////////// 
    // Tables d'une série de "prefixetable"
    if ((isset($_GET["prefixetable"])) and isset($les_tables[$_GET["prefixetable"]])) {
      $tab=array();
      foreach ($les_tables[$_GET["prefixetable"]] as $table => $elements)
	$tab[ucfirst($table)]="table.php?prefixetable=".$_GET["prefixetable"]."&"
	."table=".$_GET["prefixetable"]."_".$table."&quoi=contenu&detail=defaut";
      $html.=sousmenu_array($_GET["prefixetable"],"h1",$tab);
    }
    ///////////////////////////////////////////// 
    // les "prefixetable"
    $tab=array();
    foreach ($les_tables as $prefixetable => $elements)
      $tab[ucfirst($prefixetable)]="table.php?prefixetable=".$prefixetable; 
    $html.=sousmenu_array("Tables","h1",$tab);
  }
  return($html);  
}
///////////////////////////////////////////////////////////////////////////////////////////
function menu($designation,$id_site_accreditation=999,$format="html") {
  global $mysqli;
  $array=array();
  $html="
      <ul>";

    
  
 if (isset($_SESSION["id_site_accreditation"])){
  if ($id_site_accreditation==999)
    $id_site_accreditation_temp=$_SESSION["id_site_accreditation"];
  else
    $id_site_accreditation_temp=$id_site_accreditation;
   
   $query="SELECT * FROM ".BDD_PREFIXE."site_menus "
     ."WHERE (".$id_site_accreditation_temp."<=id_site_accreditation) "
     ."and (id_site_accreditation>=10) "
     ."and not(".$id_site_accreditation_temp."<99 and id_site_accreditation=99) "
     ."and not(".$id_site_accreditation_temp."<88 and id_site_accreditation=88) "
     ."and open " 
     ."ORDER BY rank";
   //   echo $query."<br />";
   $result=$mysqli->query($query);
   while ($element = $result->fetch_object()) 
     {
       $html.="\n        \t<li><a ";
       if ($element->designation==$designation)
	 $html.="id=\"selected\" ";
       $html.="href=\"".$element->link."\">".$element->menu."</a></li>";    
       $array[$element->menu]=$element->link;
     }
 }
 $html.="
      </ul>";
 if ($format=="html")
   return($html);
 else
  return($array);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function designation_tableau($prefixe,$isa)
{
  global $mysqli; 
  //Retourne sous forme de tableau les items du menu dont la designation 
  //commence par $prefixe et dont l'id d'accréditation est $isa
  $tab=array();
  $querytsb="SELECT * FROM ".BDD_PREFIXE."site_menus "
    ."WHERE id_site_accreditation=".$isa." "
    ."and designation LIKE '".$prefixe."%' "
    ."and open";
  //echo $querytsb."<br />";
  $resulttsb=$mysqli->query($querytsb);
  while ($elementtsb = $resulttsb->fetch_object()) 
    $tab[$elementtsb->menu]=$elementtsb->link;
  return($tab);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_designation($titre,$hi,$prefixe,$isa)
{
  global $mysqli;
  //Retourne le sous menu constitué des items du menu dont la designation 
  //commence par $prefixe et dont l'id d'accréditation est $isa et 
  //porte de le titre $titre en <$hi>
  $tableau=designation_tableau($prefixe,$isa);
  return(sousmenu_array($titre,$hi,$tableau));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sousmenu_array($titre,$hi,$tableau)
{
  //Retourne le sous menu constitué des $texte => $link de $tableau
  //et porte de le titre $titre en <$hi>
  $html="
        <div class=\"sidebaritem\">
          <div class=\"rtop\"><div class=\"r1\"></div><div class=\"r2\"></div><div class=\"r3\"></div><div class=\"r4\"></div></div>
          <".$hi.">".$titre."</".$hi.">
          <div class=\"sbilinks\">
            <!-- **** INSERT ADDITIONAL LINKS HERE **** -->
            <ul>";
  foreach ($tableau as $texte => $link){
    //echo $texte."<br />";
    if (is_array($link))
      $html.="\n        <li><a title=\"".$link["title"]."\" href=\"".$link["href"]."\">".$texte."</a></li>";      
    else {
      if ($link=="-")
	$html.="\n        <hr />";
      else
	$html.="\n        <li><a href=\"".$link."\">".$texte."</a></li>";      
    }
  }
  $html.="
            </ul>
          </div> <!-- sbilinks -->
          <div class=\"rbottom\"><div class=\"r4\"></div><div class=\"r3\"></div><div class=\"r2\"></div><div class=\"r1\"></div></div>
        </div> <!-- sidebaritem -->";
  return($html);
}


?>