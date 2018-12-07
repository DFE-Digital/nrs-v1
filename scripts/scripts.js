function getQueryStringValue(key) {  
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function footerlinks(){
    $('#footerLinks').load('/incs/footer-links.txt');
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


        var mySkills = new Array(); 
        var myJobs = new Array();  
        $.getJSON('/data/skills.json', callbackSkillsWithData);
        $.getJSON('/data/jobs.json', callbackJobsWithData);

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
                //$.getJSON('/data/jobs.json', function(data2){
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

                    var myJobsDiv = $('#target');
                    var myHTML = ''; 
                    var rowCount = 0; 
                    var rolesCount1 = 0;
                    var rolesCount2 = 0; 
                    var myRow = '<div class="govuk-grid-row"></div>';//a str!

                    $.each(data1.jobs, function (key) {
                        for (var i = 0; i < jobs.length; i++) {
                            if((jobs[i] != '')&&(jobs[i] == key)){
                                rolesCount1++; //get total matches
                            }
                        }
                    });
                   
                    $.each(data1.jobs, function (key, value) {
                        for (var i = 0; i < jobs.length; i++) {
                            if((jobs[i] != '')&&(jobs[i] == key)){//ignore any empty vals in my jobs array
                                
                                myHTML = myHTML + '<div class="govuk-grid-column-one-third">' + 
                                    '<div class="img"><a href="job-listing.html?no='+ key +'">' +
                                    '<img src="/assets/images/job-blank.png" alt="Blank image holder">' +
                                    '</a></div>' +
                                    '<h2><a href="job-listing.html?no='+ key +'" class="govuk-link">' + value.title + '</a></h2>' +
                                    '<p><b>Training available. <br>'+ value.salary +'</b></p>' + 
                                    '<p>'+ value.description +'</p>' +
                                    '<p class="employabilityRequirements">'+ 
                                    String(value.employabilityRequirements).replace(/,/g , ', ') +
                                    '</p>' +
                                '</div>';//build str x3 

                                rolesCount2++;

                                if(rowCount == 2){//myHTML = $('<div/>', {html: myHTML}).find('.govuk-grid-column-one-third').wrapAll('<div class="govuk-grid-row"></div>').end().html();
                                    myHTML = $(myRow).append( $(myHTML) );//wrap myRow in myHTML but also convert myHTML str back into html object

                                    myJobsDiv.append(myHTML); //add to the pg 
                                    myHTML = '';
                                    rowCount = 0;
                                }else if(rolesCount2 === rolesCount1){//last role(s) in results (not a 3rd for html row closure)
                                    myHTML = $(myRow).append( $(myHTML) );

                                    myJobsDiv.append(myHTML); 
                                    myHTML = '';
                                    rowCount = 0;
                                }else{
                                    rowCount++; 
                                }
                            }
                        }
                    }); 
                //});
            } else {
                myJobsDiv.html('<p>There are currently no job matches.</p>');
            }
        }  

/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx first part of the page, now ... xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */

        var str = localStorage.getItem('quiz');
        
        if ((typeof str === 'undefined') || ( str == null)){
            $('#target').html('<p>Take the quiz.</p>');
        }else{
            str = str.replace('null,','');//remove leading null
        }

        var myScores;
        if(str.length === 0) {//put localstorage str into array as integars
            myScores = new Array();
        }else{
            myScores = str.replace(/, +/g, ',').split(',').map(Number);//creates the array
        }
        //alert(myScores);//show my localStorage array
        
        /* xxxxxxxxxxx the result percentage scores table starts xxxxxxxxxxxx */
        var scoreHTML = ''; 
        var titlesArray = ['Teamwork', 'Analysing', 'Communication', 'Digital', 'Responsibile', 'Reflection and Self Awareness', 'Resilience']; 
        var s;
        for (var i = 0; i < myScores.length; i++) {//match score to skills
            var score = parseInt(myScores[i], 10); 

            function tr(s, i){
                var str; 
                if (typeof s === 'string' || s instanceof String){
                    str = '<tr><td>'+ titlesArray[i] +'</td><td>75%</td></tr>';
                }else{
                    str = '<tr><td>'+ titlesArray[i] +'</td><td>'+ Math.floor((s / 5) * 100) +'%</td></tr>';
                }
                return str;
            }

            if(score >= 3){//0 - 5
                s = score; 
                scoreHTML = scoreHTML + tr(s, i);

            }else if(isNaN(score)){//= NaN - covers the current training course form which records no value
                s = '75';
                scoreHTML = scoreHTML + tr(s, i);

            }else{
                s = score + 0.5;
                scoreHTML = scoreHTML + tr(s, i);
            }
            
        }
        $('#theScores').append(scoreHTML);
        /* xxxxxxxxxxx the result percentage scores table ends xxxxxxxxxxxx */
       
    }  
    
    
}

