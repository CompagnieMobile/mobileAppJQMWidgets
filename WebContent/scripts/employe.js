var employes=[];

if(localStorage.getItem('url') == null)
{
	localStorage.setItem('url', 'http://backplane.cloudfoundry.com');
};

var debug;
$(document).ready(function(){
	$('select').change(
		function(event) 
		{
			debug = event;
			if (event.target.id = "bonus")
			{
				console.log("bonus: ",employes.data[query - 1][event.target.id] , " versus ", (event.target.value == "true"))
				
				employes.data[query - 1][event.target.id]  = (event.target.value == "true") ;
			}
			else 
			{
				console.log("selection: ",employes.data[query - 1][event.target.id] , " versus ", event.target.value)
				employes.data[query - 1][event.target.id]  = event.target.value;
					
				
			}
		}
	);

	$('input').change(
		function(event) 
		{
			console.log(event.target.id)
			if ( ["interne","externe","temporaire"].indexOf(event.target.id) >= 0)
			{
				newVal = event.target.id
				var newVal = newVal[0].toUpperCase().concat(newVal.substr(1,newVal.length));
				console.log("typeEmpl: ",employes.data[query - 1]["typeEmploye"] , " versus ", newVal)
				employes.data[query - 1]["typeEmploye"] = newVal;
				
			}
			else if ( ["casque","bottes","lunettes"].indexOf(event.target.id) >= 0)
			{
				console.log("equip: ",employes.data[query - 1][event.target.id] , " versus ", event.target.checked);
				employes.data[query - 1][event.target.id] = event.target.checked;
			}
			else 
			{
				debug = event
				console.log("input change: ",employes.data[query - 1][event.target.id] , " versus ", event.target.value);
				employes.data[query - 1][event.target.id] = event.target.value;
			}
		}
	);
	
	$('textarea').change(
		function(event) 
		{
			debug = event ;
			console.log("texte: ",employes.data[query - 1][event.target.id] , " versus ", event.target.value) ;
			employes.data[query - 1][event.target.id] = event.target.value ;
		}
	);
});

$( document ).live( 'pageinit',function(event)
{
	$("#salaire").on("slidestop",
			function(event){
				debug = event;
				console.log("1ci slide: ",employes.data[query - 1][event.target.id]," versus ",event.target.value) ;
				employes.data[query - 1][event.target.id] = event.target.value ;
		}
	);
});

function DataCtrl($scope)
{
	var value;
	const pos = "employeJS_ind"
	value =	localStorage.getItem(pos);
	if (value == null) 
	{
	    $.ajax(
	            {
	            	url: localStorage.getItem('url').concat("/api/employe/"),
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
				url: localStorage.getItem('url').concat("/inspection/tous"),
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

		query = data.prevPage.context.URL.split("?")[1];
		query = query.replace("id=","");
		//console.log("qu: ", query);
		for (var i=0; i<employes.data.length; i++)
			{
/*				console.log("        employes.data[i].id: ",employes.data[i].id, " ",
						" employes.data[i].nom ",employes.data[i].nom 
				)
				*/			
				if (employes.data[i].id == query)
					{
						query = (i + 1)
					}
			}
		
		//query is now an ID, do stuff with it... test
		document.getElementById("nom").value = employes.data[query-1].nom;
		document.getElementById("email").value = employes.data[query-1].email;
		document.getElementById("telephone").value = employes.data[query-1].telephone;
		document.getElementById("remarque").value = employes.data[query-1].remarque;
		document.getElementById("bonus").value = employes.data[query-1].bonus;
		
		switch (employes.data[query-1].typeEmploye.toLowerCase())
		{
			case "interne":
				document.getElementById("interne").checked = true;
				$('#interne').checkboxradio ("refresh");
				break;
			case "externe":
				document.getElementById("externe").checked = true;
				$('#externe').checkboxradio ("refresh");
				break;
			case "temporaire":
				document.getElementById("temporaire").checked = true;
				$('#temporaire').checkboxradio ("refresh");
				break;

		}
		
		document.getElementById("salaire").value = employes.data[query-1].salaire;
		
		//console.log("query: ",employes.data[query-1].nom, " ", employes.data[query-1].casque);
		document.getElementById("casque").checked = employes.data[query-1].casque ;
		$('#casque').checkboxradio ("refresh");
		
		//console.log("query: ",employes.data[query-1].nom, " ", employes.data[query-1].lunettes);
		document.getElementById("lunettes").checked = employes.data[query-1].lunettes ;
		$('#lunette').checkboxradio("refresh");
		
		//console.log("query: ",employes.data[query-1].nom, " ", employes.data[query-1].bottes);
		document.getElementById("bottes").checked = employes.data[query-1].bottes ;
		$('#bottes').checkboxradio ("refresh");
		
		document.getElementById("territoire").value = employes.data[query-1].territoire;
		$('#territoire').selectMenu;
	}
);

$("#config").live("pageshow", function(e, data) 
		{
			document.getElementById("url").value = localStorage.getItem('url');
		}
		);

function updateUrl(value) 
{
	localStorage.setItem('url', value);
}
//----END PAGE
