

function startUp(){
    //alert('fired');
}

function openCrisp(){
    // open crisp client
    $crisp.push(["do", "chat:open"])
    // stop default href behaviour
    return false;
}

function myChat(){
      window.$crisp=[];
      window.CRISP_WEBSITE_ID="e18ce875-dd0c-40b7-8a85-f9d3970fe2a0";
      (function(){
          d=document;
          s=d.createElement('script');
          s.src="https://client.crisp.chat/l.js";
          s.async=1;
          d.getElementsByTagName("head")[0].appendChild(s);
        })();
}

function init(){
    startUp(); 
    myChat();
}

 /*<script src="/public/javascripts/auto-store-data.js"></script>   ????????????????????? */