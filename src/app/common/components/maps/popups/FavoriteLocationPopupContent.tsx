import React from "react";

const FavoriteLocationPopupContent = ({ favoriteFacility }) => {
  return (
    <div className="text-left">
      <strong>Favorite Location</strong>
      <p className="mt-2">
        <strong>Name:</strong> {favoriteFacility.properties.kurzbezeichnung}
      </p>
      <p>
        <strong>Provider:</strong> {favoriteFacility.properties.traeger}
      </p>
      <p>
        <strong>Services:</strong> {favoriteFacility.properties?.leistungen}
      </p>
      <p>
        <strong>Address:</strong> {favoriteFacility.properties.strasse},{" "}
        {favoriteFacility.properties.plz} {favoriteFacility.properties.ort}
      </p>
      <p>
        <strong>Tel:</strong>{" "}
        {favoriteFacility.properties.telefon ? (
          <a href={`tel:${favoriteFacility.properties.telefon}`}>
            {favoriteFacility.properties.telefon}
          </a>
        ) : (
          "N/A"
        )}
      </p>
      <p>
        <strong>Email:</strong>{" "}
        {favoriteFacility.properties.email ? (
          <a href={`mailto:${favoriteFacility.properties.email}`}>
            {favoriteFacility.properties.email}
          </a>
        ) : (
          "N/A"
        )}
      </p>
      <p>
        <strong>Fax:</strong> {favoriteFacility.properties.fax}
      </p>
      <p>
        <strong>Coordinates:</strong> {favoriteFacility.geometry.coordinates}
      </p>
    </div>
  );
};

export default FavoriteLocationPopupContent;
