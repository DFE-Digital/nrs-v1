function openCrisp(){
    $crisp.push(["do", "chat:open"])// open crisp client
    return false;// stop default href behaviour
}

function myChat(){
    window.$crisp=[];
    window.CRISP_WEBSITE_ID="b8696e4a-8f2a-489b-a441-b751569d58b6";
    (function(){
        d=document;s=d.createElement("script");
        s.src="https://client.crisp.chat/l.js";
        s.async=1;d.getElementsByTagName("head")[0].appendChild(s);
    })();






    function chatHide(){
        $('#crisp-chatbox').find('div.crisp-ewasyx').addClass('newChatStyle'); 
        var chatDiv = $('#crisp-chatbox');
        var chatTarget = chatDiv.find('div[data-visible]');//elements of main box to show/hide
        var chatSpan = chatDiv.find('span[data-visible]');//elements of main box to show/hide
        var chatButton = chatDiv.find('a.crisp-kquevr'); //('a[data-maximized]');//the small chat icon, bottom right

        if(chatTarget.attr('data-visible') == 'false'){
            chatTarget.attr('data-visible', 'true'); //show main panel 
            chatSpan.attr('data-visible', 'true');
            chatButton.attr('data-maximized','true');

        }else{
            chatTarget.attr('data-visible', 'false');  //hide main panel   
            chatSpan.attr('data-visible', 'false');
            chatButton.attr('data-maximized','false');

            //clone and replace to avoid double click events, etc ...
            var tempClone = chatButton.off().clone();
            chatButton.replaceWith(
                tempClone.on('click',function(){
                    chatHide();
                })
            );
        }

       

    }



    function closeBtn(){
        var closeButton = $('#crisp-chatbox').find('div[data-tile=kiwi]').children('span:last-child');

        closeButton.off().on('click',function(){
            chatHide(); 
        });
    }

    if($('body#pre-live').length){ 

       $("#chatIntro").on('click', function(){
            chatHide(); 
            closeBtn();
        }); 

        $("#chatIntro").find('a.crisp-kquevr').off().on('click', function(){
            chatHide();        
        }); 
    }



    $('#clearChat').click(function(e){
        e.preventDefault();
       //js cookie clear 
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });

        location.reload();
    }); 

    $('#openChat').click(function(e){
        e.preventDefault();
        openCrisp();
    });
}



$(window).on('load', function() {
    openCrisp(); //open the chat panel on each page
});


function init(){
    //start - listien live for when chat divs are added to DOM
    var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation) {//console.log(mutation)

            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // element added to DOM
                var hasClass = [].some.call(mutation.addedNodes, function(el) {
                    return el.classList.contains('crisp-client')
                });

                if(hasClass){// element has class `MyClass`
                    
                    var t = $('body').children('.crisp-client');

                    //here we instantly hide the div(s) so we can then add a style class, and then show
                    if ($(window).width() > 960) {//only for desktops
                        

                        if($('body#pre-live').length){
                            t.hide(function(){
                                t.addClass('chat-position chat-style reset-z').show();//reset-z reveals the chat div
                            });
                        }else{
                            t.addClass('chat-style');//files cached; smoother loading
                        }
                    }
                }
            }
        });
    });
    var config = {attributes: true, childList: true, characterData: true};
    observer.observe(document.body, config); 
    //end - listiening live for when chat divs are added to DOM

    myChat(); 
}
