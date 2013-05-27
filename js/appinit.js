/* 
 * External Functions
 * (c) Softnet-Studio
 * www.softnet-studio.de
 */
// Appversion 
var appversion = "0.0.3";
// Welcher Server wird abgefragt?
var jsondataurl = "https://compliancetest.znet-group.com/api/compliancecheck/get";
// PDF Generierung?
var pdfcallurl = "https://compliancetest.znet-group.com/api/compliancecheck/getreportpdf";
// Storage
var storage = window.localStorage;
// Anzeigewerte (Ab welchem Wert soll Eintrag gelb erscheinen?)
var wert_attention = 80;
// Ab welchem Wert soll der Wert rot angezeigt werden?
var wert_danger = 90;
// Initialer Wert zum suchen (Qoute)
var basic_search_percent = 80;
// Anzahl der gespeicherten Suchen
var countSaveSearch = 5;
// Speichern unter
window.appRootDirName = "zaracompliance";

function onDeviceReady(){
    $("#version").text("ZARA - Compliance V" +appversion );
    
    // Cache leeren?
    if(storage.getItem("cacheempty") != "1") {
    	storage.setItem("last_search" , "");
    }

    // Storage aufbauen für Profile
    var value = storage.getItem("userprofile");
    if(value <= 0) {
		value = 0;
    }
    value++;
    storage.setItem("userprofile" , value);
    
    // Lade Daten
    loadSettings();
    
    // alert("Value is: " + value);
    // alert($("#version").text());
	//  http://docs.phonegap.com/en/1.0.0/phonegap_storage_storage.md.html#localStorage
    refreshLastSearch();
	return true;
}

function loadSettings() {
    // Lade eingetragene Such-Werte
    var attention = storage.getItem("attention");
    if(attention <= 0) {
    	attention = 80;
    }
    wert_attention = attention;
    // Alarmwert
    var danger = storage.getItem("danger");
    if(danger <= 0) {
    	danger = 90;
    }
    wert_danger = danger;
    // Suchwert - Quote
    var searchpercent = storage.getItem("searchpercent");
    if(searchpercent <= 0) {
    	searchpercent = 80;
    }
    basic_search_percent = searchpercent;
    // Startwert eintragen bei App-Start
    $("#minvalue").val(basic_search_percent);
}

function prepareSettings() {
	// $("#settings-dialog").html("Laden der Daten...<br /><img src='img/loadbar.gif' />");
	$("#info-title-dialog").text("Einstellungen");
	// $("#settings-dialog").load("ajax/settings.html" , function() {
		$("#openinfo").text(storage.getItem("userprofile"));
		$("#save-data").show();
		$("#save-data").click(function() {
			saveSettings();
		});
		if(storage.getItem("cacheempty") == "1") {
			$("#save-searches").attr("checked" , "checked");
		} else {
			$("#save-searches").removeAttr("checked"); 
		}
		$("#untergrenze-attention").val(wert_attention);
		$("#untergrenze-danger").val(wert_danger);
		$("#untergrenze-suche").val(basic_search_percent);
    // });
}

function searchAgain(parameter, wert) {
	$("#keysearch").val(parameter);
	$("#minvalue").val(wert);
	$("#search-form").submit();
}

