
var employes=[];
var debug;
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
			if (event.target.id == "bonus")
			{
				//console.log("bonus: ",employes.data[query - 1][event.target.id] , " versus ", (event.target.value == "true"))
				employes.data[query - 1][event.target.id]  = (event.target.value == "true") ;
				DataSync();
			}
			else 
			{
				//console.log("selection: ",employes.data[query - 1][event.target.id] , " versus ", event.target.value)
				employes.data[query - 1][event.target.id]  = event.target.value;
				DataSync();
			}
			localStorage.setItem("employeJS_ind",JSON.stringify(employes));
		}
	);

	$('input').change(
		function(event) 
		{
			//console.log("Query: " + query)
			if(query == null)
			{
				//console.log("create new");
				var newEmploye = createEmploye();
				employes.data[employes.data.length] = newEmploye;
				query = employes.data.length
			}
			
			//console.log(event.target.id)
			if ( ["interne","externe","temporaire"].indexOf(event.target.id) >= 0)
			{
				newVal = event.target.id;
				var newVal = newVal[0].toUpperCase().concat(newVal.substr(1,newVal.length));
				//console.log("typeEmpl: ",employes.data[query - 1]["typeEmploye"] , " versus ", newVal)
				employes.data[query - 1]["typeEmploye"] = newVal;
				DataSync();
				
			}
			else if ( ["casque","bottes","lunettes"].indexOf(event.target.id) >= 0)
			{
				//console.log("equip: ",employes.data[query - 1][event.target.id] , " versus ", event.target.checked);
				employes.data[query - 1][event.target.id] = event.target.checked;
				DataSync();
			}
			else 
			{
				//console.log("input change: ",employes.data[query - 1][event.target.id] , " versus ", event.target.value);
				employes.data[query - 1][event.target.id] = event.target.value;
				debug = event
				DataSync();
			}	
					
			localStorage.setItem("employeJS_ind",JSON.stringify(employes));
		}
	);
	
	$('textarea').change(
		function(event) 
		{
			debug = event ;
			//console.log("texte: ",employes.data[query - 1][event.target.id] , " versus ", event.target.value) ;
			employes.data[query - 1][event.target.id] = event.target.value ;
			DataSync();
			localStorage.setItem("employeJS_ind",JSON.stringify(employes));
		}
	);
});

$( document ).live( 'pageinit',function(event)
{
	$("#salaire").on("slidestop",
		function(event){
			debug = event;
			//console.log("slide: ",employes.data[query - 1][event.target.id]," versus ",event.target.value) ;
			employes.data[query - 1][event.target.id] = event.target.value ;
			DataSync();
			localStorage.setItem("employeJS_ind",JSON.stringify(employes));
			
		}
	);
	$('div').live('pageshow',function(event,ui)
	{
		//$('#liste').children().remove("li#employe-li4")
		if ( event.target.id.indexOf("suivi") >= 0) 
		{
			// remove any existing swipe areas			
			$('.aDeleteBtn').remove();
			// add swipe event to the list item			
			$('ul li').bind('swipeleft', function(e)
				{
					// reference the just swiped list item
					var $li = $(this);
					if ($('.aDeleteBtn').val() != null)
					{
						id = $('.aDeleteBtn').parent().attr("id");//.split("employe-li")[1];
						$('#delta-' + id).show();
					}
									
					// remove all buttons first
					$('.aDeleteBtn').remove();
					
					// create buttons and div container
					//$('#liste').children().remove($(this).context.id);
					var temp = "javascript:deleteEmpl("+"'"+$(this).context.id+"'"+")"//{"+"$(" + "'#liste'" + ").children().remove(" +'"'+$li.context.id+'")}'
	
					var $deleteBtn = $('<a>Delete</a>').attr(
					{
						'class': 'aDeleteBtn ui-btn-up-r',
						'href': "javascript:deleteEmpl("+"'"+$(this).context.id+"'"+")"
					}				
					);
				debug =$deleteBtn;
				// insert swipe div into list item
				
				$('#delta-' + $li.context.id).hide()	
				$li.prepend($deleteBtn);
				$('#liste').listview('refresh');
			})
		}
	})
});


function createEmploye()
{
	var properties = {nom:"", email:"", casque:false, territoire:"Qu�bec", typeEmploye:"Interne",inspPrevues:0,
			salaire:0, inspDelta:0, bonus:false, bottes:false, lunettes:false, remarque:"", telephone:""};
	
	var employe = {attached:true, nom:"", email:"", casque:false, territoire:"Qu�bec", typeEmploye:"Interne",inspPrevues:0,
			salaire:0, inspDelta:0, bonus:false, bottes:false, lunettes:false, remarque:"", telephone:"", properties:properties};
	
	return employe;
}

