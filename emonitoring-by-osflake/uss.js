jQuery(document).ready(function(){


  function get_params(name){
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.has(name)? searchParams.get(name): false;
  }

  function containsAny(source,target){
    var result = source.filter(function(item){ return target.indexOf(item.code) > -1});
    return (result.length > 0);  
  }

  function sprawdzPrzesylke(x){
      return /([a-zA-Z0-9])+$/.test(x);
  }

  var myParcelUrl = get_params('numer');//location.search.split('numer=')[1];
  var myParcelLanguage = get_params('language');// location.search.split('language=')[1];

  (async () => {

    async function getData(url = "", data = {},responseJSON) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
  const config = await getData("config.json?callback=?", { answer: 42 });
  
    // async function getCaptcha2() {
    //   // Default options are marked with *
    //   const response = await fetch(
    //     config[jQuery("input[name='uss_s']:checked").val()].url+"/uss/v"+jQuery("input[name='uss_v']:checked").val()+"/tracking/captcha", {
    //     method: "GET", // *GET, POST, PUT, DELETE, etc.
    //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //     headers: {
    //       // "Content-Type": "blob",
    //       // "Access-Control-Allow-Origin": "*",
    //       "api_key": config[jQuery("input[name='uss_s']:checked").val()].token
    //       // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     // redirect: "follow", // manual, *follow, error
    //     responseType: "blob",
    //     // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //     // body: JSON.stringify(data), // body data type must match "Content-Type" header
    //   });
    //   //console.log("RETURN CAPTCHA");
    //   //console.log(response);
    //   return response; // parses JSON response into native JavaScript objects
    // }

    async function getCaptcha(){
      var a=new XMLHttpRequest;
      a.open("GET",config[jQuery("input[name='uss_s']:checked").val()].url+"/uss/v"+jQuery("input[name='uss_v']:checked").val()+"/tracking/captcha",!0),
      a.responseType="blob",
      a.msCaching="disabled",
      a.setRequestHeader("API_KEY",config[jQuery("input[name='uss_s']:checked").val()].token),
      a.onload=function(e){
        if(200===this.status){
          var t=document.getElementById("imageCaptcha"),
          n=window.URL||window.webkitURL;
          t.src=n.createObjectURL(this.response),
          jQuery("input#captchaUid").val(a.getResponseHeader("captcha-uid")),
          jQuery("input#captchaAnswer").val("")}
      },
      a.send()
    }
  
  

  if(myParcelUrl){
    jQuery(document).find('input[name="parcel"]').val(myParcelUrl);
    setTimeout(function(){ $('#sledzenie').click()}, 500);
  }

  $("#sledzenie-przekieruj").on("click",function(){
    var parcel = jQuery(document).find('input[name="parcel"]');
    if (sprawdzPrzesylke(parcel.val()) ) {
      if(parcel.val().length >6){
        location.href = "./emonitoring.html?numer="+parcel.val();
      }else{
        alert('Zbyt krótki numer przesyłki!');
      }
    }else{
      alert('Nieprawidłowy numer przesyłki. Niedozwolone znaki!');
    }	

  });

  

  function get_token(){
    var dane = {
      "login": "kartelmedia",//"N_TRCX",
      //"language": "PL",
//      "password": "F4980754A4BCF512E9D4C20B0E3B51B7E32919513FF36B0D0244310BA8101137"
      "password": "d4bf378c00377128be56efeca51da7e01fdae1fbffa4a84693bbf2fdfd72280b"
    };

    jQuery.ajax({
      url: "https://uss-test.poczta-polska.pl/uss/v2.0/tracking/login",
      data: dane,
     error: function(e) {
       console.log('Error pobrania danych do zalogowania');
       console.log(e);
       },
      type: "POST",
      dataType: 'json',  
      contentType: "application/json",
      success: function(data){
        console.log(data);
      }
      });
  }

  $("#sledzenie").on("click",function(){
    var spin = $(this).children(".spinner-border");
    srodowisko = jQuery("input[name='uss_s']:checked").val();
    //get_token();
    
    spin.removeClass("d-none");
    var parcel = jQuery(this).parents().children('input[name="parcel"]');
    var parcel = jQuery(document).find('input[name="parcel"]');
    var parcelInfo;
    
    if (sprawdzPrzesylke(parcel.val()) ) {
      if(parcel.val().length >6){
        var params = {
          // Request parameters
            "states": jQuery("input[name='states']:checked").val(),
            "events": "true",
            "addPostOfficeInfo": true,
            "language": (get_params('language')?get_params('language'):jQuery("input[name='language']:checked").val()),
            "number": parcel.val()
        };
        jQuery('#sledzenie').prop("disabled", true);
        jQuery.ajax({
              url: config[jQuery("input[name='uss_s']:checked").val()].url+"/uss/v"+jQuery("input[name='uss_v']:checked").val()+"/tracking/checkmailex", //((jQuery("input[name='uss_s']:checked").val() == "test")? "https://uss-test.poczta-polska.pl":"https://uss.poczta-polska.pl")+"/uss/v"+jQuery("input[name='uss_v']:checked").val()+"/tracking/checkmailex",
                beforeSend: function(xhrObj){
                    xhrObj.setRequestHeader("api_key",config[jQuery("input[name='uss_s']:checked").val()].token);
                    // xhrObj.setRequestHeader("Access-Control-Allow-Origin","*");
                    //  xhrObj.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost');
                    //  xhrObj.setRequestHeader('Access-Control-Allow-Credentials', 'true'); 
                      //xhrObj.addRequestHeader("Host:","*");
                  //  xhrObj.setRequestHeader("Access-Control-Allow-Headers","origin, content-type, content-length, accept, authorization, api_key, content-disposition, captcha-uid");
                },
                data: params,
                type: "GET",
                contentType: "application/json",
                crossDomain: true,
            })
            .done(function(data) {
              spin.addClass("d-none");
              
              console.log("Dane przesyłki z USS:");
              console.log(data);

              jQuery('#sledzenie').prop("disabled", false);
              parcelInfo = data.mailInfo;
              jQuery("#parcelNumber").removeClass("d-none");
              var modal = jQuery('#eMonitoring');
              modal.find('#myModalLabel').text(parcelInfo?.number);
            
              // var csv_file_API = './sledzenie.json';
              var kraje =[];
              // $.getJSON( csv_file_API, function(a) {
              //   //console.log( "success" ,a);
              //   kraje= a;
              // })
              // console.log("kraje");
              //console.log(kraje);      

              var stany_all = ['P_D','P_NAD','P_WD']; 

              divParcelInfo = jQuery('#parcelInfo');
              divParcelAction = jQuery('#parcelAction');
              divParcelInfo.empty();
              divParcelAction.empty('');
              switch (data?.mailStatus){
                case -2:
                  modal.find('#parcelInfo').html("<div class='alert alert-danger' role='alert'><h2>UWAGA!</h2><h3>Przesyłka o numerze <u>"+data?.number+"</u> nie istnieje!</h3></div>");
                  break;
                case -99:
                modal.find('#parcelInfo').html("<div class='alert alert-danger justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h3>Błąd systemu! Kod 99</h3></div>");
                break;
              case -1:
                modal.find('#parcelInfo').html("<div class='alert alert-danger justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h4>Przesyłka o numerze <u>"+data?.number+"</u> została nadana pond 30 dni temu! </h4><h4>Wgląd w dane jest niedostępny.</h4></div>");
                break;
              case 2:
                modal.find('#parcelInfo').html("<div class='alert alert-danger justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h3>Przesyłka o numerze <u>"+data?.number+"</u> istnieje, ale w podanym okresie nie ma zdarzeń do wyświetlenia</h3></div>");
                break;
              case 1:
                modal.find('#parcelInfo').html("<div class='alert alert-warning justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h3>Istnieje więcej przesyłek o numerze <u>"+data?.number+"</u></h3></div>");
                  break;
                default:
  
                (parcelInfo?.states && parcelInfo?.states?.length>0)? divParcelInfo.append("<div class='row p-2'><div class='col-12 text-center'>"+generateState(parcelInfo?.states)+" </div></div>"):"";//map(u => u.code).join(', ')

                divParcelInfo.append("<h5>Dane przesyłki:</h5>");
                divParcelInfo.append("<div class='block text-center text-secondary'>");
                            //     <i class="text-success fas fa-box-open" title="Przygotowanie do nadania"></i> - 
                            //     <i class="text-success fas fa-truck-loading" title="Odebrana przez kuriera"></i> - 
                            //     <i class="text-success fas fa-truck" title="W transporcie"></i> - 
                            //     <i class="text-success fas fa-people-carry" title="Wydana do doręczenia"></i> - 
                            //     <i class="text-danger fas fa-map-marker-alt" title="Oczekuje na odbiór z punktu"></i> -
                            //     <i class="fa fa-check-circle" title="Doręczono"></i>
                            // </div>
                divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end p-2'><strong>Rodzaj endpointu</strong></div><div class='col-md-7 p-2 text-underline'>WYSZUKIWANIE USS metoda checkmailex</div></div>");
                divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Data nadania:</strong></div><div class='col-md-7'>"+(moment(parcelInfo?.dispatchDate).format('YYYY-MM-DD hh:mm'))+"</div></div>");
                (parcelInfo?.typeOfMailName)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Usługa:</strong></div><div class='col-md-7'>"+parcelInfo?.typeOfMailName+" "+(parcelInfo?.deliveryMode? "("+parcelInfo?.deliveryMode+")":"")+"</div></div>"):"";
  			  			(parcelInfo?.dispatchCountryName)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Kraj nadania:</strong></div><div class='col-md-7'>"+parcelInfo?.dispatchCountryName+" ("+parcelInfo?.dispatchCountryCode+") "):"";//+((parcelInfo.dispatchCountryCode !== "PL")?+"<br/><a href='#' class='btn p-1 btn-outline-dark'>Wyszukaj w kraju nadania</a>":"")+"</div></div>");
                (parcelInfo?.recipientCountryName)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Kraj doręczenia:</strong></div><div class='col-md-7'>"+parcelInfo?.recipientCountryName+" ("+parcelInfo?.recipientCountryCode+") <br/><a href='#' class='btn p-1 btn-outline-dark'>Wyszukaj w kraju doręczenia</a></div></div>"):"";
                (parcelInfo?.typeOfMailCode)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Gabaryt:</strong></div><div class='col-md-7'>"+parcelInfo?.typeOfMailCode+"</div></div>"):'';
                (parcelInfo?.weight)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Masa:</strong></div><div class='col-md-7'>"+parcelInfo?.weight+" kg</div></div>"):'';
                (parcelInfo?.dispatchPostOffice?.name)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Miejsce nadania:</strong></div><div class='col-md-7'>"+parcelInfo?.dispatchPostOffice?.name+" </div></div>"):'';
                (parcelInfo?.recipientPostOffice?.name)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Miejsce doręczenia:</strong></div><div class='col-md-7'>"+parcelInfo?.recipientPostOffice?.name+" </div></div>"):'';
                (parcelInfo?.additionalServices && parcelInfo.additionalServices?.length>0)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Usługi dodatkowe:</strong></div><div class='col-md-7'>"+parcelInfo.additionalServices.map(u => u.name).join(', ')+" </div></div>"):"";
                var zdarzenia = parcelInfo?.events;

                var zdarzenia_pogrubienie = ['P_D','P_NAD','P_WD']; 
                
                
                divParcelInfo.append( potwierdzenieZaplaty(parcelInfo, divParcelInfo));

                if(zdarzenia?.length>0){
                  divParcelAction.append("<h5>Status przesyłki:</h5>");
                  jQuery.each( (zdarzenia.reverse()), function( key, value ) {
                    divParcelAction.append("<div class='row p-2'><div class='col-md-4 col-5 d-flex justify-content-end'>"+(moment(value.time).format('YYYY-MM-DD hh:mm'))+"</div><div class='col-1'><i class='fa"+((zdarzenia_pogrubienie.indexOf(value.code)>=0)?'s':'r')+" fa-circle text-warning'></i></div><div class='col-md-7 col-6'><strong>"+value.name+"</strong></div></div>");
                  });
                }
              }
              
            })
            .fail(function(xhrObj, textStatus, error) {
                console.log(xhrObj,textStatus,error);
                alert("error: blad komunikacij z endpointem: "+textStatus);
                jQuery('#sledzenie').prop("disabled", false);
            })
            .always(function(){
              jQuery('#sledzenie').prop("disabled", false);
            });  
      }else{
        alert('Zbyt krótki numer przesyłki!');
      }
    }else{
      alert('Nieprawidłowy numer przesyłki. Niedozwolone znaki!');
    }	
    });



  $("#sledzenie-api").on("click",function(){
  var spin = $(this).children(".spinner-border");
  spin.removeClass("d-none");
  var parcel = jQuery(this).parents().children('input[name="parcel"]');
	var parcel = jQuery(document).find('input[name="parcel"]');
	var parcelInfo;
	if (sprawdzPrzesylke(parcel.val()) ) {
		if(parcel.val().length >6){
			var params = {
            // Request parameters
            	"details": "true",
              "filter": "false",
              "language": jQuery("input[name='language']:checked").val()
        	};
      		jQuery('#sledzenie').prop("disabled", true);
      jQuery.ajax({
            //url: "https://uss.poczta-polska.pl/uss/v1.1/tracking/checkmail?number="+parcel.val()+"&language=X1",
	            url: "https://api.poczta-polska.pl/track/v1/shipments/"+parcel.val()+"?" + $.param(params),
	            beforeSend: function(xhrObj){
	                // Request headers
	                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","4bb63b8ed8c54dbaa67a3bd05810cfe2");
	            },
	            type: "GET",
	        })
	        .done(function(data) {
            spin.addClass("d-none");
            console.log(data.przesylki);
	        	parcelInfo = data.przesylki[0].danePrzesylki;
            jQuery("#parcelNumber").removeClass("d-none");
	        	//jQuery('#eMonitoring').modal('show');
	        	// 00259007738539428532
	        	// artur 00559007730113934232 >30dni
					var modal = jQuery('#eMonitoring');
//          console.log(modal);
		  			modal.find('#myModalLabel').text(data.przesylki[0].numer);
            var kraje =[];
          
		  			divParcelInfo = jQuery('#parcelInfo');
		  			divParcelAction = jQuery('#parcelAction');
		  			divParcelInfo.empty();
		  			divParcelAction.empty('');
		  			switch (data.przesylki[0].status){
		  				case -2:
			  				modal.find('#parcelInfo').html("<div class='alert alert-danger' role='alert'><h2>UWAGA!</h2><h3>Przesyłka o numerze <u>"+data.przesylki[0].numer+"</u> nie istnieje!</h3></div>");
		  					break;
		  				case -99:
							modal.find('#parcelInfo').html("<div class='alert alert-danger justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h3>Błąd systemu! Kod 99</h3></div>");
							break;
						case -1:
							modal.find('#parcelInfo').html("<div class='alert alert-danger justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h4>Przesyłka o numerze <u>"+data.przesylki[0].numer+"</u> została nadana pond 30 dni temu! </h4><h4>Wgląd w dane jest niedostępny.</h4></div>");
							break;
						case 2:
							modal.find('#parcelInfo').html("<div class='alert alert-danger justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h3>Przesyłka o numerze <u>"+data.przesylki[0].numer+"</u> istnieje, ale w podanym okresie nie ma zdarzeń do wyświetlenia</h3></div>");
							break;
						case 1:
							modal.find('#parcelInfo').html("<div class='alert alert-warning justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h3>Istnieje więcej przesyłek o numerze <u>"+data.przesylki[0].numer+"</u></h3></div>");
		  					break;
		  				default:
//			  			divParcelInfo.append("<table class='table border table-striped'><tbody>");
              divParcelInfo.append("<h5>Dane przesyłki:</h5>");
              divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end p-2'><strong>Rodzaj endpointu</strong></div><div class='col-md-7 text-success p-2'>WYSZUKIWANIE API metoda 'shipments'</div></div>");
              divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Data nadania:</strong></div><div class='col-md-7'>"+parcelInfo.dataNadania+"</div></div>");
			  			divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Usługa:</strong></div><div class='col-md-7'>"+parcelInfo.rodzPrzes+"</div></div>");
//			  			divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Kraj nadania:</strong></div><div class='col-md-7'>"+parcelInfo.krajNadania+" ("+parcelInfo.kodKrajuNadania+") "+((parcelInfo.kodKrajuNadania !== "PL")?+"<br/><a href='#' class='btn p-1 btn-outline-dark'>Wyszukaj w kraju nadania</a>":"")+"</div></div>");
			  			divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Kraj doręczenia:</strong></div><div class='col-md-7'>"+parcelInfo.krajPrzezn+" ("+parcelInfo.kodKrajuPrzezn+") <br/><a href='#' class='btn p-1 btn-outline-dark'>Wyszukaj w kraju doręczenia</a></div></div>");
			  			(parcelInfo?.kodRodzPrzes)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Gabaryt:</strong></div><div class='col-md-7'>"+parcelInfo.kodRodzPrzes+"</div></div>"):'';
              (parcelInfo?.masa)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Masa:</strong></div><div class='col-md-7'>"+parcelInfo.masa+" kg</div></div>"):'';
			  			(parcelInfo?.urzadNadania.nazwa)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Urząd nadania:</strong></div><div class='col-md-7'>"+parcelInfo.urzadNadania.nazwa+" ("+parcelInfo.urzadNadania.daneSzczegolowe.ulica+" "+parcelInfo.urzadNadania.daneSzczegolowe.nrDomu+", "+parcelInfo.urzadNadania.daneSzczegolowe.pna+" "+parcelInfo.urzadNadania.daneSzczegolowe.miejscowosc+")</div></div>"):'';
			  			(parcelInfo?.urzadPrzezn.nazwa)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Miejsce doręczenia:</strong></div><div class='col-md-7'>"+parcelInfo.urzadPrzezn.nazwa+" ("+parcelInfo.urzadPrzezn.daneSzczegolowe.ulica+" "+parcelInfo.urzadPrzezn.daneSzczegolowe.nrDomu+", "+parcelInfo.urzadPrzezn.daneSzczegolowe.pna+" "+parcelInfo.urzadPrzezn.daneSzczegolowe.miejscowosc+")</div></div>"):'';

              var zdarzenia = parcelInfo?.zdarzenia;
              var zdarzenia_pogrubienie = ['P_D','P_NAD','P_WD']; 

              divParcelAction.append("<h5>Status przesyłki:</h5>");
              jQuery.each( (zdarzenia.reverse()), function( key, value ) {
				  			divParcelAction.append("<div class='row p-2'><div class='col-md-4 col-5 d-flex justify-content-end'>"+value.czas+"</div><div class='col-1'><i class='fa"+((zdarzenia_pogrubienie.indexOf(value.kod)>=0)?'s':'r')+" fa-circle text-warning'></i></div><div class='col-md-7 col-6'><strong>"+value.nazwa+"</strong></div></div>");
						  });
            }
            
	        })
	        .fail(function(xhrObj, textStatus, error) {
	        	console.log(xhrObj,textStatus,error);
	            alert("error");
	        })
	        .always(function(){
	        	jQuery('#sledzenie').prop("disabled", false);
	        });
		}else{
			alert('Zbyt krótki numer przesyłki!');
		}
	}else{
		alert('Nieprawidłowy numer przesyłki. Niedozwolone znaki!');
	}	
  });


//checkmailsubscriptoion
$("#sledzenie-subscription").on("click",function(){
  var spin = $(this).children(".spinner-border");
  //console.log("Język w funkcji");
  //console.log(get_params('language'));
  
  console.log("Metoda checkmailSubscription: "); 
  //get_token();
  
  spin.removeClass("d-none");
 // var parcel = jQuery('input[name="parcel"]').;
  var parcel = jQuery(document).find('input[name="parcel"]');
  var parcelInfo;
  
  if (sprawdzPrzesylke(parcel.val()) ) {
    if(parcel.val().length >6){
      var params = {"params": {
            // Request parameters
              "from":jQuery("#data-od").val(),
              "to":jQuery("#data-do").val(),
              //"email": (jQuery("#uss_email").val()?jQuery("#uss_email").val().toUpperCase():""),
              "mobile": jQuery("#uss_tel").val(),
              "language": (get_params('language')?get_params('language'):jQuery("input[name='language']:checked").val().toUpperCase())
          },
          "settings":{
            "url": ((jQuery("input[name='uss_v']:checked").val() == "2.0")? "http://194.93.124.155:8743":"https://uss.poczta-polska.pl")+"/uss/v"+jQuery("input[name='uss_v']:checked").val()+"/tracking/checkmailsubscription",
            "api_key": (jQuery("input[name='uss_v']:checked").val() == "2.0")? "oqmqN5t9WEf9r6bAMJ55mcB3RiJ1947+q32XyTitITAdKy5Zr/0KhpVefa5o1c2kyhdRRv2Ob6Q7BvGOTzw9F9XJfdtrJ3UfukZiDZkR6kOi5cNZR2sYQA5W84Ucha5kpojloceZl3DuKK6Q/J/y2QT4k+2vLrekByCkkSZ8PU0=.ODEyRTA0QTlFNEQ3MzNGNzA0RTQ3MENGRUI4MkM5MEE3RDQzNUZGMTcyNkMyQjJERjRGNUIwNjE0Q0QzQjAzRA==.d4d31169405a4a5eb8e33f0043390587":"BiGwVG2XHvXY+kPwJVPA8gnKchOFsyy39Thkyb1wAiWcKLQ1ICyLiCrxj1+vVGC+kQk3k0b74qkmt5/qVIzo7lTfXhfgJ72Iyzz05wH2XZI6AgXVDciX7G2jLCdoOEM6XegPsMJChiouWS2RZuf3eOXpK5RPl8Sy4pWj+b07MLg=.Mjg0Q0NFNzM0RTBERTIwOTNFOUYxNkYxMUY1NDZGMTA0NDMwQUIyRjg4REUxMjk5NDAyMkQ0N0VCNDgwNTc1NA==.b24415d1b30a456cb8ba187b34cb6a86",
            "type": "GET"
          }
        };
          console.log(params);
          jQuery('#sledzenie').prop("disabled", true);

      jQuery.ajax({
        url: "https://kartelmedia.co.uk/pocztex/checkMailSubscription.php",
          // dataType:"json",
          data:params,
          type: "GET",
          contentType: "application/json",
          //    crossDomain: true,
          })
          .done(function(data) {
            spin.addClass("d-none");
            console.log("Dane przesyłki z checkmailsubscription:");
            console.log(JSON.parse(data));
          })
          .fail(function(xhrObj, textStatus, error) {
            console.log(xhrObj,textStatus,error);
              alert("error: blad komunikacij z endpointem: "+textStatus);
          })
          .always(function(){
            jQuery('#sledzenie').prop("disabled", false);
          });

//			console.log(data);
//			var url = window.location.href;
//			location.href = url.substring(0,url.length - window.location.hash.length) + '#/sledzenie-przesylki/'+parcel.val().toUpperCase();
//			location.href = 'https://emonitoring.poczta-polska.pl/?numer='+parcel.val().toUpperCase();
    }else{
      alert('Zbyt krótki numer przesyłki!');
    }
  }else{
    alert('Nieprawidłowy numer przesyłki. Niedozwolone znaki!');
  }	
  });


//przechwytywanie wysyłania formularza
jQuery(document).on('submit','form#submitConfirmationForm', przygotujDanePZC);	
	
function responseConfirmation(data, params){
    // console.log("Status połączenia: ")
    // console.log(status);
    jQuery(document).find("#errorResponse").empty().text( 
    function(s){
      switch(data?.statusText){
        case "badCaptcha": 
          return "Wprowadzony kod jest niepoprawny, spróbuj ponownie.";
        case "paymentNotFound":
          return "Nie znaleziono Poświadczonego Zgłoszenia Celnego dla wprowadzonych kryteriów";
        default:
          return data?.statusText;
      }
    });

    if(data.status == 400 || data.status == 404){
      jQuery(document).find('#refreshGetToken').trigger('click');
    }
    if(data.status == 200){
      const blob = data.blob(); 

      console.log("blob");
      console.log(blob);
      console.log("data");
      console.log(data);
          const url = window.URL || window.webkitURL;
          //link = url.createObjectURL(blob);

          urlblob = url.createObjectURL(
            blob
          );
          const link = document.createElement('a');
          link.href = urlblob;
          link.setAttribute('download', "PP_PZC_"+params['parcelId']+"."+params['responseType']);
          document.body.appendChild(link);
          link.click();
          link.remove();
//          $("#submitConfirmationForm").empty().html("<div class='h5'>Poświadczenie zgłoszenia celnego zostało wygenerowane i pobrane.</div>");
//          setTimeout(removeDiv("#submitConfirmationForm"),5000);
          console.log(link);
      // }

    }
    
}

function przygotujDanePZC(e){
  var v = e.currentTarget;
  e.preventDefault();
  jQuery(document).find("#errorResponse").text();
  var params = $.param($(this).formToArray());
  var paramsArray = $(this).formToArray();
  sendRequest(null,"paymentconfirmation?"+params,"GET",paramsArray,responseConfirmation,);
}

async function sendRequest(inputData,endpoint,typ,params){
  const response = await fetch(
    config[jQuery("input[name='uss_s']:checked").val()].url+"/uss/v"+jQuery("input[name='uss_v']:checked").val()+"/tracking/"+endpoint, {
    method: typ, // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      // "Content-Type": "application/json",
      "api_key": config[jQuery("input[name='uss_s']:checked").val()].token,
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  console.log("ODP FETCH");
  console.log(response);
  //return callback(response,fwdparams);

  jQuery(document).find("#errorResponse").empty().text( 
    function(s){
      switch(response?.statusText){
        case "badCaptcha": 
          return "Wprowadzony kod jest niepoprawny, spróbuj ponownie.";
        case "paymentNotFound":
          return "Nie znaleziono Poświadczonego Zgłoszenia Celnego dla wprowadzonych kryteriów";
        default:
          return response?.statusText;
      }
    });

    if(response.status == 400 || response.status == 404){
      jQuery(document).find('#refreshGetToken').trigger('click');
    }
    if(response.status == 200){
      const blob = await response.blob(); 
        const url = window.URL || window.webkitURL;
        //link = url.createObjectURL(blob);
        urlblob = url.createObjectURL(
          blob
        );
        const link = document.createElement('a');
        link.href = urlblob;
        link.setAttribute('download', "PP_PZC_"+params['parcelId']+"."+params['responseType']);
        document.body.appendChild(link);
        console.log(link);
        link.click();
        link.remove();
        $("#submitConfirmationForm").empty().html("<div class='h5 p-3'>Poświadczenie zgłoszenia celnego zostało wygenerowane i pobrane.</div>");
//          setTimeout(removeDiv("#submitConfirmationForm"),5000);
    } 
}

async function sendRequest2(params,endpoint,typ,callback,fwdparams){
  jQuery.ajax({
    url: config[jQuery("input[name='uss_s']:checked").val()].url+"/uss/v"+jQuery("input[name='uss_v']:checked").val()+"/tracking/"+endpoint,
      beforeSend: function(xhrObj){
          xhrObj.setRequestHeader("api_key",config[jQuery("input[name='uss_s']:checked").val()].token)
      },
      data: (params?? params),
      type: typ,
      contentType: "application/json",
      crossDomain: true,
      success: function(resp,status,xhr){
        callback(resp,status,xhr,fwdparams)
      }, 
      error: callback 
  });

}


function removeDiv(div){
  $(div).remove();
}


function sprWarunek(x,u){
  if (u =="nadaj_usluga_2"){
    return ((parseInt(x) > 2 || x == "OPZ")? true : false);
  }
}


  function csvToArray(str, delimiter = ";") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  
    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });
      // return the array
  return arr;
  }

/* OBSLUGA NADAJ PRZESYLKE */
jQuery(document).on("change","input[type='radio']",function(){
    jQuery("#"+this.name).text(jQuery(this).attr("title"));
    // console.log("SRODOWISKO");
    // console.log(config[jQuery("input[name='uss_s']:checked").val()]);
    //console.log(jQuery(this).attr("title"));=
    console.log(this.name,this.value);
    //sprWarunek ((this.value)),"<=2");
    disable_enable_button("nadaj_usluga_2",sprWarunek((this.value),"nadaj_usluga_2"));
  });

  jQuery(document).on('click','#refreshGetToken',triggerGetCaptcha);

  function triggerGetCaptcha(){
    return getCaptcha();
  }

  function potwierdzenieZaplaty(parcel){
    var zdarzenia_potwierdzen = ['P_ZWOLDDOR','P_ROZL_CEL','P_D']; //dopisałem P_D
    var parcelStatus = parcel?.mailStatus;
    var parcelType = parcel?.typeOfMailCode;
    // console.log(containsAny(parcel?.events,zdarzenia_potwierdzen));

    if (parcelType == 'UNREGISTERED_MAIL_TYPE' && parcelStatus == 0){
      var odp = "<div class='alert alert-warning justify-content-center text-center' role='alert'><h2 class='p-2'>UWAGA!</h2><h3>potweirdzenie nie jest jeszcze gotowe dla <u>"+parcel?.number+"</u></h3></div>"
      return odp;

    }
    if (containsAny(parcel?.events,zdarzenia_potwierdzen)){
      const captcha = triggerGetCaptcha();
      console.log(captcha);
      var odp = "<form id='submitConfirmationForm' class='m-4 p-3 bg-light '><div class='row p-3 pb-1'>";
      odp +="<div class='col-12 h5 p-2'><u>Poświadczenie zgłoszenia celnego</u></div>";
      odp +="<div class='col-12 col-md-6 p-2 d-flex align-items-center text-md-end'>Wybierz formę pliku:</div>";
      odp +="<div class='row col-12 col-md-6 text-center g-1 p-0'>"+
              "<div class='form-check col-12 col-md-6 p-1 m-0'>"+
                  "<input class='form-check-input d-none' type='radio' name='responseType' id='formatpdf' value='pdf' title='states' checked>"+
                  "<label class='form-check-label border border-2 w-100 rounded p-1 h4 ' for='formatpdf'>PDF</label>"+
              "</div><div class='form-check col-12 col-md-6 p-1 m-0'>"+
                  "<input class='form-check-input d-none' type='radio' name='responseType' id='formatxml' value='xml' title='states'>"+
                  "<label class='form-check-label border border-2 w-100 rounded p-1 h4' for='formatxml'>XML</label>"+
              "</div></div>";
      odp +="<div class='row g-1 p-0'>";
      odp +="<div class='col-12 col-md-6 p-2 align-middle d-flex align-items-center text-md-end'>Kwota należności celno-podatkowych:</div>";
      odp +="<div class='col-12 col-md-6 p-1'><input type='number' step='any' class='form-control-lg w-100' name='amount' id='amount' data-inputmask='\'mask\': \'999999999,99\''  required /><div class='invalid-feedback'>Wpisz kwotę</div></div></div>";
      odp +="<div class='col-12 p-1'><input type='hidden' id='parcelId' name='parcelId' value='"+parcel.number+"' ><input type='hidden' id='captchaUid' name='captchaUid' ></div>";
      odp +="<div class='col-12 col-md-5 text-center text-md-end p-2'><img src='' id='imageCaptcha' class='w-100' /></div>";
      odp +="<div class='col-12 col-md-7 text-center text-md-start p-1 pb-2 d-grid align-baseline'><p class='w-100 pt-2 pb-0'>Kod z obrazka:</p><input class='form-control-lg' type='text' id='captchaAnswer' name='captchaAnswer' required ><div class='invalid-feedback'>Wpisz kod captcha.</div></div>";
      odp +="<div id='errorResponse' class='col-12 text-center text-danger p-2'></div>";
      odp +="<div class='col-12 pt-4 p-1 text-center d-md-flex justify-content-md-between'><button type='button' id='refreshGetToken' class='btn btn-outline-danger'>Generuj nowy kod</button> <button id='confirmationPayment' type='submit' class='btn btn-danger'>Pobierz potwierdzenie </button></div>";
      odp +="</div></form>";
      return odp;
    }
  }

  

  function disable_enable_button(name,result){
    i = jQuery("#"+name);
    i.prop("disabled",result);
    if (i.is(":disabled")){
      i.prop("checked",false);
    }
  }


  //var realValues = [0.5, 1, 2, 5, 10, 20, 30, 50];
  //var labelValues = ['do 0.5kg', 'do 1kg', 'ponad 1kg do 2kg', 'ponad 2kg do 5kg', 'ponad 5kg do 10kg','ponad 10kg do 20kg', 'ponad 20kg do 30kg', 'ponad 30kg do 50kg'];

  var returnWyniki;

  // jQuery(".widgetOWP").on("click",function(){
  //   var dostawca = {
  // //		basemapProvider: 'OpenStreetMap',
  // //		geocoderProvider: 'Nominatim'
  //   };
  //   console.log("TUTAJ");
  //   returnWyniki = this.name+"_OWP";
  //   PPWidgetApp.toggleMap(PokazWynik,false,'','',dostawca);
  //     console.log("weszlo");
  //     $("#pp-widget-iframe").on("load",function(a,b){
  //       console.log(a,b);
  //       console.log("załadowałem mape PP WIDGET");
  //       jQuery(document).on("focus",".ppw-logo",function(){
  //         $(this).remove();
  //       })
  //     });
  // });
  
  function PokazWynik(w){
    console.log("GDZIE: "+returnWyniki);
    jQuery("#"+returnWyniki).html("<div class='lead border text-mutted'><small class='small'><strong><u>"+w.name+"</u> ("+w.pni+")</strong><br/>"+w.street+"<br/>"+w.zipCode+" "+w.city+"<br/>"+w.province+"</small></lead>");
    console.log(w);
    return w;
  }
//   $(window).on('scroll resize', function() {
//   height = jQuery("#main-menu").offset().top;
//   hs = $(this).scrollTop();
//   if (height <= hs){
//         $(".nav-link span").addClass('d-sm-none');
//         $(".nav-item:not(.nav-item-dropped), .navbar-brand > img").addClass("animations");
//         //$('#main-menu').height('auto').addClass('p-0');
//   }else{
//     $(".nav-link span").removeClass('d-sm-none');
//     $(".nav-item, .navbar-brand > img").removeClass("animations");
//     //$('#main-menu').height('auto').removeClass('p-0');
//   }
//  console.log(height, hs);
//   });




  $("input[name='filtr']").on("click",function(){
    console.log(this.id);
    $("."+this.id).show('fast');
    $(".filtr").not("."+this.id).hide('fast');
  });

  $(".binfo,.minfo").on("click",function(){
   // alert($(this).width()+", "+$(this).height());
  });

  $("input#nadaj_waga_0").change(function(){
    $(this).parent().find("label").text("Masa przesyłki do: "+this.value+" kg");
  });




  /** SHOPLO **/
  function format_cena(x) { // Zamaria
    return x.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  }

  $('[data-fancybox]').fancybox({
    toolbar  : false,
    smallBtn : true,
    keys : {
      close  : null
    },
    iframe : {
      preload : true
    },
    afterShow: function(a,b) {

    }
  });


/*$(document).on('click',".oprodukcie",function(e){
  var myOffcanvas = document.getElementById('oprodukcie');
  //$("#oprodukcie").toggle();
  //console.log($("#oprodukcie"));
//  console.log(myOffcanvas);
  myOffcanvas.addEventListener('show.bs.offcanvas', function (event) {
    console.log(event);
    var e = event.relatedTarget;
    var t = e.getAttribute('data-bs-title');
    var d = e.getAttribute('data-bs-description');
    jQuery("#o-produkcieLabel").html(t);
    jQuery("#o-produkcie modal-body").html(t);
  });
//});*/
/* obsługa ladowania zewnetrznych www */


function generateState(st){ 
    var kod=[];
    var st_code=st.map(u => u.code);
    // st_code.push("ZW");
    // st_code.push("ODB");
    // st_code.push("OP");
    var states=[
      
      {code:"PRZ",  icon:"fa-2x fas fa-solid fa-boxes-packing"},
      {code:"NA",  icon:"fa-2x fas fa-truck-loading"},
      {code:"TR",  icon:"fa-2x fas fa-truck"},
      //{code:"DOR",  icon:"fa-2x fas fa-people-carry"},
      {code:"DO",  icon:"fa-2x fas fa-check-circle"},

    ];
    //console.log(states.indexOf(states.find((element) => element.code == "DOR")));
    //console.log(states.indexOf("DOR"));
      ((st_code.indexOf("OCP")>=0)? states.splice(states.indexOf(states.find((element) => element.code == "TR")),0,{code:"OCP",  icon:"fa-2x fa-solid fa-person-military-pointing"}):"");
      ((st_code.indexOf("ODB")>=0)? states.splice(states.indexOf(states.find((element) => element.code == "TR")),1,{code:"ODB",  icon:"fa-2x fa-solid fa-boxes-packing"}):"");
      ((st_code.indexOf("DOR")>=0)? states.splice(states.indexOf(states.find((element) => element.code == "TR")),1,{code:"DOR",  icon:"fa-2x fa-solid fa-people-carry"}):"");
      ((st_code.indexOf("OP")>=0)? states.splice(states.indexOf(states.find((element) => element.code == "ODB"))+1,0,{code:"OP",  icon:"fa-2x fa-solid fa-boxes"}):"");
      ((st_code.indexOf("AW")>=0)? states.splice(states.indexOf(states.find((element) => element.code == "DO")),0,{code:"AW",  icon:"fa-2x fa-solid fa-envelope"}):"");
      ((st_code.indexOf("ZW")>=0)? states.splice(states.indexOf(states.find((element) => element.code == "DO")),0,{code:"ZW",  icon:"fa-2x fa-solid fa-reply"}):"");
      //((st_code.indexOf("OP")<0)?states.splice(states.indexOf("DOR"),3,{code:"DO",  icon:"fa-2x fas fa-home"}):"");
    kod.push("<div class='block text-center text-light p-3'>");
    jQuery.each(states, function( key, value ) {
      kod.push("<i class='p-1 m-1 "+((st_code.indexOf(value.code)>=0)?'text-success ':'text-secondary ')+value.icon+"' title='"+value.code+"'></i>");
      
    });
    kod.push("</div>");
    // console.log(kod);
    // console.log(st_code);
    // console.log(states);
    return kod.join(" ");
}





  // PPWidgetApp?.embedMap('mapka')
  // .then(function () {
                      
  //     $.when(PPWidgetApp.autoComplete('#adres')).then(function(autocomplete){
  //         autocomplete.on('autocomplete-selected', function(e) {
  //             // Zdarzenie po wybraniu z listy podpowiedzi wyswietlonej pozycji
  //             console.log(e.selected);

  //             PPWidgetApp.resetMap();
          
  //             var marker = PPWidgetApp.generateMarker({
  //                 name: e.selected.val,
  //                 latitude: e.selected.lat,
  //                 longitude: e.selected.lng,
  //                 pni: '232423'
  //             }, '<h1>Testowy POPUP</h1>');

  //             PPWidgetApp.centerMap(marker, [
  //                 e.selected.northeast, e.selected.southwest
  //             ]);                        
  //         });
  //     });

  //     $(document).on('click', '#szukaj-punktow', function (e) {
  //         e.preventDefault();

  //         // Wykonanie geokodowania na podstawie wprowadzonego tekstu
  //         PPWidgetApp.geoCode(
  //             $('#adres').val(),
  //             function(results) {
  //                 console.log(results);

  //                 // Resetuje ustawienia mapy
  //                 // - usuwa wszystkie markery
  //                 // - zamyka wszystkie okienka typu Popup
  //                 // - zatrzymuje wszystkie animacje zwiazane z mapa
  //                 PPWidgetApp.resetMap();

  //                 var markers = []

  //                 $.each(results, function() {
  //                     console.log(this.name + ', ' + this.center.lat + ', ' + this.center.lng);
  //                     // Tworzy marker na podstawie obowiazkowo podanych parametrow
  //                     // name - nazwa markera np. ul. Rodziny Hiszpanskich
  //                     // latitude - szerokosc geograficzna
  //                     // longitude - dlugosc geograficzna
  //                     // type - predefiniowany typ markera (wyswietlanej ikony) moze przyjmowac nastepujace wartosci
  //                     //  "POCZTA", "ORLEN", "AUTOMAT_POCZTOWY", "RUCH", "ZABKA", "FRESHMARKET"
  //                     // w przypadku podania innej niz w/w wartosci ustawiana jest domyslna ikona
  //                     // pni - kod PNI punktu, jezeli wyswietlany punkt nie ma kodu PNI nalezy podac unikalna wartosc
  //                     // Jako drugi argument opcjonalnie podaje sie zawartosc okienka typu Popup wyswietlanego po kliknieciu w marker,
  //                     // moze przyjmowac nastepujacego wartosci:
  //                     // - lancuch znakow
  //                     // - funkcja(pni, data) ktora zwraca dla podanego kodu PNI oraz danych skojarzonych z danych markerem 
  //                     //   (jest to obiekt, przekazywany jako pierwszy argument do funkcji generateMarker) zawartosc okienka typu Popup
  //                     var marker = PPWidgetApp.generateMarker({
  //                         name: this.name,
  //                         latitude: this.center.lat,
  //                         longitude: this.center.lng,
  //                         type: 'POCZTA',
  //                         pni: '9280494'
  //                     }, function(pni, data) {
  //                         var tooltipHtml = '<div class="marker-tooltip">'
  //                          + '<p class="marker-tooltip-header"><b>'
  //                          + data.name
  //                          + '</b></p>'
  //                          + '<p class="marker-tooltip-info"><b>Opis:</b><br/>'
  //                          + 'lat: ' + data.latitude + '<br />'
  //                          + 'lng: ' + data.longitude+ '<br />'
  //                          + '</p>'
  //                          + '</div>';
  //                         return tooltipHtml;
  //                     });
  //                     marker.bbox = this.bbox;

  //                     marker.on('click', function(e) {
  //                         console.log(e.target._zIndex);

  //                     })
                     
  //                     markers.push(marker);
  //                 })

  //                 if (markers.length > 0)
  //                 {                                
  //                     var i = Math.floor(Math.random() * (markers.length - 1));                                
  //                     PPWidgetApp.centerMap(markers[i], PPWidgetApp.getBounds(markers));
  //                     for(i = 0; i <markers.length; i++) {
  //                         PPWidgetApp.addMarker(markers[i]);
  //                     }
  //                     //PPWidgetApp.addMarkers(markers);
  //                 }
  //             }
  //         );

  //         return false;
  //     });
  // });   


})(); //end async()

});


