/*function getQueryStringValue(key) {  
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}*/

function footerlinks(){
    $('#footerLinks').load('/incs/footer-links.txt');
}

function dynamicBtns(){//show/hide the 3rd column
    if($('body#a2-01').add('body#a2-02').length) {

        var t = $('#main').children('.govuk-grid-row').children('.govuk-grid-column-one-third');
        $('#tog').on('click', function(){
            t.toggle();
        });

        var myBtn;
        var b = $('#eORl'); 
        var a = $('#main').find('.chg ');

        if(localStorage.getItem('btn') == 'null'){
            myBtn = localStorage.setItem('btn','e'); 
            b.text(myBtn);            
        }else{
            myBtn = localStorage.getItem('btn'); 
            b.text(myBtn);
        }

        a.each(function(){  
            var av = $(this).attr('href').substring(1);
            $(this).attr('href', myBtn+av);
        });     
        
        b.on('click', function(){
            a.each(function(){
                var av = $(this).attr('href');
                var h = av.substring(1);//href without first letter

                if(av.charAt(0) == 'e'){//if first letter ==e or l
                    $(this).attr('href', 'l'+h);
                    b.text('L'); 
                    localStorage.setItem('btn', 'l'); 
                }else{
                    $(this).attr('href', 'e'+h);
                    b.text('E'); 
                    localStorage.setItem('btn', 'e'); 
                }
            });
        });       

    }
}

/*function backLinks(){//fixes history issue after having clicked the internal jump-to links
    if($('#training').length) {

        var myBack = $('#pageBreadcrumbs').add('#main').find('.goback');

        myBack.on('click',function(){
            var myURL = window.location.href;
            var url = String(myURL).slice(0, -1); 
            var url2 = myURL.substr(0,myURL.lastIndexOf('/'));

            if(url.indexOf('#') > -1){//has hash
                alert('has hash');
                window.location.href = url2 + "/a2-02.html";
            }else{
                //alert('no hash');
                history.back();
            }
        });
    }
}*/

/*function jumpto(){

    var m = $('#main');
   
    m.find('.clickOnline').click(function(e){
        e.preventDefault();
        $('#online').get(0).scrollIntoView();
    });
    m.find('.clickBlended').click(function(e){
        e.preventDefault();
        $('#blended').get(0).scrollIntoView();
    });
    m.find('.clickbootcamp').click(function(e){
        e.preventDefault();
        $('#bootcamp').get(0).scrollIntoView();
    });
            
}*/



function initScripts(){
    footerlinks(); 
    dynamicBtns();
    //jumpto(); 
   
}