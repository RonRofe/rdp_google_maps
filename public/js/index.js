// Element references
$map = document.querySelector('#map');

// Data
const epsilon = 0.00010;
const { lat, lng } = {
    lat: 32.085300,
    lng: 34.781769
};
const polygons = []; // List of polygons created after drawing completed
let draw = false; // Drawing mode

window.initMap = function() {
    // Initialize map
    const map = new google.maps.Map(
        $map, {
            zoom: 16,
            center: { lat, lng },
            draggable: false
        }
    );

    let polyline;

    const stopDrawing = () => {
        if(polyline) { // Check if a polyline already exists
            polyline.setMap(null); // Remove the last polyline;
        }
        if(draw) {
            const polylineCoords = polyline.getPath().getArray();
            const length = polylineCoords.length;
            const rdpCoords = [];

            rdpCoords.push(polylineCoords[0]); // [A]
            rdp([...polylineCoords], rdpCoords, 0, length-1); // [A, ...]
            rdpCoords.push(polylineCoords[length-1]); // [A, ..., B]

            polygons.push(new google.maps.Polygon({
                map,
                paths: rdpCoords,
                strokeColor: '#0000FF',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillColor: '#0000FF',
                fillOpacity: 0.4,
                editable: true,
                draggable: false
            }));

            draw = false;
        }
    }

    // --------------------------- EVENTS --------------------------- //

    // Drawing started
    map.addListener('mousedown', (event) => {
        polyline = new google.maps.Polyline({ // Initialize a new polyline
            map,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        draw = true;
    })

    // On drawing
    map.addListener('mousemove', (event) => {
        if(draw) {
            const currentPath = polyline.getPath().getArray(); // Array of paths generated till this point

            // Set path of polyline to be with the new coords
            polyline.setPath([
                ...currentPath,
                {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }
            ]);
        }
    });

    // Drawing completed
    $map.addEventListener('mouseup', () => {
        stopDrawing();
    });

    $map.addEventListener('mouseout', () => {
        stopDrawing();
    });
}

const pointsToLine = ({ a, b }, { c, d }) => {
    const slope = (d - b) / (c - a); // Calculate the function slope
    const freeVar = b - slope * a;

    return { slope, freeVar };
}

const pointLineDist = ({ slope, freeVar }, { x, y }) => {
    return Math.abs((slope * x - y + freeVar) / Math.sqrt(Math.pow(slope, 2)+1));
}

const furthestPointIndex = (points, firstIndex, lastIndex) => {
    const first = points[firstIndex];
    const last = points[lastIndex];
    const line = pointsToLine({ a: first.lat(), b: first.lng() }, { c: last.lat(), d: last.lng() });

    let furthestDistance = -1;
    let furthestIndex = -1;

    for(let i = firstIndex+1; i <= lastIndex-1; i++) {
        const currentPoint = points[i];
        const currentDistance = pointLineDist(line, { x: currentPoint.lat(), y: currentPoint.lng() });
        if(currentDistance > furthestDistance) {
            furthestDistance = currentDistance;
            furthestIndex = i;
        }
    }

    if(furthestDistance > epsilon) {
        return furthestIndex; // Return furthest point index
    } else {
        return -1; // No point is valid
    }
}

const rdp = (polyCoords, rdpCoords, firstIndex, lastIndex) => {
    const nextIndex = furthestPointIndex(polyCoords, firstIndex, lastIndex);
    if(nextIndex !== -1) {
        if(firstIndex !== nextIndex) {
            rdp(polyCoords, rdpCoords, firstIndex, nextIndex);
        }
        rdpCoords.push(polyCoords[nextIndex]);
        if(lastIndex !== nextIndex) {
            rdp(polyCoords, rdpCoords, nextIndex, lastIndex);
        }
    }
}