//wlasna funkcja do sczytywania formularzy z unchecked input
(function ($) {
  $.fn.formToArray = function () {
  var data ={};
    jQuery(this).serializeArray().map( function(x){data[x.name] = (!isNaN(x.value) ? parseFloat(x.value) : x.value);} );
    jQuery(this).find("input[type='checkbox']").each(function () {
        data[this.name] = Boolean(this.checked);
    });
    jQuery(this).find("input:hidden").each(function () {
      data[this.name] = this.value;
    });
    jQuery(this).find("input:hidden:checked").each(function () {
      data[this.name] = this.value;
    });
    jQuery(this).find("select").each(function () { 
        data[this.name] = parseInt(jQuery(this).find(":selected").val() );
    });
        console.log(data);
        return data;
    };
  })(jQuery);

$(() => {
  setupSlider('strefa_zagraniczna', ["Strefa A", "Strefa B", "Strefa C", "Strefa D"], 0);
  setupSlider('masa_krajowa_indywidualna', ["do 1kg", "do 2kg", "do 5kg", "do 10kg","do 15kg","do 20kg","do 25kg","do 30kg"], 5);
  setupSlider('masa_zagraniczna_indywidualna', [0.5,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 0);
  setupSlider('opakowanie_zagraniczna', ["własne","operatora"], 0);
  setupSlider('zawartosc_zagraniczna', ["dokumenty","dokumenty lub towary","towary"], 0);

  setupSlider('ilosc_krajowa', ["do 100", "do 200", "do 500", "do 1000", "> 1000"], 0);
  setupSlider('ilosc_zagraniczna', ["do 100", "do 200", "do 500", "do 1000", "> 1000"], 0);
  setupSlider('masa_krajowa', ["do 1kg", "do 5kg", "> 5kg"], 0);
  setupSlider('masa_zagraniczna', ["do 1kg", "do 5kg", "do 10kg", "do 20kg"], 0);
}); 

  function setupSlider(id, vals, initialVal = 0) {
    $(`#${id}`).append($('<div>').addClass('step-marks'));
    $(`#${id}`).append($('<div>').addClass('step-labels'));
    $(`#${id}`).append($('<input type="range">'));
    
    const min = 0;
    const max = vals.length - 1;

    // initialise slider vals
    $(`#${id} input[type=range]`)
      .attr({ min: min, max: max })
      .val(initialVal);

    vals.forEach((x, i) => {
      if (i < vals.length - 1) {
        $(`#${id} .step-marks`).append($("<div>"));
      }
      const label = $("<span>").text(x).on('click', () => $(`#${id} input[type=range]`).val(i));    
      $(`#${id} .step-labels`).append(label);
    });

    const length = vals.length;
    const multiply = length / (length - 1);
    const widthVal = `calc(100% * ${multiply} - 25px)`;
    const marginVal = `calc(${widthVal} / ${length * -2} + 10px)`;
    
    $(`#${id} .step-labels`).css("width", widthVal);
    $(`#${id} .step-labels`).css("margin-left", marginVal);
    $(`#${id}`).show();
  }

