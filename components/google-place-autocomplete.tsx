"use client";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { HTMLAttributes, useRef, useState } from "react";
import { Input } from "./ui/input";
const libraries: ("places" | any)[] = ["places", "geocoding", "core"];
interface MapWithAutocompleteProps extends HTMLAttributes<HTMLInputElement> {
  onLocationChange: any;
  addressLineOne?: boolean;
  addressLineTwo?: boolean;
}
const MapWithAutocomplete = ({
  onLocationChange,
  ...props
}: MapWithAutocompleteProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCX5cYv4n6Hilm1jsHV4orHCBMwh9gO6ds",
    libraries,
  });
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();
  const [errorText, setErrorText] = useState<string>("");
  const onLoadAutocomplete = (
    autocomplete: google.maps.places.Autocomplete,
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place: google.maps.places.PlaceResult =
        autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        const address = place?.name;
        let foundCity = "";
        let foundState = "";
        let foundZipCode = "";

        if (place.address_components) {
          place.address_components.forEach((component) => {
            if (component.types.includes("locality")) {
              foundCity = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
              foundState = component.short_name;
            }
            if (component.types.includes("postal_code")) {
              foundZipCode = component.long_name;
            }
          });
        }

        onLocationChange({
          lat: latitude,
          lng: longitude,
          city: foundCity,
          state: foundState,
          zipCode: foundZipCode,
          address,
        });
      }
    }
  };

  if (loadError) {
    setErrorText(`Error loading Google Maps API: ${loadError.message}`);
  }

  return (
    <div>
      {isLoaded && (
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={handlePlaceChanged}
          types={["geocode"]}
          options={{ componentRestrictions: { country: "us" } }}
        >
          <>
            {props?.addressLineOne && !props?.addressLineTwo && (
              <Input type="text" placeholder="Address line 1" {...props} />
            )}
            {!props?.addressLineOne && props?.addressLineTwo && (
              <Input type="text" placeholder="Address line 2" {...props} />
            )}
            {!props?.addressLineOne && !props?.addressLineTwo && (
              <Input type="text" placeholder="Address" {...props} />
            )}
          </>
          {/* <Input type="text" placeholder="Address" {...props} /> */}
        </Autocomplete>
      )}
      {loadError && <div>{errorText}</div>}
    </div>
  );
};

export default MapWithAutocomplete;
