import L from "leaflet";

const createIcon = (url: string, offset: number) => L.icon({
  iconSize: [35, 41],
  iconAnchor: [16, 21],
  popupAnchor: [2, -10 - offset],
  iconUrl: url
});

const createPingIcon = (url: string, offset: number) => L.icon({
  iconSize: [35, 41],
  iconAnchor: [16, 41],
  popupAnchor: [2, -35 - offset],
  iconUrl: url
});

// Map icons definitions
export const ambulanceIcon = createIcon("/img/map/ambulance_icon.svg", 0);
export const accidentIcon = createIcon("/img/map/accident_icon.svg", 6);
export const floodIcon = createIcon("/img/map/flood_icon.svg", 4);
export const fireIcon = createIcon("/img/map/fire_icon.svg", 4);
export const placeholderIcon = createPingIcon("/img/map/placeholder_icon.svg", 0);
export const heartIcon = createIcon("/img/map/heart_icon.svg", 0);
export const suicideIcon = createIcon("/img/map/suicide_icon.svg", 4);
export const covidIcon = createIcon("/img/map/covid_icon.svg", 4);
export const hospitalIcon = createIcon("/img/map/hospital_icon.svg", 2);
export const policeIcon = createIcon("/img/map/police_icon.svg", 4);
export const fireUnitIcon = createIcon("/img/map/fire_department_icon.svg", 4);
export const guardIcon = createIcon("/img/map/guard_icon.svg", 6);
export const aedIcon = createIcon("/img/map/aed_icon.svg", 2);
