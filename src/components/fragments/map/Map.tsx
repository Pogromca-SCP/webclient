import L from "leaflet";
import { To } from "react-router-dom";
import { MarkGeocodeEventHandlerFn, MarkGeocodeEvent } from "leaflet-control-geocoder/dist/control";
import Geocoder, { geocoders } from "leaflet-control-geocoder";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { Row } from "react-bootstrap";
import NavButton from "../navigation/NavButton";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

export interface Position {
  coords: [number, number],
  desc?: string | string[],
  icon?: L.Icon<L.IconOptions> | L.DivIcon,
  to?: To
}

export interface Path {
  points: [number, number][],
  color?: string
}

export interface MapParams {
  center: [number, number],
  initialZoom: number,
  marks?: Position[],
  paths?: Path[],
  small?: boolean,
  searchable?: boolean,
  onSearch?: MarkGeocodeEventHandlerFn,
  clickable?: boolean,
  onClick?: (x: Readonly<L.LatLng>) => void
}

// Leaflet map wrapper component with search and mouse clicking support
const Map = (props: Readonly<MapParams>) => {
  const [geocoder] = useState(new geocoders.Nominatim({
    geocodingQueryParams: {
      "polygon_geojson": 1,
      "limit": 10,
      "format": "jsonv2",
      "viewbox": (props.center[1] - 0.5) + "," + (props.center[0] - 0.5) + "," + (props.center[1] + 0.5) + "," + (props.center[0] + 0.5),
      "bounded": 1
    }
  }));

  const { t } = useTranslation();

  return (
    <MapContainer center={props.center} zoom={props.initialZoom} className={props.small ? "small-map" : "big-map"}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {props.searchable ? <GeocoderMenu geocoder={geocoder} onSearch={props.onSearch} /> : ""}
      {props.clickable ? <ClickHandler geocoder={geocoder} onClick={props.onClick} /> : ""}
      {props.paths ? props.paths.map((path, index) => <Polyline key={index} positions={path.points} color={path.color} />) : ""}
      {props.marks ? props.marks.map((pos, index) => (
        <Marker key={index} position={pos.coords} icon={pos.icon}>
          {pos.desc || pos.to ? (
            <Popup>
              {pos.desc ? (typeof(pos.desc) === "string" ? <p className="text-center">{pos.desc}</p> : pos.desc.map((d, index) => <p key={index} className="text-center">{d}</p>)) : ""}
              {pos.to ? <Row className="justify-content-center"><NavButton to={pos.to}>{t("Common.Details")}</NavButton></Row> : ""}
            </Popup>
          ) : ""}
        </Marker>
      )) : ""}
    </MapContainer>
  );
};

interface GeocoderParam {
  geocoder: geocoders.Nominatim
}

interface ClickParams extends GeocoderParam {
  onClick?: (x: Readonly<L.LatLng>) => void
}

interface GeocodeParams extends GeocoderParam {
  onSearch?: MarkGeocodeEventHandlerFn
}

// Mouse click handler
const ClickHandler = (props: Readonly<ClickParams>) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (props.onClick) {
        props.onClick(e.latlng);
      }
    },
    moveend(e) {
      if (props.geocoder.options.geocodingQueryParams) {
        props.geocoder.options.geocodingQueryParams["viewbox"] = map.getBounds().toBBoxString();
      }
    }
  });

  return null;
};


// Map search menu
const GeocoderMenu = (props: Readonly<GeocodeParams>) => {
  const map = useMap();
  const { t } = useTranslation();

  useEffect(() => {
    const geocoder = new Geocoder({
      placeholder: t("Common.Search"),
      errorMessage: t("Common.NoResults"),
      defaultMarkGeocode: false,
      geocoder: props.geocoder
    });

    const search = (e: MarkGeocodeEvent) => map.flyTo(e.geocode.center, map.getZoom());
    geocoder.on("markgeocode", props.onSearch ?? search);
    geocoder.addTo(map);

    return () => {
      geocoder.remove();
    };
  }, [map, t, props.onSearch, props.geocoder]);

  return null;
};

export default Map;
