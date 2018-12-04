function footerlinks(){
    $('#footerLinks').load('incs/footer-links.txt');
}

function quiz(){
    if($('#form').length){

        var quizVal;
        var myForm = $('#form');

        if(myForm.is('.form-00')){
            localStorage.removeItem('quiz');
        }
         
        myForm.find('.submit').on('click',function(e){//click Confirm or 'dosen't apply to me'
            e.preventDefault(); 
            
            var opt = myForm.find('input:checked').val();//get option val from quiz form
            if(opt === undefined){//no option selected
                quizVal = '0';
            }else{//option selected
                quizVal = opt;
            }
            var quizStr = localStorage.getItem('quiz'); 
            localStorage.setItem('quiz', quizStr +','+ quizVal);//build results str/array
            
            
            
            /****************** work out next pg url in quiz pgs: start */
            function myURLpg(p){//
                var pg1 = parseInt(myForm.attr('class').slice(-2)) +1; 
                if(pg1 == 6){ pg1 = 'level'; }
                else if(pg1 == 7){ pg1 = 'results'; }
                else if(pg1 < 10){ pg1 = 'quiz-0'+ pg1; }
                else{ pg1 = 'quiz-'+ pg1; }
                return pg1;
            }
            window.location.replace(myURLpg() +'.html');//'replace' has no history. used instead of 'href' 
            /****************** work out next pg url in quiz pgs: end */
        });
        
        if($('#form').is('.form-06')){//show/hide 'other' option textfield
            var eleOther = $('#elementOther');
            var eleOtherInput = eleOther.prev('div').find('input'); 

            $('#form').find('.govuk-radios__input').on('click',function(){
                if (eleOtherInput.is(':checked')) {
                    eleOther.show().find('input').fadeIn(300);
                }else{
                    eleOther.hide().find('input').hide().val('');
                }
            });
        }

    }
}

function results(){
    if($('body#results').length) {  
        
        var str = localStorage.getItem('quiz').replace('null,','');//remove leading null

        var myScores;
        if(str.length === 0) {//put localstorage str into array as integars
            myScores = new Array();
        }else{
            myScores = str.replace(/, +/g, ',').split(',').map(Number);//creates the array
        }
        //alert(myScores);//show my localStorage array

        /* use this for creating results table ... 
        for (var i = 0; i < myScores.length; i++) {//match score to skills
            var score = myScores[i];
            //if(score >= 3){
                alert(score);
            //}
        }*/
        

        var mySkills = new Array(); 
        var myJobs = new Array();  
        $.getJSON('data/skills.json', callbackSkillsWithData);
        $.getJSON('data/jobs.json', callbackJobsWithData);

        function callbackSkillsWithData(data){ 
            var count = 0; 
            var skills = data.skills.map(function(item) {//loop through the skills nodes
                var myScore = myScores[count];//e.g, if at skill 2, get score from position 2 of myScores array

                if(myScore >= 3){//basic. works.
                //if(myScore >= item.score){//relationship to json scores. But some skills require a 5??????!!!!!!
                    mySkills.push(item.title); //add to mySkills array
                }
                
                count++; 
                return item.title + ': ' + item.score; //return json values back in the skills var
            });
        
            if (skills.length) {
                var content = '<li>' + skills.join('</li><li>') + '</li>';
                var list = $('<ul />').html(content);
                $('#myResults').empty().append(list);
            }
        }

        function callbackJobsWithData(data1){
            var jobNoCount = 0;//where in the json is the job
            var jobs = data1.jobs.map(function(item1) {//loop each job
                
                var add = true;
                for (var index = 0; index < item1.employabilityRequirements.length; index++) {//loop each nested requirement
                    
                    var requirements = item1.employabilityRequirements[index];
                    
                    for (var index1 = 0; index1 < mySkills.length; index1++) {//loop each skill ...
                        if(requirements ==  mySkills[index1]){//and match skill to requirements 
                            if(add == true){//don't duplicate the job. 1 match to 1 skill per job is adequate
                                //myJobs.push(item1.title + '('+jobNoCount+'):  '); 
                                myJobs.push(jobNoCount); 
                                add = false;
                            }
                        }
                    }
                    //myJobs = [];//clear it  ***** here or ... *******
                    
                } 
                jobNoCount++;
                myJobs = [];//clear it  ***** here  *******
                
                                
                return myJobs;
                //return item1.title + ': ' + item1.employabilityRequirements; //return json values back in the skills var
            });    

            if (jobs.length) {
                //$.getJSON('data/jobs.json', function(data2){
                    /*  var countJobs = 0; 
                        var theJobs = data2.jobs.map(function(item2) {
                        //loop through jobs to match here ....
                        for (var i = 0; i < jobs.length; i++) {//'jobs' here is the list of jobs represented by their number in the list
                            if(jobs[i] != ''){//ignore empty vals
                                if(jobs[i] == countJobs) {
                                    var myHTML = '<p>'+ countJobs +': <b>'+ item2.title +'</b><br>'+ item2.description +'</p>';
                                    $('#myJobs').append(myHTML);
                                }
                            }
                        }
                        countJobs++; 
                    });*/

                    /* part of the HTML Templating starts */
                    var template = document.getElementById('job-card-template');// Cache of the template
                    var templateHtml = template.innerHTML;// Get the contents of the template
                    var jobHtml = '';// Final HTML variable as empty string
                    /* part of the HMTL Templating ends */

                    
                    $.each(data1.jobs, function (key, value) {
                        for (var i = 0; i < jobs.length; i++) {
                            if(jobs[i] != ''){//ignore any empty vals in my jobs array
                                if(jobs[i] == key) {//$("#myJobs").append('<p>text1 ' + value.title + '</p>'); //basic example

                                    /* HTML Templating starts ...*/
                                    jobHtml += templateHtml.replace(/{{title}}/g, value.title)
                                                    .replace(/{{salary}}/g, value.salary)
                                                    .replace(/{{description}}/g, value.description)
                                                    .replace(/{{employabilityRequirements}}/g, value.employabilityRequirements);
                                    /* HTML Templating ends */
                                }
                            }
                        }
                    }); 
                   document.getElementById('myJobs').innerHTML = jobHtml;//part of the HTML templating
                //});
            } else {
                $('#myJobs').html('<p>There are currently no job matches.</p>');
            }
        }    
       
    }  
}







function initScripts(){
    footerlinks(); 
    quiz(); 
    results();
}