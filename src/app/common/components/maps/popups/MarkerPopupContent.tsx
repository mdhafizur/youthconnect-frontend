import React from 'react';

const MarkerPopupContent = ({ properties, geometry }) => (
  <div className="text-left">
    <p className="mt-2">
      <strong>Name:</strong> {properties.kurzbezeichnung}
    </p>
    <p>
      <strong>Provider:</strong> {properties.traeger}
    </p>
    <p>
      <strong>Services:</strong> {properties.leistungen}
    </p>
    <p>
      <strong>Address:</strong> {properties.strasse}, {properties.plz}{" "}
      {properties.ort}
    </p>
    <p>
      <strong>Tel:</strong>{" "}
      {properties.telefon ? (
        <a href={`tel:${properties.telefon}`}>{properties.telefon}</a>
      ) : (
        "N/A"
      )}
    </p>
    <p>
      <strong>Email:</strong>{" "}
      {properties.email ? (
        <a href={`mailto:${properties.email}`}>{properties.email}</a>
      ) : (
        "N/A"
      )}
    </p>
    <p>
      <strong>Fax:</strong> {properties.fax}
    </p>
    <p>
      <strong>Coordinates:</strong> {geometry.coordinates.join(", ")}
    </p>
  </div>
);

export default MarkerPopupContent;
