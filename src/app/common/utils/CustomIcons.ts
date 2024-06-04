import L, { Icon } from "leaflet";

const createCustomIcon = (color: string): Icon => {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
      <path d="M21 10c0 5-9 13-9 13S3 15 3 10a9 9 0 1 1 18 0z"></path>
      <circle cx="12" cy="10" r="6"></circle>
    </svg>
  `;
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgIcon)}`,
    iconSize: [32, 32], // Adjust icon size as needed
    iconAnchor: [16, 32], // Adjust icon anchor position as needed
    popupAnchor: [0, -32], // Adjust popup anchor position as needed
  });
};

const customMarkerIcon = L.icon({
  iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
  iconUrl: "leaflet/images/marker-icon.png",
  shadowUrl: "leaflet/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const favoriteMarkerIcon = L.icon({
  iconUrl: "leaflet/images/fav.png",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const homeMarkerIcon = L.icon({
  iconUrl: "leaflet/images/home.png",
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const emptyHeartIcon = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><defs></defs>
  <g style="stroke: red; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <path d="M 45 87.273 L 45 87.273 c -0.849 0 -1.605 -0.536 -1.887 -1.337 c -3.033 -8.631 -10.638 -13.596 -18.69 -18.853 C 12.976 59.61 0 51.14 0 30.374 C 0 15.129 12.197 2.727 27.189 2.727 c 6.616 0 12.869 2.385 17.811 6.756 c 4.943 -4.371 11.196 -6.756 17.812 -6.756 C 77.804 2.727 90 15.129 90 30.374 c 0 20.766 -12.976 29.236 -24.423 36.71 c -8.053 5.257 -15.658 10.222 -18.69 18.853 C 46.605 86.737 45.849 87.273 45 87.273 z M 27.189 6.727 C 14.402 6.727 4 17.335 4 30.374 c 0 18.601 10.982 25.771 22.61 33.361 c 7.02 4.582 14.244 9.299 18.39 16.7 c 4.146 -7.401 11.37 -12.117 18.39 -16.7 C 75.018 56.145 86 48.975 86 30.374 C 86 17.335 75.598 6.727 62.812 6.727 c -6.188 0 -12.006 2.455 -16.385 6.914 c -0.376 0.383 -0.89 0.599 -1.427 0.599 l 0 0 c -0.537 0 -1.051 -0.216 -1.427 -0.599 C 39.195 9.182 33.376 6.727 27.189 6.727 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
  </g>
</svg>
`;

const fullHeartIcon = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><defs></defs>
  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <path d="M 84.646 11.504 C 75.554 1.233 58.335 -0.041 45 13.074 C 31.665 -0.041 14.446 1.233 5.354 11.504 c -9.671 10.926 -5.609 31.318 7.123 47.615 C 18.931 67.38 34.874 80.832 45 86.481 c 10.126 -5.649 26.069 -19.101 32.523 -27.362 C 90.255 42.822 94.318 22.43 84.646 11.504 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(248,48,95); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
  </g>
</svg>
`;

const homeSmallIcon = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 256 256" xml:space="preserve"><defs></defs>
  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <path d="M 45 1.5 L 1.5 35.137 h 10.888 V 88.5 h 20.752 V 62.269 c 0 -4.221 3.337 -7.674 7.416 -7.674 h 8.889 c 4.079 0 7.416 3.453 7.416 7.674 V 88.5 h 20.752 V 35.137 H 88.5 L 45 1.5 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
    <path d="M 77.612 90 H 56.86 c -0.828 0 -1.5 -0.672 -1.5 -1.5 V 62.27 c 0 -3.405 -2.654 -6.175 -5.916 -6.175 h -8.889 c -3.262 0 -5.917 2.77 -5.917 6.175 V 88.5 c 0 0.828 -0.671 1.5 -1.5 1.5 H 12.388 c -0.829 0 -1.5 -0.672 -1.5 -1.5 V 36.637 H 1.5 c -0.642 0 -1.212 -0.408 -1.419 -1.015 c -0.208 -0.607 -0.006 -1.279 0.502 -1.671 l 43.5 -33.637 c 0.54 -0.418 1.295 -0.418 1.835 0 l 43.5 33.637 c 0.507 0.393 0.709 1.064 0.502 1.671 c -0.208 0.607 -0.778 1.015 -1.42 1.015 h -9.388 V 88.5 C 79.112 89.328 78.44 90 77.612 90 z M 58.36 87 h 17.752 V 35.137 c 0 -0.829 0.672 -1.5 1.5 -1.5 h 6.496 L 45 3.396 L 5.892 33.637 h 6.496 c 0.829 0 1.5 0.671 1.5 1.5 V 87 h 17.751 V 62.27 c 0 -5.059 4 -9.175 8.917 -9.175 h 8.889 c 4.916 0 8.916 4.116 8.916 9.175 V 87 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
  </g>
</svg>
`;



export {
  customMarkerIcon,
  favoriteMarkerIcon,
  homeMarkerIcon,
  emptyHeartIcon,
  fullHeartIcon,
  homeSmallIcon,
  createCustomIcon
};
