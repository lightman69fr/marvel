<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class CharsController extends AbstractController
{
	public function __construct()
	{
		
	}

	public function index(Request $httpReq)
    {
		$defaultName = 'Guillaume';
		$httpReqData = $httpReq->get('name',$defaultName);
		
		return $this->render('chars.html.twig',
		[
            'userName' => $httpReqData
        ]);
    }
	
	public function getPersonnages(Request $postReq)
	{
		if($postReq->isMethod('POST'))
		{
			$methode = 'post';
		}
		else
		{
			$methode = 'GET';
		}
		
		$dataPost = $postReq->request->all();
		
		$dataPers = array();
		
		$incPers = 0;
		foreach($dataPost as $personnage)
		{
			$obj = json_decode($personnage);
			
			$dataPers[$incPers]['lienPersonnage'] = '/personnages/show/'.$obj->{'persID'};
			$dataPers[$incPers]['persCount']      = $incPers+1;
			$dataPers[$incPers]['persID']         = $obj->{'persID'};
			$dataPers[$incPers]['nom']            = $obj->{'nom'};
			$dataPers[$incPers]['image']          = $obj->{'image'};
			$dataPers[$incPers]['comics']         = $obj->{'comics'};
			
			$incPers++;
		}
		
		return $this->render('listChars.html.twig',
		[
			'dataPerso' => $dataPers
		]);
	}
	
	public function showPersonnage(Request $persIDreq)
	{
		if($persIDreq->isMethod('GET'))
		{
			$persID = $persIDreq->get('id');
			
			var_dump($persID);
			
			return $this->render('showChar.html.twig',
			[
				'userName'     => 'none',
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
			
			$nbComics              = count($listeDesComics);
			
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

