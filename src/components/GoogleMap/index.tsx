import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Crosshair } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { __clog } from "../../lib/utils";
import PlaceAutocomplete, { PlaceFetchedFields } from "./PlaceAutocomplete";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapIds = import.meta.env.VITE_GOOGLE_MAPS_ID;

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries: ("places" | "marker" | "geocoding")[] = [
  "places",
  "marker",
  "geocoding",
];

interface MapComponentProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address?: string;
  }) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    mapIds: [mapIds],
    googleMapsApiKey, // Replace with your key
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const geocodeLatLng = (
    geocoder: google.maps.Geocoder,
    latlng: { lat: number; lng: number }
  ) => {
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results && results[0]) {
          setSelectedAddress(results[0].formatted_address);
          onLocationSelect({
            ...latlng,
            address: results[0].formatted_address,
          });
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    });
  };

  useEffect(() => {
    if (marker) {
      marker.map = null;
    }

    if (map && markerPosition && window.google) {
      const newMarker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: markerPosition,
      });
      setMarker(newMarker);

      const geocoder = new window.google.maps.Geocoder();
      geocodeLatLng(geocoder, markerPosition);
    }
  }, [markerPosition, map]);

  const panToCurrentUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          map?.panTo(userLocation);
          map?.setZoom(14);
          setMarkerPosition(userLocation);
        },
        () => {
          // Handle error or if user denies location access
          __clog("Error: The Geolocation service failed or was denied.");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      __clog("Browser doesn't support Geolocation.");
    }
  }, [map]);

  const onLoad = useCallback(
    function callback(mapInstance: google.maps.Map) {
      const initialPosition = { lat: 23.4241, lng: 53.8478 }; // Default to UAE
      mapInstance.setCenter(initialPosition);
      mapInstance.setZoom(7);

      setMap(mapInstance);

      panToCurrentUserLocation();
    },
    [panToCurrentUserLocation]
  );

  const onUnmount = useCallback(function callback() {
    // setMap(null);
  }, []);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setMarkerPosition(newPosition);
        onLocationSelect(newPosition);
      }
    },
    [onLocationSelect]
  );

  const onPlaceChanged = (place: PlaceFetchedFields) => {
    if (place.location.lat) {
      map?.panTo(place.location);
      map?.setZoom(14);

      setMarkerPosition(place.location);
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return isLoaded ? (
    <div style={{ position: "relative" }}>
      <PlaceAutocomplete
        onPlaceSelect={(place) => {
          onPlaceChanged(place);
        }}
      />

      <button
        onClick={panToCurrentUserLocation}
        type="button"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 10,
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
        title="Pin my current location"
      >
        <Crosshair size={20} />
      </button>
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={{
          mapId: "344aa47a6a5b28204fab50c6",
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy",
          minZoom: 7,
          maxZoom: 19,
          zoomControl: true,
          cameraControl: false,
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      ></GoogleMap>
      {selectedAddress && (
        <div
          style={{
            padding: "10px",
            background: "#f8f8f8",
            borderTop: "1px solid #ddd",
          }}
        >
          <strong>Selected Address:</strong>
          <p>{selectedAddress}</p>
        </div>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default MapComponent;
