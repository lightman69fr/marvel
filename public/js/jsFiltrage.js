var Filtrages = function()
{
    this.btnFiltresState =
    {
        inComics       : 0,
        hasDescription : 0
    };
    
    
    
    
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
            var incElem              = 0;
            var key                  = 0;
            var blocListePersonnages = getID('listePersonnages');
            
            [].forEach.call(blocFiltres.querySelectorAll('button'), function(elem)
            {
                elem.addEventListener('click', function(evt)
                {
                    var btn = $curTarget(evt);
                    var btnID = btn.id;
                    
                    switch(btnID)
                    {
                        case 'inComics': // filtrage des personnages ayant obligatoirement une description
                            var filtre               = 'inComics';
                            This.filtrePersonnages(This,blocListePersonnages,filtre,blocFiltres);
                        break;
                        case 'hasDescription': // filtrage des personnages ayant obligatoirement une description
                            var filtre               = 'hasDescription';
                            This.filtrePersonnages(This,blocListePersonnages,filtre,blocFiltres);
                        break;
                    }
                });
            });
            
        }
        else
        {
            alert('impossible de trouver le bloc de filtres');
        }
        
        //console.log(This.blocsSelected);
    },
    
    
    
    
    
    
    filtrePersonnages:function(This,listePersonnages,filtre,blocBtnsFiltres)    // lorsqu'on a cliqué sur le bouton de filtre
    {
        if(BlocPresent(listePersonnages))
        {
            var btnFiltre      = getID(filtre);
            var btnFiltreState = This.btnFiltresState[filtre];
            var blocSelected   = This.blocsSelected;
            
            if(This.btnFiltresState[filtre] == 0)
            {
                [].forEach.call(blocBtnsFiltres.querySelectorAll('button'), function(elem)
                {
                    if(elem.id == filtre)
                    {
                        elem.addClass('btnSelected');
                        This.btnFiltresState[elem.id] = 1;
                    }
                    else
                    {
                        elem.removeClass('btnSelected');
                        This.btnFiltresState[elem.id] = 0;
                    }
                });
                
            }
            else
            {
                btnFiltre.removeClass('btnSelected');
                This.btnFiltresState[filtre] = 0;
            }
            
            
            [].forEach.call(listePersonnages.querySelectorAll('li'), function(elem)
            {
                var dataFiltre = parseInt(elem.getAttribute(filtre));
                var filtreEch  = filtre;
                
                if(dataFiltre > 0)
                {
                    elem.style.opacity = '1';
                }
                else
                {
                    if(This.btnFiltresState[filtre] == 1)
                    {
                        elem.style.opacity = '0.15';
                    }
                    else
                    {
                        elem.style.opacity = '1';
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