function job(){
    if($('body#job').length) {  

        var jobID = getQueryStringValue('no');
        
        $.getJSON('/data/jobs.json', function(data){
            $.each(data.jobs, function (key, value) {
                
                if(key == jobID){
                
                    var myTitle = value.title;

                    var myHTML = '<div class="govuk-grid-row">' +
                    '<div class="govuk-grid-column-full">' +
                    '<h1 class="govuk-heading-xl">' + myTitle +
                        '<span class="govuk-caption-xl">'+ value.description +'</span>' +
                    '</h1>' +
                    '<div class="govuk-grid-row details">' +
                    '<div class="govuk-grid-column-one-third cash">' +
                            '<div>' +
                                '<h4>Average salary</h4><hr class="std">' +
                                '<p>'+ value.salary +'</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="govuk-grid-column-one-third time">' +
                            '<div>' +
                                '<h4>Typical Hours</h4><hr class="std">' +
                                '<p>37 to 41</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="govuk-grid-column-one-third cal">' +
                            '<div>' +
                                '<h4>You could work</h4><hr class="std">' +
                                '<p>between 8am and 6pm</p>' +
                            '</div>' +
                        '</div>' + 
                    '</div>'; 

                    $('#target').append(myHTML); 
                    $('#repeatTitle').text(myTitle); 
                    $('#myDetails').text(value.details);

                }
            });
        });
        

    }
}

