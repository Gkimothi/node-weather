let locationButton = document.getElementById('location');

locationButton.addEventListener('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.disabled = true;

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.disabled = false;
        let latlng = position.coords.latitude + ',' + position.coords.longitude
        //console.log(latlng);
        document.getElementById("inputAddress").value = latlng;
        document.getElementById("search").click();
    }, function () {
        locationButton.disabled = false;
        alert('Unable to fetch location');
    });
});