function callSearch() {
	try {
		var params = parseURLParams(window.location.href);
		// alert(params["keysearch"] + " __ " + params["minvalue"]);
		// $("#settings-dialog").html("Laden der Daten...<br /><img src='img/loadbar.gif' />");
		var suchwort = params["keysearch"]; // $("#keysearch").val();
		var quote =  params["minvalue"]; // $("#minvalue").val();
		$("#save-data").hide();

		if(suchwort == "") {
			alert("Bitte Parameter zur Suche eingeben!");
			window.location.href= "index.html";
			// Dialog Overlay Cancle
			return false;
		}
		
		if(quote<=1) {
			// Dialog Overlay Cancle
			alert("Bitte Prozentwert zur Suche eingeben!");
			window.location.href= "index.html";
			return false;
		}
		
		$("#info-title-dialog").text("Suchergebnisse");
		
		// XML stat tJSON	 
		
	    $.ajax({
	        type: 'get',
	        url: jsondataurl +  "?name="+suchwort+"&quote=" + quote,
	        timeout: 20000,        // sets timeout for the request (10 seconds)
	        error: function(xhr, status, error) { alert('Fehler beim Abruf, bitte testen Sie Ihre Internetverbindung. Hinweise an den Support: '+ xhr.status+ ' - '+ error); $("#settings-dialog").html("Sie werden zur&uuml;ck zur Suche geleitet..."); window.location.href= "index.html"; },     // alert a message in case of error
	        dataType: 'xml',
	        success: function(response) { 
	        	// var response = '<PortalDTO xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.datacontract.org/2004/07/ZaraCompliance.Web.Models"><CheckEntryId>97</CheckEntryId><Matches xmlns:d2p1="http://schemas.datacontract.org/2004/07/ZaraCompliance.Models"><d2p1:Match><d2p1:Id>1666</d2p1:Id><d2p1:IdListe>4771</d2p1:IdListe><d2p1:MatchInfo>4771</d2p1:MatchInfo><d2p1:Name>Osama BIN LADEN</d2p1:Name><d2p1:Quote>1</d2p1:Quote><d2p1:Source>SDN.AKA</d2p1:Source></d2p1:Match><d2p1:Match><d2p1:Id>1667</d2p1:Id><d2p1:IdListe>4757</d2p1:IdListe><d2p1:MatchInfo>4757</d2p1:MatchInfo><d2p1:Name>Usama BIN LADEN</d2p1:Name><d2p1:Quote>0.9285714285714286</d2p1:Quote><d2p1:Source>SDN.AKA</d2p1:Source></d2p1:Match><d2p1:Match><d2p1:Id>1668</d2p1:Id><d2p1:IdListe>8955</d2p1:IdListe><d2p1:MatchInfo>8955</d2p1:MatchInfo><d2p1:Name>  Osama  bin Ladin</d2p1:Name><d2p1:Quote>0.8571428571428571</d2p1:Quote><d2p1:Source>EU</d2p1:Source></d2p1:Match><d2p1:Match><d2p1:Id>1669</d2p1:Id><d2p1:IdListe>4772</d2p1:IdListe><d2p1:MatchInfo>4772</d2p1:MatchInfo><d2p1:Name>Osama BIN LADIN</d2p1:Name><d2p1:Quote>0.8571428571428571</d2p1:Quote><d2p1:Source>SDN.AKA</d2p1:Source></d2p1:Match></Matches><Quote>80</Quote><Search>Osama bin laden</Search></PortalDTO>';
	    	    var antwortbody = $(response); // $($.parseXML(response)); // 
	    	    antwortbody = antwortbody.find( "PortalDTO" );
	        	var suchquote = $(antwortbody).find('Quote').text();
	        	suchquote = quote; //Math.round(suchquote * 100) / 100;
	    		var html = "<div><div id='searchinfofield'><img src='img/zara-compliance.jpg' alt='ZARA Compliance to go' /><h4>Suchparameter: `"+suchwort+"` ab "+suchquote+" %</h4></div>";
	    		html += "<table class='table'><thead><tr><td colspan='4'><strong>Trefferliste:</strong></td></tr></thead><tbody>";
	    	    var gesamtwert = 0;
	    	    var anzahl = 0;
	            // PDF ID
	            var CheckEntryId = $(antwortbody).find('CheckEntryId').text();
	    	    // gets and parse each child element in <Matches>
	    	    if($(antwortbody).find('Matches').children().length > 0) {
	    	    	$(antwortbody).find('Matches').children().each(function() {
		    	    	// Alle Knoten
			            var elm = $(this);
			            var key = elm.children(":nth-child(2)").text();
			            var name = elm.children(":nth-child(4)").text();
			            // alert("Name: " + name);
			            var quote = elm.children(":nth-child(5)").text();
			            // alert("Quote: " + quote);
			            var source = elm.children(":nth-child(6)").text();
			            
				  		var wertigkeit = (Math.round(quote * 10000) / 100);
				  		gesamtwert += wertigkeit;
				  		var klasse = "";
				  		var ampel = "green";
				  		if(wertigkeit > wert_attention) {
				  			klasse = "alert";
					  		ampel = "yellow";
				  		}
				  		if(wertigkeit > wert_danger) {
				  			klasse = "alert-danger";
					  		ampel = "red";
				  		}
				  		html += '<tr class="'+klasse+'">' +
				  					'<td id="' + key + '">' + name + '</td>' + 
				  					'<td>' + wertigkeit + '</td>'+ 
				  					'<td>' + source + '</td>'+
				  					'<td><img src="img/ampel-'+ampel+'.png"></td>'+
				  				 '</tr>';
				  		anzahl++;
		    	    });
	    	    
				  	// Durschnittsergebniswert
				  	var ergebniswert = (Math.round((gesamtwert / anzahl) * 100) / 100);
				  	// Speichere Suchliste:
				  	// Eintrag: suchwort, minimum, gesamtwert
				  	addEintrag(suchwort , quote , ergebniswert);
	    	    } else {
	    	    	ergebniswert = 0;
				  	addEintrag(suchwort , quote , ergebniswert);
	    	    }
			  	html += "</tbody></table>";
			  	html += "<h3>Gesamtergebnis: "+ergebniswert+" %</h3>";
			  	html += "<a href='#' onclick='downloadFile(\""+pdfcallurl+"?cid="+CheckEntryId+"\");' title='PDF-Download'><img style='height: 30px;' src='img/pdf.png'>PDF Download</a>";
			  	html += "</div>";
			  	
				$("#settings-dialog").html(html);
	    	}
	   });
	} catch(err) {
		alert(err);
		window.location.href= "index.html";
	}
}

