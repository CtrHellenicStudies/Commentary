Meteor.methods({
  'textServer': function(query) {
    var self = this;

    try {

      var url = 'http://localhost:3000';

      /*
      if( location.hostname.indexOf("dev") >= 0 || location.hostname.indexOf("localhost") >= 0){
        url += location.hostname;
        url += ':3000';

      }else {
        url += "ahcip-text.chs.harvard.edu";
        url += ':80';

      }
      */

      url += "/api";


      var response = HTTP.get(url, {
        params: query
      });

      var editions = [],
          is_in_edition = false;

      if("res" in response){
        response.res.forEach(function(text_object){
          text_object.text.forEach(function(text_edition){

            editions.forEach(function(edition){
              if( text_edition.edition.slug === edition.slug ){
                is_in_edition = true;

                edition.lines.push(text_edition);
              }

            });

            if ( !is_in_edition ){
              editions.push({
                title : text_edition.edition.title,
                slug : text_edition.edition.slug,
                lines : [ text_edition ]

              });

            }

          });


        });

        return editions;

      }else {
        console.error("Unable to connect to TextServer");

      }


    } catch(error) {
      console.log(error);

    }

  }

});