function joblisting(){
    if($('body#job-listing').length) {  

        var jobID = getQueryStringValue('no');
        //alert(x); 
        $.getJSON('/data/jobs.json', function(data){
            $.each(data.jobs, function (key, value) {
                
                if(key == jobID){
                
                    var myTitle = value.title; 
                    var myStrap = value.description; 

                    var threeBlocks = '<div class="govuk-grid-row details">' +
                                    '<div class="govuk-grid-column-one-third cash">' +
                                        '<div>' +
                                            '<h4>Average salary</h4>' +
                                            '<hr class="govuk-section-break govuk-section-break--visible">' +
                                            '<p>'+ value.salary +'</p>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="govuk-grid-column-one-third time">' +
                                        '<div>' +
                                            '<h4>Typical Hours</h4>' +
                                            '<hr class="govuk-section-break govuk-section-break--visible">' +
                                            '<p>37 to 41</p>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="govuk-grid-column-one-third cal">' +
                                        '<div>' +
                                            '<h4>You could work</h4>' +
                                            '<hr class="govuk-section-break govuk-section-break--visible">' +
                                            '<p>between 8am and 6pm</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'; 

                    var what = '<h2 class="govuk-heading-l" style="margin-top: 40px;">What you\'ll do</h2>' +
                               '<p class="govuk-body">'+ value.details +'</p>'; 

                    var howTitle = '<h3 class="govuk-heading-l">How to become a '+ myTitle +'</h3>'; 

                    var option01 = '<div class="govuk-grid-row govuk-!-margin-bottom-6">' +
                        '<div class="govuk-grid-column-full">' +
                            '<div class="govuk-grid-column-one-half" style="padding-left: 0;">' +
                                '<img alt="laptop" src="/assets/images/online.f4deeb38.jpeg" style="width: 100%;">' +
                            '</div>' +
                            '<div class="govuk-grid-column-one-half">' +
                                '<h2 class="govuk-heading-m"><a href="online.html?no='+ jobID +'">Option 1 - Online only</a></h2>' +

                                '<ul class="govuk-list govuk-list--bullet">' +
                                '<li>Online Maths Course: 60 hours</li>' +
                                '<li>Online English Course: 60 hours</li>' +
                                '<li>Online Responsible Course: 30 hours</li>' +
                                '<li><b>Cost</b> (Financing Available):	<b>£99.00</b></li>' +
                                '</ul>' +
                                
                                '<a href="online.html?no='+ jobID +'" type="submit" role="button" class="govuk-button">Choose this option</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

                    var option02 = '<div class="govuk-grid-row govuk-!-margin-bottom-6">' +
                        '<div class="govuk-grid-column-full">' +
                            '<div class="govuk-grid-column-one-half" style="padding-left: 0;">' +
                                '<img alt="laptop" src="/assets/images/classroom.9fc25017.jpg" style="width: 100%;">' +
                            '</div>' +
                            '<div class="govuk-grid-column-one-half">' +
                                '<h2 class="govuk-heading-m"><a href="blended.html?no='+ jobID +'">Option 2 — Online and college classes (3 months)</a></h2>' +

                                '<ul class="govuk-list govuk-list--bullet">' +
                                '<li>Online Maths Course: 60 hours</li>' +
                                '<li>Classroom: Responsible course:	6 weeks</li>' +
                                '<li><b>Cost</b> (Financing Available):	<b>£250.00</b></li>' +
                                '</ul>' +
                                
                                '<a href="blended.html?no='+ jobID +'" type="submit" role="button" class="govuk-button">Choose this option</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';   

                    var option03 = '<div class="govuk-grid-row govuk-!-margin-bottom-6">' +
                        '<div class="govuk-grid-column-full">' +
                            '<div class="govuk-grid-column-one-half" style="padding-left: 0;">' +
                                '<img alt="laptop" src="/assets/images/bootcamp.1f38ef50.jpeg" style="width: 100%;">' +
                            '</div>' +
                            '<div class="govuk-grid-column-one-half">' +
                                '<h2 class="govuk-heading-m"><a href="bootcamp.html?no='+ jobID +'">Option 3 — Bootcamp (2 weeks)</a></h2>' +

                                '<ul class="govuk-list govuk-list--bullet">' +
                                '<li>Classroom Revenues and Welfare Benefits Practitioner bootcamp:	2 weeks</li>' +
                                '<li><b>Cost</b> (Financing Available):	<b>£1000.00</b></li>' +
                                '</ul>' +
                                
                                '<a href="bootcamp.html?no='+ jobID +'" type="submit" role="button" class="govuk-button">Choose this option</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>';                                      

                    //$('#target').append(myHTML); 
                    $('#repeatTitle').text(myTitle); 
                    $('#strap').text(myStrap); 
                    $('#threeBlocks').html(threeBlocks);
                    $('#what').html(what);
                    $('#howTitle').html(howTitle);
                    $('#option01').html(option01);
                    $('#option02').html(option02);
                    $('#option03').html(option03);

                }
            });
        });


        setTimeout(function(){
            $('#job-footer-link').attr('href', 'job-listing.html?no=' + jobID);
        }, 4000);//hack! will be useful if job has been selected
        

    }
}

function online(){
  if($('body#online').length) {  
    var jobID = getQueryStringValue('no');
    
    $.getJSON('/data/jobs.json', function(data){
        $.each(data.jobs, function (key, value) {
            
            if(key == jobID) {
                var myTitle = value.title; 
                $('#myTitle').text(myTitle); 
            }

        });
    });
  }  
}

function blended(){
  if($('body#blended').length) {  
    var jobID = getQueryStringValue('no');
    
    $.getJSON('/data/jobs.json', function(data){
        $.each(data.jobs, function (key, value) {
            
            if(key == jobID) {
                var myTitle = value.title; 
                $('#myTitle').text(myTitle); 
            }

        });
    });
  }  
}

function bootcamp(){
  if($('body#bootcamp').length) {  
    var jobID = getQueryStringValue('no');
    
    $.getJSON('/data/jobs.json', function(data){
        $.each(data.jobs, function (key, value) {
            
            if(key == jobID) {
                var myTitle = value.title; 
                $('#myTitle').text(myTitle); 
            }

        });
    });
  }  
}



function initScripts(){
    footerlinks(); 
    quiz(); 
    results(); 
    job();
    joblisting(); 
    online(); 
    blended(); 
    bootcamp();
}