<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
//use Symfony\Component\HttpFoundation\Response;


class DefaultController extends AbstractController
{
	public function __construct()
	{
		
	}

	public function index(Request $httpReq)
    {
		$defaultName = 'Guillaume';
		$httpReqData = $httpReq->get('name',$defaultName);
		
		
		return $this->render('layout.html.twig',
		[
            'userName' => $httpReqData
        ]);
    }
	
	public function menu()
	{
		
		$tabMenu = array(	
			array(	'id' => 'menuHome' ,'title'	=> 'Accueil', 'href' => '/home'),
			array(	'id' => 'menuChars','title'	=> 'Personnages'  , 'href' => '/personnages'),
		);
		
		return $this->render('menu.html.twig',
		[
			'listeMenu' => $tabMenu
		]);
		
	}
}

