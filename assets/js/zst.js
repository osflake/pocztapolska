jQuery(document).ready(function(){

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
            console.log(a,b)
    
        }
      });

    (async () => {

      async function getData(url = "", data = {},responseJSON) {
        // Default options are marked with *
        
        const response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "no-cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Basic " + btoa("ppsa:pocztapolska")
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          //body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json();
      }
    var myModal = document.getElementById('modal-view')

    myModal.addEventListener('show.bs.modal', async function (event) {
      var button = event.relatedTarget;
      var file = button.getAttribute('id');
      var wsad = {"plik" : file,"podmiana" : false };
      console.log("/pocztapolska/maile/url.php"+'?'+jQuery.param(wsad));
      const content = await getData("/pocztapolska/maile/url.php"+'?'+jQuery.param(wsad));
      console.log(content);
      jQuery(".modal-body").html(content.tresc);
      jQuery(".modal-title > strong").html(file);
    });

    const config = await getData("reguly.json?callback=?");
    console.log("reguly.json");
    console.log(config);

    jQuery("#results").empty();
    jQuery(config).each(function( i, el ) {
      jQuery("#results").append("<div id='poz_"+i+"' class='row p-3'/>");
      jQuery("#poz_"+i).append('<div class="p-2 col-12 h5 pt-4 d-flex flex-column flex-lg-row align-items-center gap-2 brake-txt"><button type="button" id="'+el.id+'" class="btn btn-dark btn-modal" data-bs-toggle="modal" data-bs-target="#modal-view">&#9993;</button>'+el.rule+' <code>'+el.template+'</code></div>');
      jQuery("#poz_"+i).append('<div class="p-3 pb-1 col-12 col-sm-8 wrap"><p class="d-block fw-bold">Opis:</p>'+el.description+'</div>');
      jQuery("#poz_"+i).append('<div class="p-3 pb-1 col-12 col-sm-4 text-end "><p class="d-block fw-bold">Zdarzenia inicjujące:</p>'+el.start_events+'</div>');
      jQuery("#poz_"+i).append('<div class="p-3 pb-1 col-12 "><p class="d-block fw-bold">Przesyłki</p><span class="text-secondary">'+el.parcels+'</span></div>');
      jQuery("#poz_"+i).append('<div id="tests_'+i+'" class="col-12 p-3 border-bottoms border-danger border-2 "/><p class="d-block fw-bold">Przebieg testów:</p>');
      jQuery(el.test_description).each(function(j,t){
        console.log("#tests_"+i);
        jQuery("#tests_"+i).append('<p class="mb-2 p-0 text-secondary ">'+t+'</p>');
      });
      jQuery("#poz_"+i).append('<div id="prod_'+i+'" class="p-3 col-12 col-xl-5 d-flex justify-content-lg-start align-items-center flex-column flex-sm-row" />');
        jQuery("#prod_"+i).append('<p class="pb-0 pt-0 me-2 m-0 h3 p-2 fw-bold bg-success text-light">P</p>');
        jQuery("#prod_"+i).append('<p>WDROŻENIE: <span class="bg-'+el.production.env_flag+' text-'+(el.production.env_flag !== 'warning'? 'light':'dark')+' p-2 fw-bold">'+el.production.env+'</span> Wynik: <span class="text-'+(el.production.sum_flag !== 'warning'? 'light':'dark')+' bg-'+el.production.sum_flag+' p-2 fw-bold">'+el.production.sum+'</span></p>');
      jQuery("#poz_"+i).append('<div id="test_'+i+'" class="p-3 col-12 col-xl-7 justify-content-lg-end d-flex align-items-center flex-column flex-sm-row" />');
        jQuery("#test_"+i).append('<p class="pb-0 pt-0 me-2 m-0 h3 p-2 fw-bold bg-warning text-dark">T</p>');
        jQuery("#test_"+i).append('<p>WDROŻENIE: <span class="bg-'+el.production_test.env_flag+' text-'+(el.production_test.env_flag !== 'warning'? 'light':'dark')+' p-2 fw-bold">'+el.production_test.env+'</span> Wynik: <span class="text-'+(el.production_test.sum_flag !== 'warning'? 'light':'dark')+' bg-'+el.production_test.sum_flag+' p-2 fw-bold">'+el.production_test.sum+'</span></p>');
    });


    })();
//       function get_content(iframe){
//         var wsad = {
//                 "plik" : this.id,
//                 "podmiana" : true
//         }
//         jQuery.ajax({
//             method: "GET",
//             data: wsad,
//             dataType: 'json',
//             crossDomain: true,
//             url: "https://kartelmedia.co.uk/pocztapolska/maile/url.php", 
//             beforeSend: function(xhr) {
//               xhr.setRequestHeader("Authorization", "Basic " + btoa("ppsa:pocztapolska"));
//             },   
//             success: function(data) {
//                 var body = data.tresc;
//                 jQuery(".modal-body").html(data.tresc);
//                 jQuery(".modal-title > span").html(wsad.plik);
// //                body = body.substring(body.indexOf(".modal-body")+6,body.indexOf("</body>"));
//             },
//             error: function(xhr, status) {
//                 console.log(status);
//             }
//         });
//     }


   
})