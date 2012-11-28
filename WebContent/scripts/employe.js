var employes=[];

function DataCtrl($scope)
{
	var value;
	const pos = "employeJS_ind"
	value =	localStorage.getItem(pos);
	if (value == null) 
	{
	    $.ajax(
	            {
	  				url: 'http://backplane.cloudfoundry.com/api/employe/',
	                // isLocal: false,
	                async: false,
	                dataType: 'json',
	                crossDomain: true,
	                success: function (i)
	                {
	                	$scope.employes = i;
	                	employes=i;
	                },
	                error: function (jqXHR,textStatus,errorThrown)
	                {
	                    console.log("fail ",jqXHR);
	                    console.log("status ",textStatus);
	                    console.log("err ",errorThrown);
	                }
	              } // fin argument ajax
	          );//Fin Ajax
	   	localStorage.setItem(pos , JSON.stringify(employes));
	   	console.log("loc storing: ", JSON.stringify(employes));
	}
	else 
	{
		$scope.employes = JSON.parse(value);
		employes =  JSON.parse(value);
		//console.log("loc storage: ", employes);
	}
		
}//Fin DataCtrl

function InspectionCtrl($scope) 
{
	$.ajax(
			{
				url: 'http://backplane.cloudfoundry.com/inspection/tous',
				// isLocal: false, 
				async: false,
				dataType: 'json',
				crossDomain: true,
				success: function (i) 
				{
					$scope.inspections = i;
				},
				error: function (jqXHR,textStatus,errorThrown) 
				{
					console.log("fail ",jqXHR);
					console.log("status ",textStatus);
					console.log("err ",errorThrown);
				}
	  		} // fin argument ajax
	  	);//Fin Ajax
}//Fin DataCtrl


//--- PAGE 
function showDetail( urlObj, options )
{
	var $detailName = urlObj.hash.replace( /.*id=/, "" );
	pageSelector = urlObj.hash.replace( /\?.*$/, "" );
	
	var $page = $( pageSelector );
	
	options.dataUrl = urlObj.href;
	
	$.mobile.changePage( $page, options );
}



$(document).bind( "pagebeforechange", function( e, data ) 
{
	if ( typeof data.toPage === "string" ) {
		// category.
		var u = $.mobile.path.parseUrl( data.toPage ),
			re = /^#employeDetail/;
		if ( u.hash.search(re) !== -1 ) {
			showDetail( u, data.options );
			e.preventDefault();
		}
	}
});

var query ;

$("#employeDetail").live("pageshow", function(e, data) 
	{
		//var query = "id=";

		query = data.prevPage.context.URL.split("?")[1];;
		query = query.replace("id=","");
		
		for (var i=1; i<employes.data.length; i++)
			{
				if (employes.data[i].id == query)
					{
						query = i
					}
			}
		console.log("query: ");
		//query is now an ID, do stuff with it...
		document.getElementById("nom").value = employes.data[query-1].nom;
		document.getElementById("email").value = employes.data[query-1].email;
		document.getElementById("telephone").value = employes.data[query-1].telephone;
		document.getElementById("remarque").value = employes.data[query-1].remarque;
		document.getElementById("bonus").value = employes.data[query-1].bonus;
		
		switch (employes.data[query-1].typeEmploye)
		{
			case "Interne":
				document.getElementById("radio-choice-11").checked = true;
				break;
			case "Externe":
				document.getElementById("radio-choice-12").checked = true;
				break;
			case "Temporaire":
				document.getElementById("radio-choice-13").checked = true;
				break;
		}
		
		document.getElementById("salaire").value = employes.data[query-1].salaire;
		
		//console.log("query: ",employes.data[query-1].nom, " ", employes.data[query-1].casque);
		document.getElementById("casque").checked = employes.data[query-1].casque ;
		$('#casque').checkboxradio ("refresh");
		
		//console.log("query: ",employes.data[query-1].nom, " ", employes.data[query-1].lunettes);
		document.getElementById("lunette").checked = employes.data[query-1].lunettes ;
		$('#lunette').checkboxradio("refresh");
		
		//console.log("query: ",employes.data[query-1].nom, " ", employes.data[query-1].bottes);
		document.getElementById("botte").checked = employes.data[query-1].bottes ;
		$('#botte').checkboxradio ("refresh");
		
		document.getElementById("territoire").value = employes.data[query-1].territoire;
		$('#territoire').selectMenu;
	}
);
//----END PAGE
