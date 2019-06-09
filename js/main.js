var markers = [];
var map;
var _pos = { lat: -24.0113052, lng: -46.4084795 };
var contentString = '<div><a href="padaria.html">' +
    '<img src="imagens/ico_padaria.jpg" alt="logo padaria" class="img-fluid" ' +
    'sytle="height:auto;width:auto;margin:auto;">' +
    '<p>Padaria Giardino</p></a></div>';
var neighborhoods = [
    {
        position: { lat: 0.0010, lng: -0.0058 },
        content: contentString
    }, {
        position: { lat: 0.0050, lng: -0.001 },
        content: contentString
    }, {
        position: { lat: -0.002265, lng: -0.001 },
        content: contentString
    }
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: _pos,
        zoom: 14
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            _pos.lat = position.coords.latitude;
            _pos.lng = position.coords.longitude;

            window.setTimeout(function () {
                var myMarker = new google.maps.Marker({
                    position: _pos,
                    map: map,
                    title: 'Você está aqui!',
                    icon: 'imagens/me.png',
                    animation: google.maps.Animation.DROP
                });

                myMarker.addListener('click', function () {
                    var infowindow = new google.maps.InfoWindow({
                        content: 'Oi!',
                        maxWidth: 200
                    });
                    infowindow.open(map, myMarker);
                });

                markers.push(myMarker);
            }, 50);
            map.setCenter(_pos);
            drop();
        });
    }
}

function drop() {
    clearMarkers();
    for (var i = 0; i < neighborhoods.length; i++) {
        addMarkerWithTimeout(neighborhoods[i], i * 200);
    }
}

function addMarkerWithTimeout(n, timeout) {
    window.setTimeout(function () {
        var marker = new google.maps.Marker({
            position: getPos(n.position),
            map: map,
            animation: google.maps.Animation.DROP
        });

        marker.addListener('click', function () {
            var infowindow = new google.maps.InfoWindow({
                content: n.content,
                maxWidth: 200
            });
            infowindow.open(map, marker);
        });

        markers.push(marker);
    }, timeout);
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function getPos(pos) {
    return new google.maps.LatLng(pos.lat + _pos.lat, pos.lng + _pos.lng);
}

function get_Search(query) {
    var request = {
        query: query,
        fields: ['name', 'geometry'],
    };

    var service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(results[0].geometry.location);
            drop();
        }
    });
}