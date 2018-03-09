var Filtrages = function()
{
    if(BlocPresent('btnsFiltrage'))
    {
        var blocBtns = getID('btnsFiltrage');
        this.initBoutonsFiltrage(blocBtns);
    }
    else
    {
        console.log('impossible de trouver le bloc de filtres');
    }
};

Filtrages.prototype=
{
    initBoutonsFiltrage:function(blocFiltres)
    {
        var This = this;
        
        if(BlocPresent(blocFiltres))
        {
            [].forEach.call(blocFiltres.querySelectorAll('button'), function(elem)
            {
                elem.addEventListener('click', function(evt)
                {
                    var btn = $curTarget(evt);
                    var btnID = btn.id;
                    
                    switch(btnID)
                    {
                        case 'hasDescription': // filtrage des personnages ayant obligatoirement une description
                            var filtre               = 'hasDescription';
                            var blocListePersonnages = getID('listePersonnages');
                            This.filtrePersonnages(This,blocListePersonnages,filtre);
                        break;
                    }
                });
            })
        }
        else
        {
            alert('impossible de trouver le bloc de filtres');
        }
    },
    
    filtrePersonnages:function(This,listePersonnages,filtre)
    {
        if(BlocPresent(listePersonnages))
        {
            var btnFiltre      = getID(filtre);
            var btnFiltreState = btnFiltre.getAttribute('clicked');

            if(btnFiltreState == 1)
            {
                btnFiltre.style.backgroundColor = '';
                btnFiltre.setAttribute('clicked',0);
            }
            else
            {
                btnFiltre.style.backgroundColor = 'rgba(0,150,140,0.1)';
                btnFiltre.setAttribute('clicked',1);
            }
            
            
            [].forEach.call(listePersonnages.querySelectorAll('li'), function(elem)
            {
                var dataFiltre = parseInt(elem.getAttribute(filtre));
                
                if(dataFiltre <= 0)
                {
                    if(elem.style.opacity=='0' && btnFiltreState == 1)
                    {
                        elem.style.position  = '';
                        elem.style.transform = 'scale(1)';
                        elem.style.opacity   = '1';
                    }
                    else
                    {
                        if(btnFiltreState == 0)
                        {
                            elem.style.opacity='0';
                            elem.addEventListener('transitionend',hideBlock,false);
                            elem.filtre = filtre;
                        }
                    }
                }
            });
        }
        
        function hideBlock(evt)
        {
            var blocObj = $curTarget(evt);
            var filtre  = blocObj.filtre;
            
            blocObj.style.position  = 'absolute';
            blocObj.style.transform = 'scale(0)';
            blocObj.removeEventListener('transitionend',hideBlock,false);
        }
    },
};
