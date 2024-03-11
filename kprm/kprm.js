jQuery(document).ready(function(){
  $(".file-drop-zone-title").text("Przeciągnij i upuść dokument XML");
        $("#input-as").parent().children("span").text("Wybierz");
        $(".file-caption-name").attr("placeholder","Wybierz pliki");
/*
  $.fn.fileinputBsVersion = "3.3.7";
  $(".file").fileinput({
    uploadExtraData: {
      'uploadToken': 'asdkhbasdax8t7ASjb_!'//, // for access control / security 
    },
    maxFileCount: 2,
  //        allowedFileTypes: ['image','documents'],    // allow only images
    showCancel: true,
    initialPreviewAsData: true,
    overwriteInitial: false,
    allowedFileExtensions: ['xml','pdf'],
    maxFileSize:2000,
    maxFilesNum: 3,
    theme: 'fas',
    mainClass: "input-group-lg",
    browseClass : "btn btn-primary btn-block" , 
    showCaption : true ,
    showRemove: true,
    showUpload: true,
    showDrag: true,
    dropZoneTitle: "Dodaj załącznik / Add attachement",
    uploadTitle: 'Prześlij plik / Upload file',
    zoomTitle: 'Pogdląd pliku',
  //        removeTitle: 'Usuń plik',
    browseLabel: 'Wybierz / choose',
    msgPlaceholder: 'Wybierz plik...',
    msgInvalidFileExtension: 'Nieprawidłowy format pliku "{name}". Dopuszczalne rozszerzenia "{extensions}".'
  });
*/
  var myParcelUrl = location.search.split('numer=')[1];
  if(myParcelUrl){
    jQuery(document).find('input[name="parcel"]').val(myParcelUrl);
    //jQuery("#sledzenie").trigger("click");
    setTimeout(function(){ $('#sledzenie').click()}, 500);
  }

  function sprawdzPrzesylke(x){
    //	var regex = /([a-zA-Z0-9])+$/;
      return /([a-zA-Z0-9])+$/.test(x);
    }

  $("#sledzenie").on("click",function(){
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
            	"filter": "false"
        	};
      		jQuery('#sledzenie').prop("disabled", true);
	        jQuery.ajax({
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
          console.log(modal);
		  			modal.find('#myModalLabel').text(data.przesylki[0].numer);

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
              divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Data nadania:</strong></div><div class='col-md-7'>"+parcelInfo.dataNadania+"</div></div>");
			  			divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Usługa:</strong></div><div class='col-md-7'>"+parcelInfo.rodzPrzes+"</div></div>");
			  			divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Kraj nadania:</strong></div><div class='col-md-7'>"+parcelInfo.krajNadania+" ("+parcelInfo.kodKrajuNadania+")</div></div>");
			  			divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Kraj doręczenia:</strong></div><div class='col-md-7'>"+parcelInfo.krajPrzezn+" ("+parcelInfo.kodKrajuPrzezn+")</div></div>");
			  			(parcelInfo.masa)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'></strong>Masa:<strong></div><div class='col-md-7'>"+parcelInfo.masa+" kg</div></div>"):'';
			  			(parcelInfo.urzadNadania.nazwa)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Urząd nadania:</strong></div><div class='col-md-7'>"+parcelInfo.urzadNadania.nazwa+" ("+parcelInfo.urzadNadania.daneSzczegolowe.ulica+" "+parcelInfo.urzadNadania.daneSzczegolowe.nrDomu+", "+parcelInfo.urzadNadania.daneSzczegolowe.pna+" "+parcelInfo.urzadNadania.daneSzczegolowe.miejscowosc+")</div></div>"):'';
			  			(parcelInfo.urzadPrzezn.nazwa)? divParcelInfo.append("<div class='row p-2'><div class='col-md-5 text-md-end'><strong>Miejsce doręczenia:</strong></div><div class='col-md-7'>"+parcelInfo.urzadPrzezn.nazwa+" ("+parcelInfo.urzadPrzezn.daneSzczegolowe.ulica+" "+parcelInfo.urzadPrzezn.daneSzczegolowe.nrDomu+", "+parcelInfo.urzadPrzezn.daneSzczegolowe.pna+" "+parcelInfo.urzadPrzezn.daneSzczegolowe.miejscowosc+")</div></div>"):'';
			  			
              
/*			  			divParcelInfo.append("<tr><th>Data nadania:</th><th>"+parcelInfo.dataNadania+"</th></tr>");
			  			divParcelInfo.append("<tr><th>Usługa:</th><th>"+parcelInfo.rodzPrzes+"</th></tr>");
			  			divParcelInfo.append("<tr><th>Kraj nadania:</th><th>"+parcelInfo.krajNadania+"</th></tr>");
			  			divParcelInfo.append("<tr><th>Kraj doręczenia:</th><th>"+parcelInfo.krajPrzezn+"</th></tr>");
			  			divParcelInfo.append("<tr><th>Masa:</th><th>"+parcelInfo.masa+" kg</th></tr>");
			  			divParcelInfo.append("<tr><th>Urząd nadania:</th><th>"+parcelInfo.urzadNadania.nazwa+" ("+parcelInfo.urzadNadania.daneSzczegolowe.ulica+" "+parcelInfo.urzadNadania.daneSzczegolowe.nrDomu+", "+parcelInfo.urzadNadania.daneSzczegolowe.pna+" "+parcelInfo.urzadNadania.daneSzczegolowe.miejscowosc+")</th></tr>");
			  			divParcelInfo.append("<tr><th>Miejsce doręczenia:</th><th>"+parcelInfo.urzadPrzezn.nazwa+" ("+parcelInfo.urzadPrzezn.daneSzczegolowe.ulica+" "+parcelInfo.urzadPrzezn.daneSzczegolowe.nrDomu+", "+parcelInfo.urzadPrzezn.daneSzczegolowe.pna+" "+parcelInfo.urzadPrzezn.daneSzczegolowe.miejscowosc+")</th></tr>");
			  			divParcelInfo.append("</tbody></table>");
*/

              divParcelAction.append("<h3>Status przesyłki:</h3>");
              divParcelAction.append("<div class='row p-2 bg-danger text-white'><div class='col-5 h5'>Zdarzenie</div><div class='col-3 h5'>Data i czas</div><div class='col-4 h5'>Jednostka</div></div>");
              


/*			  			divParcelAction.append("<table class='table w-100 table-striped'><thead>");
			  			divParcelAction.append("<tr class='bg-light'><th class='p-3'>Zdarzenie</th><th>Data i czas</th><th class='p-3'>Jednostka</th></tr>");
			  			divParcelAction.append("</thead><tbody>");
*/			  			jQuery.each( parcelInfo.zdarzenia, function( key, value ) {
//				  			divParcelAction.append('<tr><th class="p-3"><small>'+value.nazwa+'</small></th><th><small>'+value.czas+'</small></th><th class="p-3">'+value.jednostka.nazwa+'</th></tr>');
				  			divParcelAction.append("<div class='row p-2'><div class='col-md-5'><strong>"+value.nazwa+"</strong></div><div class='col-md-3'>"+value.czas+"</div><div class='col-md-4'>"+value.jednostka.nazwa+"</div></div>");
						});
//			  			divParcelInfo.append("</tbody></table>");
              
/////////			  			console.log(parcelInfo.zdarzenia);
			  			
			  		}
//				});

	        })
	        .fail(function(xhrObj, textStatus, error) {
	        	console.log(xhrObj,textStatus,error);
	            alert("error");
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

  function sprWarunek(x,u){
    if (u =="nadaj_usluga_2"){
      return ((parseInt(x) > 2 || x == "OPZ")? true : false);
    }
  }

jQuery("#wyszukaj").on("click", function(){
  var str = jQuery("#UUID").val();
  if ( (/PPSA-H-/i.test(str)) || (/PUH/i.test(str)) ){
    jQuery("#wyszukiwanie_wynik").html('<div class="alert alert-success" role="alert">Znaleziono przyłkę PUH!</div>');
    jQuery(document).find("div.puh:not(.purde)").removeClass(".d-none");
    jQuery("#step-2").prop("disabled",false);
  }else if(/PPSA-E-/i.test(str)){
    jQuery("#wyszukiwanie_wynik").html('<div class="alert alert-success" role="alert">Znaleziono przyłkę PURDE!</div>');
    jQuery(document).find("div.puh:not(.purde)").addClass("d-none");
    jQuery("#step-2").prop("disabled",false);
  }else{
    //jQuery("#wyszukiwanie_wynik").html('<div class="alert alert-danger" role="alert">Podano błędny numer przesyłki</div>');
    jQuery("#wyszukiwanie_wynik").html('<div class="alert alert-danger row p-2" role="alert">'+
                                '<div class="col-md-9 d-flex align-items-center">'+
                                    'Podano błędny numer przesyłki.'+
                                '</div>'+
                                '<div id="wprowadz-recznie" class="col-md-3 btn btn-lg btn-outline-danger p-1" role="button" >Wprowadź dane ręcznie</div>'+
                            '</div>');
    jQuery("#step-2").prop("disabled",true);
  }
});
jQuery(document).on("click","#wprowadz-recznie",function(){
  jQuery("#step-2").prop("disabled",false).trigger("click");
  jQuery(".reklamacja").find("input[readonly]").prop("readonly",false).val("");

});

jQuery("select[name='forma-przekazania']").change(function(){
  jQuery(document).find(".forma-przekazania."+this.value).removeClass("d-none");
  jQuery(document).find(".forma-przekazania:not(."+this.value+")").addClass("d-none");
//  jQuery("#forma-przekazania-bank").collapse((this.value === "bank")? 'show':'hide');
//  jQuery("#forma-przekazania-przekaz").collapse((this.value === "przekaz")? 'show':'hide');
});


jQuery(".prev-step").on("click", function(){
    var param = "#nav-zloz-reklamacje-"+$(this).attr("aria-controls");
    $("#reklamacja-skladanie").find(".active").prop("disabled","disabled");
    $("#reklamacja-skladanie").find(".active").toggleClass("d-none d-sm-block");
    $(param).trigger("click");
});
  
jQuery(".next-step").on("click", function(){
  var param = "#nav-zloz-reklamacje-"+$(this).attr("aria-controls");
  $(param).prop("disabled","");
  $(param).trigger("click");
  $("#reklamacja-skladanie").find(".active").toggleClass("d-none d-sm-block");
});

jQuery(".podsumowanie").on("click",function(){
  console.log("OK");
  jQuery("#reklamacje-summary").empty().append("<div class='d-grid h3 gap-2 border p-2 bg-danger text-white mb-3'>Podsumowanie</div>");
  jQuery(".tab-pane .reklamacja").each(function(a,b){
    
    var t = jQuery(b).children().not(".d-none").each(function(x,y){
      //var val = jQuery(y).find("input,textarea,select option:selected").val();
      //console.log(y);
      if(jQuery(this).hasClass("h3")){
        jQuery("#reklamacje-summary").append('<div class="d-block text-danger p-2 border-bottom">'+jQuery(this).text()+'</div>');
      }
      jQuery(y).find("input,textarea,select").each(function(s,m){
        //console.log(s,m.id);
        if (((m.id)!== "") && (jQuery("#"+m.id).parent().parent().not(".d-none").length == 1) ){
          if(!jQuery(this).hasClass("file")){
            jQuery("#reklamacje-summary").append('<div class="d-flex mt-2">'+
            '<span class="col-md-6 col-5 d-block text-end small">'+jQuery('label[for="'+(m.id)+'"]').text()+':</span>'+
            '<span id="sum_'+(m.id)+'" class="flex-fill text-start ms-2">'+jQuery("#"+(m.id)).val()+'</span></div>');
          }
        }
        if(jQuery(this).hasClass("file")){
          console.log(this);
          jQuery("#reklamacje-summary").append(jQuery(".file-preview"));
        }
      });

//      console.log(idd,jQuery('label[for="'+idd+'"]').text());
/*      if(typeof(idd) === "undefined"){
        //jQuery("#reklamacje-summary").append(y);
      }else{
        jQuery("#reklamacje-summary").append('<div class="d-flex mt-2">'+
        '<span class="col-md-6 col-7 d-block text-end small">'+label+'</span>'+
        '<span id="kod_odbiorcy" class="flex-fill text-start ms-2">'+jQuery("#"+idd).val()+'</span></div>');
      }
    */    });
    //console.log(b);
    //var c = jQuery(b).find("input,textarea,select").prop({"readonly":true,"disabled": true});

//    jQuery("#reklamacje-summary").append(b);    
  });
  jQuery("#reklamacje-summary > .navig").remove();
/*  jQuery("#reklamacje-summary").find(".form-control").each(function(a,b){
    console.log(a,b);
    jQuery(this).addClass("form-control-plaintext").removeClass("form-control").attr('readonly', true);;
   // removeClass("form-control").addClass("form-control-plaintext");
  });
*/
});

jQuery(".wyslijZgloszenie").on("click", function(){
  jQuery("#reklamacje-summary").empty().append('<div class="alert alert-success" role="alert">Dziękujemy! Twoje zgłoszenie zostało poprawnie złożone pod numerem 12397681238/2021</div>');
  
  //jQuery("#zloz-reklamacje-step-6").
});













/* OBSLUGA NADAJ PRZESYLKE */
jQuery("input[type='radio']").on("change",function(){
    jQuery("#"+this.name).text(jQuery(this).attr("title"));
    console.log(jQuery(this).attr("title"));
    console.log(this.name);
    //sprWarunek ((this.value)),"<=2");
    disable_enable_button("nadaj_usluga_2",sprWarunek((this.value),"nadaj_usluga_2"));
  });


  function disable_enable_button(name,result){
    i = jQuery("#"+name);
    i.prop("disabled",result);
    if (i.is(":disabled")){
      i.prop("checked",false);
    }
  }

  $(window).on('scroll resize', function() {
  height = jQuery("#main-menu").offset().top;
  hs = $(this).scrollTop();
  if (height <= hs){
        $(".nav-link span").addClass('d-sm-none');
        $(".nav-item:not(.nav-item-dropped), .navbar-brand > img").addClass("animations");
        //$('#main-menu').height('auto').addClass('p-0');
  }else{
    $(".nav-link span").removeClass('d-sm-none');
    $(".nav-item, .navbar-brand > img").removeClass("animations");
    //$('#main-menu').height('auto').removeClass('p-0');
  }
//  console.log(height, hs);
  });

  $('[data-fancybox]').fancybox({
    toolbar  : false,
    smallBtn : true,
    keys : {
      close  : null
    },
    afterShow: function(a,b) {

    }
  });


});
function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete"
      || document.readyState === "interactive") {
      // call on next available tick
      setTimeout(fn, 1);
  } else {
      document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(function () {
  var resultContainer = document.getElementById('qr-reader-results');
  var lastResult, countResults = 0;
  function onScanSuccess(qrCodeMessage) {
      if (qrCodeMessage !== lastResult) {
          ++countResults;
          lastResult = qrCodeMessage;
          resultContainer.innerHTML
              += `<div>[${countResults}] - ${qrCodeMessage}</div>`;
      }
  }

  var html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render(onScanSuccess);
});