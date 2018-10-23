
var totalcash = 2000, //cash in the cash pile
        deckAclicks = 0, //clicks for deck A
        deckBclicks = 0, //clicks for deck B
        deckCclicks = 0, //clicks for deck C
        deckDclicks = 0, //clicks for deck D
        totalclicks = 0,  
        penalty = 0,   
        netgain = 0,   
        email_address = '',
        mail_attachment = '', 
        mail_subject = 'IGT data',
		mailsvc_url = 'TODO' 
        //GAME_VERSION = "0.16",
        //GAME_VERSION_DATE = new Date("October 22, 2018 10:44:00"),    
        DECKA_WIN = 100,
        DECKB_WIN = 100,
        DECKC_WIN = 50,
        DECKD_WIN = 50,
	    CASHMAX = 6000, 	
	    MAXGAMES = 100; 

var DECKA_PENALTY = [0, 0, -150, 0, -300, 0, -200, 0, -250, -350, 0, -350, 0, -250, -200, 0, -300, -150, 0, 0, 0, -300, 0, -350, 0, -200, -250, -150, 0, 0, -350, -200, -250, 0, 0, 0, -150, -300, 0, 0];
var DECKB_PENALTY = [0, 0, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, 0, 0];
var DECKC_PENALTY = [0, 0, -50, 0, -50, 0, -50, 0, -50, -50, 0, -25, -75, 0, 0, 0, -25, -75, 0, -50, 0, 0, 0, -50, -25, -50, 0, 0, -75, -50, 0, 0, 0, -25, -25, 0, -75, 0, -50, -75];
var DECKD_PENALTY = [0, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0];
var selectedCards = []; //stores the selections for output when the game is over.

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//rewards preprogramed pentalties are higher for deck A & B.
$(function () {
    //$("#game_version").html(GAME_VERSION);
    $("#testresults").hide();
    $(".spinner").hide();    
    $("#emailResultsTo").val(getParameterByName('email_results_to')); 
	$("#subjectID").val(getParameterByName('mail_subject')); 
	
    $('#modal-splash').modal('show');

    $("#emailBtn").click(function () {
        email_address = $("#emailResultsTo").val();			
		if($("#subjectID").val() !== "") mail_subject = $("#subjectID").val();
		
        if (email_address.length && mail_attachment.length) {
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                url: mailsvc_url,
                data: "{ to:" + JSON.stringify(email_address) + 
					  ", subject: " + JSON.stringify(mail_subject) +
					  ", attachdata: " + JSON.stringify(mail_attachment) + "}",
                dataType: "json",
                success: function (data, status, jqxhr) {
					var d = (data.d) ? data.d : data;
					$(".spinner").hide();    
					if(d.isError) 
					{
						console.error(d.LongWindedDrawnOutReason);
					}
					else
					{						               
						$("#emailresultstxt").html(d.Response);					
					}
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#emailresultstxt").html("Error.");
                    $("#emailBtn").prop("disabled", false);
                    $(".spinner").hide();
                    console.error(xhr, textStatus);
                },
                beforeSend: function (xhr, settings) {
                    $("#emailresultstxt").html("Waiting..");
                    $("#emailBtn").prop("disabled", true);
                    $(".spinner").show();
                }
            });
        }
        else {
            console.error("Email address is blank, or there are no test results to send.");
        }
    });

    $("#viewresultsbtn").click(function () {
        if ($("#testresults").is(":hidden")) {
            $("#testresults").fadeIn(function () { $("#viewresultsbtn").html("Esconder resultado"); });
        }
        else {
            $("#testresults").fadeOut(function () { $("#viewresultsbtn").html("Ver resultado?"); });
        }
    });

    $(".card").click(function () {
        totalclicks++;
        if (totalclicks <= MAXGAMES) {

            var clicked = $(this).attr("id"); 
            switch (clicked) {                
                case "card-one":
                    if (deckAclicks === DECKA_PENALTY.length)
                    {
                        deckAclicks = 0;
                    }   
                    penalty = DECKA_PENALTY[deckAclicks];
                    netgain = DECKA_WIN + penalty;                            
                    $("#winamt").html(DECKA_WIN);           
                    deckAclicks++;                       
                    selectedCards.push("A");                     
                    break;

                case "card-two":
                    if (deckBclicks === DECKB_PENALTY.length) {
                        deckBclicks = 0;
                    }
                    penalty = DECKB_PENALTY[deckBclicks]; 
                    netgain = DECKB_WIN + penalty;                      
                    $("#winamt").html(DECKB_WIN);                        
                    deckBclicks++;                        
                    selectedCards.push("B");                    
                    break;

                case "card-three":
                    if (deckCclicks === DECKC_PENALTY.length) {
                        deckCclicks = 0;
                    }
                    penalty = DECKC_PENALTY[deckCclicks]; 
                    netgain = DECKC_WIN + penalty;              
                    $("#winamt").html(DECKC_WIN);              
                    deckCclicks++;                        
                    selectedCards.push("C");                   
                    break;

                case "card-four":
                    if (deckDclicks === DECKD_PENALTY.length) {
                        deckDclicks = 0;
                    }
                    penalty = DECKD_PENALTY[deckDclicks]; 
                    netgain = DECKD_WIN + penalty;                          
                    $("#winamt").html(DECKD_WIN);                          
                    deckDclicks++;                        
                    selectedCards.push("D");                          
                    break;
            }

            $("#penaltyamt").html(penalty.toString());  
            $("#netgains").html(netgain.toString());   
            totalcash += netgain;                     
           
            if (netgain <= 0)
                $(".outputtext").css("color", "red");
            else
                $(".outputtext").css("color", "blue");

            if (totalcash < 0) totalcash = 0; //if total cash is negative make it 0.			               
            $("#totalmoney").html("$" + totalcash.toString());
            //calculate our cash bar and display
            var cashpilebarvalue = 100 * totalcash / CASHMAX;
            $("#cashpilebar").css("width", cashpilebarvalue.toString() + "%"); 
            $("#cashpileamt").html("$" + totalcash);
        }
        else //game over 
        {
            $("#modal-gameend").modal('show');              
            var prettyprnt = selectedCards.join(", ");    
            $("#testresults").html(prettyprnt); 
            mail_attachment = prettyprnt.replace(/\s+/g, ""); 
        }
    });
});