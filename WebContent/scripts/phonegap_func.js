document.addEventListener("deviceready", onDeviceReady, false);

//PhoneGap is loaded and it is now safe to make calls PhoneGap methods
function onDeviceReady() 
{
	//console.log("Device Ready");
	//document.addEventListener("pause", onPause, false);
    //document.addEventListener("resume", onResume, false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
}

//Handle the pause event
function onPause() 
{
}

//Handle the resume event
function onResume() 
{
}

//Handle the online event
function onOnline() 
{
	navigator.notification.beep(1);
}

//Handle the offline event
function onOffline() 
{
	navigator.notification.vibrate(500);
}

function capturePhoto()
{
	navigator.camera.getPicture(onPhotoSuccess, null, 
			{quality: 50,
			 destinationType : Camera.DestinationType.FILE_URI,
			 sourceType : Camera.PictureSourceType.CAMERA,
			 encodingType: Camera.EncodingType.JPEG,
			});
}

function onPhotoSuccess(imageURI) 
{
	// Get image handle
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    smallImage.src = imageURI;
}

function captureBarcode()
{
	window.plugins.barcodeScanner.scan(function(result) 
			{
				if (result.cancelled)
					navigator.notification.alert("Scan annulé");
				else
					navigator.notification.alert("Résultat: " + result.text);
		
				/*alert("We got a barcode\n" +
						"Result: " + result.text + "\n" +
						"Format: " + result.format + "\n" +
						"Cancelled: " + result.cancelled);*/
			}, function(error) 
			{
				navigator.notification.alert("Échec: " + error);
			});
}





