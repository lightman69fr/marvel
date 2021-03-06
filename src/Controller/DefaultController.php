<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DefaultController extends AbstractController
{
	public function __construct()
	{
		
	}

	//	affichage du layout
	public function index()
    {
		return $this->render('layout.html.twig');
    }
	
	//	Un petit menu pour faire joli
	public function menu()
	{
		$tabMenu = array(	
			array(	'id' => 'menuHome' ,'title'	=> 'Accueil'        , 'href' => '/home'),
			array(	'id' => 'menuChars','title'	=> 'Personnages'    , 'href' => '/personnages'),
		);
		
		return $this->render('menu.html.twig',
		[
			'listeMenu' => $tabMenu
		]);
	}
}
