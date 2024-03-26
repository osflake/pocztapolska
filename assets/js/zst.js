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
      var myModal = document.getElementById('modal-view')

      myModal.addEventListener('show.bs.modal', function (event) {

      (async () => {

        async function getData(url = "", data = {},responseJSON) {
          // Default options are marked with *
          
          const response = await fetch(url+(data.length > 0 ?? '?'+jQuery.param(data)), {
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

        var button = event.relatedTarget;
        var file = button.getAttribute('id');
        var wsad = {"plik" : file,"podmiana" : true };
        console.log("POKAZUJE");
        // console.log("URL: "+ url+(data.length > 0 ?? '?'+jQuery.param(data)));
        console.log("URL2: /pocztapolska/maile/url.php"+(wsad? '?'+jQuery.param(wsad) : ''))
        const content = await getData("/pocztapolska/maile/url.php"+(wsad? '?'+jQuery.param(wsad) : ''), {});
        console.log (content);
        jQuery(".modal-body").html(wsad);
        jQuery(".modal-title > strong").html(file);
        //get_content();

      })();

      
      })


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