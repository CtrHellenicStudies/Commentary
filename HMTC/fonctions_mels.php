<?php

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_finale_publication_resultats($idqc,$bd) {


  $query="SELECT fi.*, qc.genre, qc.nom as qcnom, qc.prenom as qcprenom, qc.alea, qc.mel, qe.collyc, qe.pripub, qe.nom, qe.ville,  "
    ."qr.souhait_nb_equipes  "
    ."FROM ".BDD_PREFIXE."finale_inscriptions fi, ".BDD_PREFIXE."qualifications_contacts qc, ".BDD_PREFIXE."qualifications_etablissements qe, ".BDD_PREFIXE."qualifications_reservations qr "
    ."WHERE qr.id_qualifications_etablissement=qe.id_qualifications_etablissement AND qc.id_qualifications_contact=qr.id_qualifications_contact "
    ."AND qc.id_qualifications_contact=".$idqc." AND fi.id_qualifications_contact=qc.id_qualifications_contact ";
      //$query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$idqc."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $row = $result->fetch_object();
  
  $le_mail="";

  if ($row->genre=="M.")
    $le_mail.="Cher collègue, ";
  else
    $le_mail.="Chère collègue, ";
  
  $le_mail.="

Nous vous remercions pour votre participation au Rallye Mathématique des Collèges de l’IREM de Lille. Le classement de la finale est visible à l’adresse suivante :
http://rallye-irem.univ-lille1.fr/index_participant_finale_resultats.php?alea=".$row->alea."

Nous espérons vous compter à nouveau parmi les participants l’an prochain.

Cordialement,
Les organisateurs
";

  //  echo $le_mail;exit;
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$row->mel."","IREM de Lille : Rallye des collèges - Résultats","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[FinalePublicationResultats] : ".$row->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_finale_inscription_infobus($idfi,$bd) {

  $query="SELECT fi.*, qc.genre, qc.nom as qcnom, qc.prenom as qcprenom, qc.mel, qc.alea, qe.collyc, qe.pripub, qe.nom, qe.ville,  "
    ."qr.souhait_nb_equipes  "
    ."FROM ".BDD_PREFIXE."finale_inscriptions fi, ".BDD_PREFIXE."qualifications_contacts qc, ".BDD_PREFIXE."qualifications_etablissements qe, ".BDD_PREFIXE."qualifications_reservations qr "
    ."WHERE qr.id_qualifications_etablissement=qe.id_qualifications_etablissement AND qc.id_qualifications_contact=qr.id_qualifications_contact "
    ."AND fi.id_finale_inscription=".$idfi." AND fi.id_qualifications_contact=qc.id_qualifications_contact ";
      //$query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$idqc."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $row = $result->fetch_object();
  


  if ($row->genre=="M.")
    $le_mail="Cher collègue, ";
  else
    $le_mail="Chère collègue, ";
  
  $uns="";
  $votre="votre";
  $sera="sera";
  if ($row->nb_equipes_finale>1) {
    $uns="s";
    $votre="vos";
    $sera="seront";
  }
  
  $le_mail.="

Les détails pratiques du transport (heure de passage, lieu précis d'arrêt...) viennent d'être mis à jour sur votre page : 

http://rallye-irem.univ-lille1.fr/index_participant_finale_participation.php?alea=".$row->alea."

Merci d'enregistrer ".$votre." équipe".$uns." dès votre arrivée sur le lieu de la finale. 

";
  
  $le_mail.="Nous vous remercions par avance de votre disponibilité et de votre ponctualité pour cet événement.

";


 $le_mail.="Rallyement vôtre,\n\nLes organisateurs\n
";

  //  echo $le_mail;exit;
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$row->mel."","IREM de Lille : Rallye des collèges - Informations Transport","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[FinaleInscriptionInfobus] : ".$row->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_finale_inscription_confirmation($idfi,$bd) {

  $query="SELECT fi.*, qc.genre, qc.nom as qcnom, qc.prenom as qcprenom, qc.mel, qc.alea, qe.collyc, qe.pripub, qe.nom, qe.ville,  "
    ."qr.souhait_nb_equipes  "
    ."FROM ".BDD_PREFIXE."finale_inscriptions fi, ".BDD_PREFIXE."qualifications_contacts qc, ".BDD_PREFIXE."qualifications_etablissements qe, ".BDD_PREFIXE."qualifications_reservations qr "
    ."WHERE qr.id_qualifications_etablissement=qe.id_qualifications_etablissement AND qc.id_qualifications_contact=qr.id_qualifications_contact "
    ."AND fi.id_finale_inscription=".$idfi." AND fi.id_qualifications_contact=qc.id_qualifications_contact ";
      //$query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$idqc."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $row = $result->fetch_object();
  


  if ($row->genre=="M.")
    $le_mail="Cher collègue, ";
  else
    $le_mail="Chère collègue, ";
  
  $uns="";
  $votre="votre";
  $sera="sera";
  if ($row->nb_equipes_finale>1) {
    $uns="s";
    $votre="vos";
    $sera="seront";
  }
  
  $le_mail.="

Nous vous confirmons l'inscription de votre établissement, le ".$row->collyc." ".$row->pripub." ".$row->nom." de ".$row->ville.", à la finale du Rallye Mathématique des collèges ".ANNEE." pour ".$row->nb_equipes_finale." équipe".$uns.".

";
  if ($row->id_bus_ligne==0)
    $le_mail.="Vous n'avez pas demandé de transport en bus.

Nous vous attendons le ".strtolower(timestamp2txt(strtotime(FINALE),"jjma"))." au bâtiment M1 de l'Université Lille 1 au plus tard à 13h15 pour l'enregistrement de ".$votre." équipe".$uns.".

";
 else
   $le_mail.="Vous avez demandé le transport en bus à partir de l’arrêt \"".$row->arret_demande."\".

Toutes les informations concernant votre inscription à la finale du Rallye Mathématique des Collèges ".ANNEE." sont consultables à l'adresse :
http://rallye-irem.univ-lille1.fr/index_participant_finale_participation.php?alea=".$row->alea."

Les détails pratiques du transport (heure de passage, lieu précis d'arrêt...) seront affichés sur cette page dès qu'ils seront en notre possession. Les bus seront organisés afin d'être sur le campus pour 12h45.

Merci d'enregistrer ".$votre." équipe".$uns." dès votre arrivée sur le lieu de la finale. 

";
  
  $le_mail.="Nous vous remercions par avance de votre disponibilité et de votre ponctualité pour cet événement.

";


 $le_mail.="Rallyement vôtre,\n\nLes organisateurs\n
";

  //  echo $le_mail;exit;
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$row->mel."","IREM de Lille : Rallye des collèges - Confirmation Inscription Finale","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[FinaleInscriptionConfirmation] : ".$row->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_finale_inscription_bug($idqc,$bd) {

  $query="SELECT fi.*, qc.genre, qc.nom as qcnom, qc.prenom as qcprenom, qc.mel, qe.collyc, qe.pripub, qe.nom, qe.ville,  "
    ."qr.souhait_nb_equipes  "
    ."FROM ".BDD_PREFIXE."finale_inscriptions fi, ".BDD_PREFIXE."qualifications_contacts qc, ".BDD_PREFIXE."qualifications_etablissements qe, ".BDD_PREFIXE."qualifications_reservations qr "
    ."WHERE qr.id_qualifications_etablissement=qe.id_qualifications_etablissement AND qc.id_qualifications_contact=qr.id_qualifications_contact "
    ."AND qc.id_qualifications_contact=".$idqc." AND fi.id_qualifications_contact=qc.id_qualifications_contact ";
      //$query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$idqc."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $row = $result->fetch_object();
  
  $le_mail="";

  if ($row->genre=="M.")
    $le_mail.="Cher collègue, ";
  else
    $le_mail.="Chère collègue, ";
  
  $le_mail.="

Suite à un problème technique, le lien que vous avez reçu dans le mél de confirmation de votre demande d'inscription à la finale (copie ci-dessous) n'était pas actif. Nous remercions les collègues qui nous ont signalé ce disfonctionnement. 

Nous avons rétabli ce lien. Vous pouvez donc désormais imprimer le courrier destiné à votre chef d'établissement.

Cordialement,
Les organisateurs

==========================================================================================================

";




  if ($row->genre=="M.")
    $le_mail.="Cher collègue, ";
  else
    $le_mail.="Chère collègue, ";

  $uns="";
  if ($row->nb_equipes_finale>1)
    $uns="s";
  $le_mail.="

Nous accusons réception de la demande d'inscription de votre établissement, le ".$row->collyc." ".$row->pripub." ".$row->nom." de ".$row->ville.", à la finale du Rallye Mathématique des Collèges ".ANNEE." pour ".$row->nb_equipes_finale." équipe".$uns.". 

";
  if ($row->id_bus_ligne==0)
    $le_mail.="Vous n'avez pas demandé de transport en bus.";
 else
   $le_mail.="Vous avez demandé le transport en bus à partir de l’arrêt \"".$row->arret_demande."\". ";
  
  $le_mail.="

Vous trouverez à l’adresse suivante un courrier à remettre à votre Chef d’Établissement :
http://rallye-irem.univ-lille1.fr/fichiers/finale_fax_principaux/Chef_Etab_".$row->id_finale_inscription.".pdf

Ce courrier doit être complété et nous être retourné par fax avant le ".strtolower(timestamp2txt(strtotime(FINALE_LIMITE_FAX),"jjma")).". Nous validerons votre inscription à la réception de ce courrier. ";

  if ($row->id_bus_ligne!=0)
    $le_mail.="Vous aurez alors accès aux renseignements détaillés concernant le transport en bus.";
 $le_mail.="

Rallyement vôtre,\n\nLes organisateurs\n
";

  //  echo $le_mail;exit;
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$row->mel."","IREM de Lille : Rallye des collèges - Finale","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[FinaleInscription] : ".$row->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_finale_inscription($idqc,$bd) {

  $query="SELECT fi.*, qc.genre, qc.nom as qcnom, qc.prenom as qcprenom, qc.mel, qe.collyc, qe.pripub, qe.nom, qe.ville,  "
    ."qr.souhait_nb_equipes  "
    ."FROM ".BDD_PREFIXE."finale_inscriptions fi, ".BDD_PREFIXE."qualifications_contacts qc, ".BDD_PREFIXE."qualifications_etablissements qe, ".BDD_PREFIXE."qualifications_reservations qr "
    ."WHERE qr.id_qualifications_etablissement=qe.id_qualifications_etablissement AND qc.id_qualifications_contact=qr.id_qualifications_contact "
    ."AND qc.id_qualifications_contact=".$idqc." AND fi.id_qualifications_contact=qc.id_qualifications_contact ";
      //$query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$idqc."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $row = $result->fetch_object();
  


  if ($row->genre=="M.")
    $le_mail="Cher collègue, ";
  else
    $le_mail="Chère collègue, ";
  



  $uns="";
  if ($row->nb_equipes_finale>1)
    $uns="s";
  $le_mail.="

Nous accusons réception de la demande d'inscription de votre établissement, le ".$row->collyc." ".$row->pripub." ".$row->nom." de ".$row->ville.", à la finale du Rallye Mathématique des Collèges ".ANNEE." pour ".$row->nb_equipes_finale." équipe".$uns.". 

";
  if ($row->id_bus_ligne==0)
    $le_mail.="Vous n'avez pas demandé de transport en bus.";
 else
   $le_mail.="Vous avez demandé le transport en bus à partir de l’arrêt \"".$row->arret_demande."\". ";
  
  $le_mail.="

Vous trouverez à l’adresse suivante un courrier à remettre à votre Chef d’Établissement :
http://rallye-irem.univ-lille1.fr/fichiers/finale_fax_principaux/Chef_Etab_".$row->id_finale_inscription.".pdf

Ce courrier doit être complété et nous être retourné par fax avant le ".strtolower(timestamp2txt(strtotime(FINALE_LIMITE_FAX),"jjma")).". Nous validerons votre inscription à la réception de ce courrier. ";

  if ($row->id_bus_ligne!=0)
    $le_mail.="Vous aurez alors accès aux renseignements détaillés concernant le transport en bus.";
 $le_mail.="

Rallyement vôtre,\n\nLes organisateurs\n
";

  //  echo $le_mail;exit;
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$row->mel."","IREM de Lille : Rallye des collèges - Inscription Finale","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[FinaleInscription] : ".$row->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_finale_premier($idqc,$bd) {

  $query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$idqc."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $row = $result->fetch_object();

  if ($row->genre=="M.")
    $le_mail="Cher collègue, ";
  else
    $le_mail="Chère collègue, ";


  $relance="";
  $sujet_relance="";
  if ($row->finale_mel_timestamp!="0000-00-00 00:00:00") {
    if ($row->finale_participation=="oui") {
      $sujet_relance="Relance";
      $relance.=$le_mail;
      $relance.="\nVous avez accepté de participer à la ".EDITION." finale du Rallye Mathématique des Collèges du ".strtolower(timestamp2txt(strtotime(FINALE),"jjma")).".";
      $relance.="\nSauf erreur de notre part, nous n'avons pas reçu votre demande d'inscription. "
	."Nous vous rappelons que la date limite d'inscription est fixée au ".strtolower(timestamp2txt(strtotime(FINALE_LIMITE_INSCRIPTION),"jjma")).".";
      $relance.="\nNous nous permettons de vous envoyer de nouveau le mél rappelant l'adresse où vous pouvez déposer votre demande. ";
      $relance.="\nRallyement vôtre,\nLes organisateurs\n";
      $relance.="\n-------------------------------------------------------\n\n";
    }
    else {
      $sujet_relance="Relance";
      $relance.=$le_mail;
      $relance.="\nNous vous avons envoyé le ".strtolower(timestamp2txt(strtotime($row->finale_mel_timestamp),"jjma"))." un mél détaillant la démarche d'inscription à la "
	.EDITION." finale du Rallye Mathématique des Collèges du ".strtolower(timestamp2txt(strtotime(FINALE),"jjma")).".";
      $relance.="\nNous nous permettons de vous l'envoyer de nouveau en vous rappelant la date limite d'inscription fixée au "
	.strtolower(timestamp2txt(strtotime(FINALE_LIMITE_INSCRIPTION),"jjma")).".";
      $relance.="\nRallyement vôtre,\nLes organisateurs\n";
      $relance.="\n-------------------------------------------------------\n\n";
    }
  }

$le_mail.="

Nous vous donnons rendez-vous le ".strtolower(timestamp2txt(strtotime(FINALE),"jjma"))." pour la ".EDITION." finale du Rallye Mathématique des Collèges, qui se déroulera à Villeneuve d'Ascq sur le campus de l'Université Lille 1 de 13h30 à 18h30 (environ).

Nous sollicitons de votre part la plus grande rigueur dans la démarche d'inscription à la finale de cette compétition pour que nous puissions l'organiser dans les meilleures conditions. 

Quelle que soit votre situation, nous vous demandons de cliquer sur le lien situé à la fin de ce message et qui vous est personnel. Il vous permettra d'accuser réception de ce message. Il vous permettra également d'entamer la procédure d'inscription à la finale.

Si votre établissement participe à la finale :
- l'inscription est à réaliser avant le ".strtolower(timestamp2txt(strtotime(FINALE_LIMITE_INSCRIPTION),"jjma")).", délai de rigueur. Elle sera confirmée dès le ".strtolower(timestamp2txt(strtotime(FINALE_REPONSE),"jjma")).". Toute inscription non complétée à cette date entraînera automatiquement la non-participation de l'établissement à la finale.
- les épreuves de la finale débuteront à 13H30 par la présentation des énigmes aux arbitres (c'est-à-dire vous) et par l'explication du déroulement de l'après-midi aux élèves. Vous devrez donc avoir enregistré votre arrivée à 13h15 au plus tard dans le hall du bâtiment M1 de l'Université Lille 1. Nous demandons à chaque arbitre de se munir de stylo et d'une montre ou chronomètre.
 
L'Association des Amis de l'IREM de Lille met en place des transports en bus selon trois trajets dont les arrêts se feront dans les villes suivantes :
- Côte d’Opale : Boulogne, Grande Synthe, Steenvorde 
- Pas de Calais : Arras, Avion, Auby
- Avesnois : Fourmies, Maubeuge, Valenciennes
La localisation exacte des arrêts sera précisément définie à la clôture des inscriptions.
Une participation financière est demandée à tout collège désirant profiter du transport en bus, cette participation est de 40 € par équipe (chèque à l’ordre de l'Association des Amis de l'IREM de Lille). L'inscription pour les bus sera enregistrée et confirmée à réception du règlement.

Nous vous remercions par avance de votre disponibilité et de votre ponctualité.

Rallyement vôtre,\n\nLes organisateurs\n

Lien personnel pour la finale : 
http://rallye-irem.univ-lille1.fr/index_participant_finale_participation.php?alea=".$row->alea."";

 $le_mail=$relance.$le_mail;

  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$row->mel."","IREM de Lille : Rallye des collèges - Préinscription Finale","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[FinalePremierMel".$sujet_relance."] : ".$row->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_attrib_def($id_qualifications_reservation,$bd) {
  $query="SELECT qr.id_qualifications_contact, qr.souhait_nb_valises, UNIX_TIMESTAMP(qr.souhait_timestamp) as souhait_timestamp, qe.pripub, qe.nom, qe.ville  "
    ."FROM ".BDD_PREFIXE."qualifications_reservations qr, ".BDD_PREFIXE."qualifications_etablissements qe "
    ."WHERE qr.id_qualifications_reservation='".$id_qualifications_reservation."' AND qr.id_qualifications_etablissement=qe.id_qualifications_etablissement "
    ."ORDER BY depot_timestamp DESC ";
  //echo $query."<br />";
  $result=$bd->query($query);
  $resa = $result->fetch_object();

  $query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$resa->id_qualifications_contact."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $element = $result->fetch_object();


  $le_mail = "Bonjour ".$element->prenom." ".$element->nom.", \n \nLes informations concernant votre réservation viennent d'être mises à jour. Afin de prendre connaissance des modalités de réception et/ou envoi du matériel qui vous est réservé, merci de consulter la page suivante :";
  $le_mail .= "\nhttp://rallye-irem.univ-lille1.fr/index_participant.php?alea=".$element->alea."\n";
  $le_mail .= "\n\nCordialement,\n\nLes organisateurs\n";
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$element->mel."","IREM de Lille : Rallye des collèges","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[AttribDef] : ".$element->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_attrib_date($id_qualifications_reservation,$bd)
{
  $query="SELECT qr.id_qualifications_contact, qr.souhait_nb_valises, UNIX_TIMESTAMP(qr.souhait_timestamp) as souhait_timestamp, qe.pripub, qe.nom, qe.ville  "
    ."FROM ".BDD_PREFIXE."qualifications_reservations qr, ".BDD_PREFIXE."qualifications_etablissements qe "
    ."WHERE qr.id_qualifications_reservation='".$id_qualifications_reservation."' AND qr.id_qualifications_etablissement=qe.id_qualifications_etablissement "
    ."ORDER BY depot_timestamp DESC ";
  //echo $query."<br />";
  $result=$bd->query($query);
  $resa = $result->fetch_object();

  $query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$resa->id_qualifications_contact."'";
  //echo $query."<br />";
  $result=$bd->query($query);
  $element = $result->fetch_object();


  $le_mail = "Bonjour ".$element->prenom." ".$element->nom.", \n \nLa demande de réservation de ".$resa->souhait_nb_valises." valise";
  if ($resa->souhait_nb_valises>1) 
    $le_mail.="s";
  $le_mail.=" pour "
    ."les qualifications du Rallye Mathématique des Collèges ".ANNEE." que vous organisez le "
    .strtolower(timestamp2txt($resa->souhait_timestamp,"jjma"))." au collège ".$resa->pripub." ".$resa->nom." (".$resa->ville.") "
    ."été prise en compte.\n"
    ."\nNous vous informerons une semaine avant les épreuves des numéros de valises attribuées pour les qualifications. "
    ."Nous vous communiquerons également les coordonnées des collègues concernés par l'échange de ces valises.\n"
    ." \nLes informations concernant votre réservation sont toujours "
    ."consultables à l'adresse suivante :";
  $le_mail .= "\nhttp://rallye-irem.univ-lille1.fr/index_participant.php?alea=".$element->alea."\n";
  $le_mail .= "\n\nCordialement,\n\nLes organisateurs\n";
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  //echo nl2br($le_mail);
  //echo "<center><h2><font color=".ROUGE.">Envoi non effectif</font><h2></center>";
  mail("".$element->mel."","IREM de Lille : Rallye des collèges","$le_mail ","$entete"); 
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[AttribDate] : ".$element->mel.""),"$le_mail","$entete"); 
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_depuis_site($expediteur,$destinataire,$sujet,$sujetcopie,$message) {
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";
  
  if ($expediteur=="rallye-irem@univ-lille1.fr") {
    mail("".$destinataire."","".$sujet."","".$message."","".$entete."");
    mail("rallye-irem@univ-lille1.fr",utf8_decode("[".$sujetcopie."] : ".$destinataire."")
	 ,"".$message."","".$entete."");
  }
  else
    mail("rallye-irem@univ-lille1.fr",utf8_decode("[Par le site] : ".$expediteur." - ".$sujet)
	 ,"".$message."","".$entete."");
  
  //echo nl2br($message);
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_perte_alea($id,$bd) {
  $query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$id."'";
  $result=$bd->query($query);
  $element = $result->fetch_object();

  $le_mail = "Bonjour ".$element->genre." ".$element->nom.", \n ";
  $le_mail.="\nVeuillez trouver ci-dessous la nouvelle adresse vous permettant d'accéder aux informations ";
  $le_mail.="\nconcernant l'organisation du Rallye Mathématique des Collèges de l'IREM de Lille pour vos élèves : ";
  $le_mail .= "\nhttp://rallye-irem.univ-lille1.fr/index_participant.php?alea=".$element->alea."\n";
  $le_mail .= "\nCordialement,\n\nLes organisateurs\n";
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  mail("".$element->mel."","IREM de Lille : Rallye des collèges","".$le_mail."","".$entete."");
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[PerteCle] : ".$element->mel."")
       ,"".$le_mail."","".$entete."");
  //echo $le_mail;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_depot_demande_reservation($id_qualifications_contact,$bd) {
  $query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE id_qualifications_contact='".$id_qualifications_contact."'";
  $result=$bd->query($query);
  $element = $result->fetch_object();

  $query="SELECT qr.souhait_nb_valises, UNIX_TIMESTAMP(qr.souhait_timestamp) as souhait_timestamp, qe.pripub, qe.nom, qe.ville  "
    ."FROM ".BDD_PREFIXE."qualifications_reservations qr, ".BDD_PREFIXE."qualifications_etablissements qe "
    ."WHERE qr.id_qualifications_contact='".$id_qualifications_contact."' AND qr.id_qualifications_etablissement=qe.id_qualifications_etablissement "
    ."ORDER BY depot_timestamp DESC ";
  //echo $query."<br />";
  $result=$bd->query($query);
  $resa = $result->fetch_object();


  $le_mail = "Bonjour ".$element->genre." ".$element->nom.", \n ";
  $le_mail.="\nNous accusons réception de votre demande de réservation de ".$resa->souhait_nb_valises." valise";
  if ($resa->souhait_nb_valises>1)
    $le_mail.="s";
  $le_mail.=" pour les qualifications du Rallye Mathématique des Collèges de l'IREM de Lille ".ANNEE." que vous organisez le "
    .strtolower(timestamp2txt($resa->souhait_timestamp,"jjma"))." au collège ".$resa->pripub." ".$resa->nom." (".$resa->ville.").\n";
  $le_mail.="\nNous validerons votre réservation dès réception de l'adhésion de votre établissement à l'association des Amis de l'IREM et de son paiement.\n";
  $le_mail.="\nLes informations concernant votre réservation sont toujours consultables à l'adresse suivante : ";
  $le_mail .= "\nhttp://rallye-irem.univ-lille1.fr/index_participant.php?alea=".$element->alea."\n";
  $le_mail .= "\nCordialement,\n";
  $le_mail.="\nLes organisateurs\n";
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  mail("".$element->mel."","IREM de Lille : Rallye des collèges","$le_mail ","$entete");
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[DemandeResa] : ".$element->mel."")
       ,"$le_mail ","$entete");
  //echo nl2br($le_mail);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mel_depot_inscription($mel,$bd)
{
  $query="SELECT * FROM ".BDD_PREFIXE."qualifications_contacts WHERE mel='".$mel."'";
  $result=$bd->query($query);
  $element = $result->fetch_object();

  $le_mail = "Bonjour, \n \nVoici confirmation de votre inscription en tant que contact sur le site "
    ."du rallye mathématique de l'IREM de Lille. \nLes coordonnées que vous nous "
    ."avez fournies sont les suivantes : \n";
  $le_mail .="\nNom : ".stripslashes($element->nom);
  $le_mail .="\nPrénom : ".stripslashes($element->prenom);
  $le_mail .="\nAdresse : ".stripslashes($element->adresse);
  
  $le_mail.="\n   ".$element->code_postal." ".$element->ville."";
  if ($element->telephone!="") $le_mail.="\nTél : ".$element->telephone."";
  if ($element->portable!="") $le_mail.="\nTél port : ".$element->portable."";
  $le_mail.="\nMél : ".$element->mel."\n";
  
  $le_mail .= "\nAfin de poursuivre la réservation et/ou modifier vos coordonnées, "
    ."merci de suivre le lien suivant : ";
  $le_mail .= "\nhttp://rallye-irem.univ-lille1.fr/index_participant.php?alea=".$element->alea."\n";
  $le_mail .= "Ce lien (que vous êtes seul";
  if ($element->genre!="M.") $le_mail.="e";
  $le_mail.=" à posséder) vous permettra d'accéder "
    ."aux informations \nconcernant l'organisation du Rallye Mathématique des Collèges de l'IREM de Lille pour vos élèves. ";

  $le_mail .= "\nVous serez informé";
  if ($element->genre!="M.") $le_mail.="e";
  $le_mail.=" de l'état de votre réservation dès réception de l'adhésion (formulaire et règlement) de votre établissement à l'association des Amis de l'IREM.\n";
  $le_mail .= "\nCordialement,\n\nLes organisateurs\n";
  
  $entete = "From: Rallye - IREM de Lille <rallye-irem@univ-lille1.fr>\n";
  $entete .= "MIME-Version: 1.0\n";
  $entete .= "Content-Type: text/plain; charset=\"UTF-8\"\n";

  mail("$mel","IREM de Lille : Rallye des collèges","$le_mail ","$entete");
  mail("rallye-irem@univ-lille1.fr",utf8_decode("[NouveauContact] : $mel")
       ,"$le_mail ","$entete");
  //echo $le_mail;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



?>