function deleteEmpl(e)
{
	//console.log(e)//, " - ", $li.context.id, " -> ",$('#liste').children());

	$('#liste').children().remove("li#"+e);
	$('#liste').listview('refresh');
	
	//console.log(e, " ---- ",e.split("employe-li")  )
	var index = e.split("employe-li")[1] ;
	const pos = "employeJS_ind";
	
	var jr = JSON.stringify(employes.data[index]);	
	var myUrl = localStorage.getItem('url').concat("/api/employe/", index);
	
	employes.data.pop(index);
	jr = "".concat("{" + '"success"' +  ":true,"+ '"data"' + ":", jr, "}");
    $.ajax(
            {
            	type: "DELETE",
            	url: myUrl,
            	//data: jr,
                success: function (i)
                {
                	console.log("success sync");
                },
                error: function (jqXHR,textStatus,errorThrown)
                {
                	debug = jqXHR;
                    //console.log("fail ",jqXHR);
                    //console.log("status ",textStatus);
                    //console.log("err ",errorThrown);
                }
            } // fin argument ajax
       );//Fin Ajax
    	localStorage.setItem(pos , JSON.stringify(employes)); 

}
function DataCtrl()//$scope)
{
	var value;
	const pos = "employeJS_ind";
	value =	localStorage.getItem(pos);
	if (value != null) 
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
	                	employes=i;
	                },
	                error: function (jqXHR,textStatus,errorThrown)
	                {
	                    //console.log("fail ",jqXHR);
	                    //console.log("status ",textStatus);
	                   // console.log("err ",errorThrown);
	                }
	              } // fin argument ajax
	          );//Fin Ajax
	   	localStorage.setItem(pos , JSON.stringify(employes));   	
	   	//console.log("loc storing: ", JSON.stringify(employes));
	}
	else 
	{
		employes =  JSON.parse(value);
		//console.log("loc storage: ", employes);
	}
}//Fin DataCtrl

function DataSync()
{
	var index = query - 1;
	const pos = "employeJS_ind";
	
	var jr = JSON.stringify(employes.data[query-1]);	
	
	if(employes.data[query-1].id != null)
	{
		var myUrl = localStorage.getItem('url').concat("/api/employe/", employes.data[query-1].id);
	
		jr = "".concat("{" + '"success"' +  ":true,"+ '"data"' + ":", jr, "}");
		//console.log("jr!: ",jr);
		//console.log("url: ",myUrl);
		
	    $.ajax(
	            {
	            	type: "PUT",
	            	url: myUrl,
	            	data: jr,
	                success: function (i)
	                {
	                	//console.log("success sync");
	                },
	               
	                error: function (jqXHR,textStatus,errorThrown)
	                {
	                	debug = jqXHR;
	                    //console.log("fail ",jqXHR);
	                    //console.log("status ",textStatus);
	                    //console.log("err ",errorThrown);
	                }
	            } // fin argument ajax
	       );//Fin Ajax
	}
	else
	{	
		var myUrl = localStorage.getItem('url').concat("/api/employe");
	
		jr = "".concat("{" + '"success"' +  ":true,"+ '"data"' + ":", jr, "}");
		//console.log("jr!: ",jr);
		//console.log("url: ",myUrl);
		
	    $.ajax(
	            {
	            	type: "POST",
	            	url: myUrl,
	            	data: jr,
	                success: function (i)
	                {
	                	//console.log("success sync");
	                	console.log(i);
	                },
	               
	                error: function (jqXHR,textStatus,errorThrown)
	                {
	                	debug = jqXHR;
	                    //console.log("fail ",jqXHR);
	                    //console.log("status ",textStatus);
	                    //console.log("err ",errorThrown);
	                }
	            } // fin argument ajax
	       );//Fin Ajax
	}
}//Fin

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
					//console.log("fail ",jqXHR);
					//console.log("status ",textStatus);
					//console.log("err ",errorThrown);
				}
	  		} // fin argument ajax
	  	);//Fin Ajax
}//Fin DataCtrl

