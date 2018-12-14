function startUp(){
    //alert('fired'); 





    /* global  
    $('body').on('submit', 'form', function (e) {
    // On form submit, add hidden inputs for checkboxes so the server knows if
    // they've been unchecked. This means we can automatically store and update
    // all form data on the server, including checkboxes that are checked, then
    // later unchecked

    var $checkboxes = $(this).find('input:checkbox')

    var $inputs = []
    var names = {}

    $checkboxes.each(function () {
        var $this = $(this);

        if (!names[$this.attr('name')]) {
            names[$this.attr('name')] = true
            var $input = $('<input type="hidden">');
            $input.attr('name', $this.attr('name'));
            $input.attr('value', '_unchecked');
            $inputs.push($input);
        }
    })

        $(this).prepend($inputs);
    });
    */
}

function openCrisp(){
    $crisp.push(["do", "chat:open"])// open crisp client
    return false;// stop default href behaviour
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