function parseURLParams(url) {
	  var queryStart = url.indexOf("?") + 1;
	  var queryEnd   = url.indexOf("#") + 1 || url.length + 1;
	  var query      = url.slice(queryStart, queryEnd - 1);

	  if (query === url || query === "") return;

	  var params  = {};
	  var nvPairs = query.replace(/\+/g, " ").split("&");

	  for (var i=0; i<nvPairs.length; i++) {
	    var nv = nvPairs[i].split("=");
	    var n  = decodeURIComponent(nv[0]);
	    var v  = decodeURIComponent(nv[1]);
	    if ( !(n in params) ) {
	      params[n] = [];
	    }
	    params[n].push(nv.length === 2 ? v : null);
	  }
	  return params;
}

/**
 * Speichere Einstellungen
 */
function saveSettings() {
	try {
	    // Prüfe und speichere Achtungwert
	    var attention = $("#untergrenze-attention").val();
	    if(attention <= 0) {
	    	attention = 80;
	    }
	    if(attention > 99) {
	    	attention = 99;
	    }
	    wert_attention = attention;
	    storage.setItem("attention" , wert_attention);
	
	    // Prüfe und speichere Alarmwert
	    var danger = $("#untergrenze-danger").val();
	    if(danger <= 0) {
	    	danger = 90;
	    }
	    if(danger > 99) {
	    	danger = 99;
	    }
	    wert_danger = danger;
	    storage.setItem("danger" , wert_danger);
	    
	    // Suchwert - Quote
	    var searchpercent = $("#untergrenze-suche").val();
	    if(searchpercent <= 0) {
	    	searchpercent = 80;
	    }
	    basic_search_percent = searchpercent;
	    storage.setItem("searchpercent" , basic_search_percent);
	    // Startwert eintragen bei App-Start
	    $("#minvalue").val(basic_search_percent);
	    
	    // Suchen speichern?
	    if($("#save-searches").is(":checked")) {
	    	storage.setItem("cacheempty" , "1");
	    } else {
	    	storage.setItem("cacheempty" , "0");
	    }
	    
	    // letzte Suche neu anzeigen
	    refreshLastSearch();
	    
	    alert("Gespeichert!");
	} catch(err) {
		alert(err);
	}
}

