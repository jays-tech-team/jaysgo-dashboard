import { useEffect, useRef } from "react";

export interface PlaceFetchedFields {
  displayName: string;
  formattedAddress: string;
  id: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface PlaceAutocompleteProps {
  onPlaceSelect?: (place: PlaceFetchedFields) => void;
}

/**
 * Custom Autocomplete
 * @param param0
 * @returns
 * @Link https://developers.google.com/maps/documentation/javascript/place-autocomplete-new
 * @Link https://developers.google.com/maps/documentation/javascript/examples/place-autocomplete-element
 */
function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Clear previous children to avoid duplicates
    elementRef.current.innerHTML = "";

    const autocompleteElement = new google.maps.places.PlaceAutocompleteElement(
      {
        // includedRegionCodes: ["ae"], // Need fix this type error.
        requestedRegion: "AE",
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autocompleteElement.addEventListener("gmp-select", async (event: any) => {
      const place = event.placePrediction.toPlace();

      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location"],
      });
      onPlaceSelect?.(place.toJSON());
    });

    elementRef.current.appendChild(autocompleteElement);

    return () => {
      if (elementRef.current && autocompleteElement) {
        elementRef.current.removeChild(autocompleteElement);
      }
    };
  }, [onPlaceSelect]);

  return <div className="search-input" ref={elementRef} />;
}

export default PlaceAutocomplete;