function dataFilter()
{
	var affichage=false;
	if (document.getElementById("radio-view-b").checked == true)
	{
		for(var i=0; i<employes.data.length; i++)
    	{
			var employe = employes.data[i];
			var el = document.getElementById("employe-li" + employe.id);
			if(employe.inspDelta < 0)
				el.className = el.className.replace(/(?:^|\s)hide-employe(?!\S)/g , '' );
			else
				el.className = el.className + " hide-employe";
    	}
	}	
	else if (document.getElementById("radio-view-c").checked == true)
	{
		for(var i=0; i<employes.data.length; i++)
    	{
			var employe = employes.data[i];
			var el = document.getElementById("employe-li" + employe.id);
			if(employe.inspDelta >= 0)
				el.className = el.className.replace(/(?:^|\s)hide-employe(?!\S)/g , '' );
			else
				el.className = el.className + " hide-employe";
    	}
	}
	else if (document.getElementById("radio-view-a").checked == true)
	{
		for(var i=0; i<employes.data.length; i++)
    	{
			var employe = employes.data[i];
			var el = document.getElementById("employe-li" + employe.id);
			el.className = el.className.replace(/(?:^|\s)hide-employe(?!\S)/g , '' );
    	}
	}
	$('#liste').listview('refresh');
}

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
		query = data.prevPage.context.URL.split("?")[1];
		if(query != null)
		{
			query = query.replace("id=","");
			//console.log("qu: ", query);
			for (var i=0; i<employes.data.length; i++)
			{
				//console.log("        employes.data[i].id: ",employes.data[i].id, " ",
				//		" employes.data[i].nom ",employes.data[i].nom 
				//)
						
				if (employes.data[i].id == query)
					{
						//console.log("   ",i+1)
						query = (i + 1)
					}
			}
			//query is now an ID, do stuff with it... test
			document.getElementById("titre").innerHTML= employes.data[query-1].nom;
			document.getElementById("nom").value = employes.data[query-1].nom;
			document.getElementById("email").value = employes.data[query-1].email;
			document.getElementById("telephone").value = employes.data[query-1].telephone;
			document.getElementById("remarque").value = employes.data[query-1].remarque;
			document.getElementById("bonus").value = employes.data[query-1].bonus;
			
			switch (employes.data[query-1].typeEmploye.toLowerCase())
			{
				case "interne":
					document.getElementById("interne").checked = true;
					$('#externe').checkboxradio ("refresh");
					$('#interne').checkboxradio ("refresh");
					$('#temporaire').checkboxradio ("refresh");
					break;
				case "externe":
					document.getElementById("externe").checked = true;
					$('#externe').checkboxradio ("refresh");
					$('#interne').checkboxradio ("refresh");
					$('#temporaire').checkboxradio ("refresh");
					break;
				case "temporaire":
					document.getElementById("temporaire").checked = true;
					$('#externe').checkboxradio ("refresh");
					$('#interne').checkboxradio ("refresh");
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
		else
		{
			document.getElementById("titre").innerHTML= "";
			document.getElementById("nom").value = "";
			document.getElementById("email").value = "";
			document.getElementById("telephone").value = "";
			document.getElementById("remarque").value = "";
			document.getElementById("bonus").value = "";
			document.getElementById("interne").checked = true
			$('#externe').checkboxradio ("refresh");
			$('#interne').checkboxradio ("refresh");
			$('#temporaire').checkboxradio ("refresh");
			document.getElementById("salaire").value = "0";
			document.getElementById("casque").checked = false ;
			$('#casque').checkboxradio ("refresh");
			document.getElementById("lunettes").checked = false;
			$('#lunettes').checkboxradio("refresh");
			document.getElementById("bottes").checked = false ;
			$('#bottes').checkboxradio ("refresh");
			document.getElementById("territoire").value = "Qu�bec";
			$('#territoire').selectMenu;
		}
	}
);

$("#config").live("pageshow", function(e, data) 
		{
			document.getElementById("url").value = localStorage.getItem('url');
			document.getElementById('popupText').innerHTML = checkConnection();	
		}
		);

$("#suivi").live("pageshow", function(e, data) 
		{
			
		}
);

function refreshPage() 
{
	console.log("IN refreshPage");
	$.mobile.changePage(window.location.href,
			{
		allowSamePageTransition : true,
		transition              : 'none',
		showLoadMsg             : false,
		reloadPage              : true
			}
		);
}

function checkConnection()
{
	//console.log("Connexion: " + navigator.connection);
	if (navigator.network != null)
	{
		//console.log("Connexion Type: " + navigator.connection.type);
		var networkState = navigator.network.connection.type;
		var states = {};
        states[Connection.UNKNOWN]  = 'Connexion inconnue';
        states[Connection.ETHERNET] = 'Connexion Ethernet';
        states[Connection.WIFI]     = 'Connexion WiFi';
        states[Connection.CELL_2G]  = 'Connexion Cell 2G';
        states[Connection.CELL_3G]  = 'Connexion Cell 3G';
        states[Connection.CELL_4G]  = 'Connexion Cell 4G';
        states[Connection.NONE]     = 'Aucune connexion';
        
        return states[networkState];
	}
	else
	{
		if(navigator.onLine)
		{
			return 'Connexion active';
		}
		else
		{
			return 'Aucune connexion';
		}
	}		
}
function updateUrl(value) 
{
	localStorage.setItem('url', value);
}