/**
 * Anzeige der letzten Suche. Speicherung als "suche1,minwert,gesamtwert;suche2,minwert,gesamtwert;"
 */
function refreshLastSearch() {
	try {
		var obj;
		var items = getLastList();
		var inserthtml = '';
		if(items.length > 0) {
			for(var i = 0; i < items.length ; i++) {
				var td = items[i].split(",");
				if(td != "") {
					var wertigkeit = parseFloat(td[2]);
					
			  		var klasse = "";
			  		var ampel = "green";
			  		if(wertigkeit > wert_attention) {
			  			klasse = "alert";
				  		ampel = "yellow";
			  		}
			  		if(wertigkeit > wert_danger) {
			  			klasse = "alert-danger";
				  		ampel = "red";
			  		}
			  		
					inserthtml += '<tr class="'+klasse+'" onclick="searchAgain(\''+td[0]+'\', \''+td[1]+'\');"><td><i class="icon-ok"></i></td><td>'+td[0]+'</td><td>'+td[2]+' %</td><td><img src="img/ampel-'+ampel+'.png" /></td></tr></tr>';
				}
			}
		} else {
			inserthtml += '<tr class="info"><td colspan="4"><i class="icon-ok"></i> Bisher keine Suchdaten...</td></tr>';
		}
	} catch(err) {
		alert(err);
	}
	$("#last-search-body").html(inserthtml);
}

function addEintrag(suchwort , quote , durchschnitt) {
	var liste = getLastList();
	liste.unshift(suchwort + ","+quote+","+durchschnitt);
	setLastList(liste);
}

function getLastList() {
	var liste = storage.getItem("last_search");
	if(liste != null && liste != '') { 
		return liste.split(";");
	}
	return new Array();
}

function setLastList(liste_array) {
	var s = "";
	for(var i = 0; (i < liste_array.length && i < countSaveSearch ); i++) {
		s += liste_array[i] + ";";
	}
	// Speichere als letze Suchen
	storage.setItem("last_search" , s);
}

// Dateidownload
function fail() {
    console.log("failed to get filesystem");
}

function gotFS(fileSystem) {
    console.log("filesystem got");
    window.fileSystem = fileSystem;
    fileSystem.root.getDirectory(window.appRootDirName, {
        create : true,
        exclusive : false
    }, dirReady, fail);
}

function dirReady(entry) {
    window.appRootDir = entry;
    console.log("application dir is ready");
}

downloadFile = function(fileurl) {
    var fileTransfer = new FileTransfer();
    var url = fileurl;
    var dateiname = prompt( "Name der Datei:" , "Report" ); 
    if(dateiname == null) {
    	return;
    }
    if(dateiname == "") {
    	dateiname = "Report";
    }
    var filePath = window.appRootDir.fullPath + "/"+dateiname+".pdf";

    fileTransfer.download(
        url,
        filePath,
        function(entry) {
            if(window.confirm("Download fertig: " + entry.fullPath + ". Jetzt anzeigen?")) {
            	window.plugins.fileOpener.open(entry.fullPath);
            }
        },
        function(error) {
            alert("Fehler beim Download:" + error.source);
        }
    );
}
// Ende Dateidownload

function showInformation() {
	alert("ZARA - Compliance App V"+appversion+"\nZNET-Group\nwww.znet-group.com\nProgrammierung:\nSoftnet-Studio\nwww.softnet-studio.de");
}
