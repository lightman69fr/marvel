<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class CharsController extends AbstractController
{
	public function __construct()
	{
		
	}

	public function index(Request $req)
    {
		if($req->isMethod('GET'))
		{
			$page   = $req->get('page');
			$limite = $req->get('limit');
		}
		else
		{
			$page   = 0;
			$limite = 20;
		}
		
		return $this->render('chars.html.twig',
		[
			'page'   => $page,
			'limite' => $limite
		]);
    }
	
	public function getPersonnages(Request $postReq)
	{
		$dataPost = $postReq->request->all();
		
		$donneesPagination = json_decode($dataPost['donneesPagination']);
		$listePersonnages  = json_decode($dataPost['listePersonnages']);
		
		$dataPers = array();
		$incPers  = 0;
		foreach($listePersonnages as $personnage)
		{
			$obj = json_decode($personnage);
			
			$dataPers[$incPers]['lienPersonnage'] = '/personnages/show/'.$obj->{'persID'};
			$dataPers[$incPers]['persCount']      = $incPers+1;
			$dataPers[$incPers]['persID']         = $obj->{'persID'};
			$dataPers[$incPers]['nom']            = $obj->{'nom'};
			$dataPers[$incPers]['image']          = $obj->{'image'};
			$dataPers[$incPers]['hasDesc']        = $obj->{'hasDesc'};
			$dataPers[$incPers]['inComics']       = $obj->{'inComics'};
			
			$incPers++;
		}
		
		$totalPersonnages = $donneesPagination->{'total'};
		$nbParPages       = $donneesPagination->{'limit'};
		
		$nbPages     = round($totalPersonnages/$nbParPages,0,PHP_ROUND_HALF_DOWN);
		
		$tabPages    = array();
		$incNbPages  = 0;
		$incPage     = 1;
		$nbAAfficher = 8;
		$upAndDown   = round($nbAAfficher/2, 0,PHP_ROUND_HALF_UP);
				
		$pageActuelle = $donneesPagination->pageCourante;
		if($pageActuelle == 0)
		{
			$pageActuelle = 1;
		}
		
		for ($i=0;$i<$nbAAfficher;$i++)
		{
			if($pageActuelle > 0 && $pageActuelle < $nbAAfficher)
			{	// si pageActuelle compris entre 1 et le milieu bas
				$incPage = $i+1;
			}
			elseif ($pageActuelle >= $nbPages - $nbAAfficher+2 && $pageActuelle <= $nbPages)
			{	// si pageActuelle compris entre milieu haut et nbPages
				
				if($pageActuelle > $nbPages-$nbAAfficher)
				{
					$incPage = $nbPages-$nbAAfficher+$i+1;
				}
				else
				{
					$incPage = $i+$pageActuelle;
				}
			}
			else
			{
				$incPage = $pageActuelle-$upAndDown+$i;
			}
			
			$tabPages[$incNbPages]['nom']    = 'p'.$incPage;
			$tabPages[$incNbPages]['valeur'] = $incPage;
			$tabPages[$incNbPages]['lien']   = $this->get('router')->generate('pages', 
			[
				'page'   => $incPage,
				'limit'  => $nbParPages
			]);
			$incNbPages++;
			
		}
		
		return $this->render('listChars.html.twig',
		[
			'dataPerso'        => $dataPers,
			'resultatSelect'   => $incPers,
			'totalPersonnages' => $totalPersonnages,
			'selectedFrom'     => $donneesPagination->{'start'},
			'nbSelected'       => $nbParPages,
			'tabPages'         => $tabPages,
			'pageActuelle'     => $pageActuelle,
			'nbPages'          => $nbPages,
			'pageFirst'        => $this->get('router')->generate('pages', 
			[
				'page'   => 1,
				'limit'  => $nbParPages
			]),
			'pageEnd'          => $this->get('router')->generate('pages', 
			[
				'page'   => $nbPages,
				'limit'  => $nbParPages
			]),
		]);
	}
	
	public function showPersonnage(Request $persIDreq)
	{
		if($persIDreq->isMethod('GET'))
		{
			$persID = $persIDreq->get('id');
			
			return $this->render('showChar.html.twig',
			[
				'personnageID' => $persID
			]);
		}
		elseif($persIDreq->isMethod('POST'))
		{
			$dataPost = $persIDreq->request->all();
			
			$donneesPersonnage     = $dataPost['dataPersonnage'];
			$objDonneesPersonnage  = json_decode($donneesPersonnage);
			$donneesPersonnage     = $objDonneesPersonnage->infosPersonnage;
			
			$listeDesComics        = $dataPost['dataComics'];
			$objDonneesComics      = json_decode($listeDesComics);
			$listeDesComics        = $objDonneesComics->listeDesComics;
			
			$personnageID          = $donneesPersonnage->id;
			$personnageNom         = $donneesPersonnage->nom;
			$personnageDescription = $donneesPersonnage->description;
			$personnageImage       = $donneesPersonnage->image;
			
			if(empty($personnageDescription))
			{
				$personnageDescription = 'Aucune description n\'a été fournie pour ce personnage.';
			}
			
			$nbComics             = $objDonneesComics->nbComics;
			
			$tabComicsAAfficher = [];
			$nbComicsAAfficher  = 3;
			if($nbComics < $nbComicsAAfficher)
			{
				$nbComicsAAfficher = $nbComics;
			}
			
			for($i=0;$i<$nbComicsAAfficher;$i++)
			{
				$tabComicsAAfficher[$i] = $listeDesComics[$i];
				$tabComicsAAfficher[$i]->count = $i+1;
			}
			
			return $this->render('showCharDetails.html.twig',
			[
				'userName'                 => 'none',
				'personnageID'             => $personnageID,
				'personnageNom'            => $personnageNom,
				'personnageDescription'    => $personnageDescription,
				'personnageImage'          => $personnageImage,
				'personnageNbComics'       => $nbComics,
				'personnagePremiersComics' => $tabComicsAAfficher
			]);
		}
		else
		{
			
		}
	}
}
