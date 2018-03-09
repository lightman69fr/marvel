<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class DefaultController extends AbstractController
{
	public function __construct()
	{
		
	}

	public function index()
    {
		return $this->render('layout.html.twig');
    }
	
	public function menu()
	{
		$tabMenu = array(	
			array(	'id' => 'menuHome' ,'title'	=> 'Accueil'        , 'href' => '/home'),
			array(	'id' => 'menuChars','title'	=> 'Personnages'    , 'href' => '/personnages'),
			array(	'id' => 'doc'      ,'title'	=> 'Documentation'  , 'href' => '/home'),
			
		);
		
		return $this->render('menu.html.twig',
		[
			'listeMenu' => $tabMenu
		]);
	}
}
