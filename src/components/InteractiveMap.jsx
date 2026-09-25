import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Compass, Info, Satellite, Navigation, LocateFixed, Train, Car, Footprints,
  ExternalLink, Calendar, Sparkles, ChevronRight, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';
import { CITIES } from '../data/destinations';

// High-Resolution Satellite Basemap Configuration (Locked Hybrid Satellite)
const SATELLITE_BASE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_OVERLAY_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
const SATELLITE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

// In-memory cache for OSRM routes to prevent redundant network fetches
const routeCache = new Map();

// Travel method configurations for true street-level routing
const TRAVEL_MODES = [
  {
    id: 'driving',
    label: 'Driving / Highway',
    icon: Car,
    profile: 'driving',
    badgeText: 'Expressway & Road Network',
    colorHex: '#ff0055',
    glowHex: '#00f0ff',
    description: 'Traces real-world expressways (Tomei, Meishin, San-yo), bridges, coastal highways & city streets',
  },
  {
    id: 'transit',
    label: 'Transit Artery',
    icon: Train,
    profile: 'driving',
    badgeText: 'Rail & Highway Artery Corridor',
    colorHex: '#00f0ff',
    glowHex: '#7928ca',
    description: 'Follows intercity transit corridors and high-speed arterial connections between hubs',
  },
  {
    id: 'walking',
    label: 'Walking / Foot',
    icon: Footprints,
    profile: 'walking',
    badgeText: 'Pedestrian & Walking Paths',
    colorHex: '#10b981',
    glowHex: '#00f5d4',
    description: 'Traces walkable pathways, sidewalks, pedestrian bridges & city walking routes',
  },
];

export default function InteractiveMap({ itinerary, selectedCityKey, onSelectCity }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerGroupRef = useRef(null);
  const routeLayerGroupRef = useRef(null);
  const markersLayerGroupRef = useRef(null);

  const [activeCityKey, setActiveCityKey] = useState(selectedCityKey || 'tokyo');
  const [travelMode, setTravelMode] = useState('driving');
  const [routeState, setRouteState] = useState({
    coordinates: [],
    distanceKm: null,
    durationText: null,
    waypointsCount: 0,
    isFallback: false,
    loading: false,
    error: null,
  });

  // Extract cities in sequence from the itinerary
  const itineraryCities = useMemo(() => {
    return itinerary?.days
      ? [...new Set(itinerary.days.map(d => d.cityKey))]
      : ['tokyo', 'kyoto', 'osaka'];
  }, [itinerary]);

  // Compute days assigned to each city for marker badges
  const cityDaysMap = useMemo(() => {
    const map = {};
    if (!itinerary?.days) return map;
    itinerary.days.forEach(d => {
      if (!map[d.cityKey]) map[d.cityKey] = [];
      map[d.cityKey].push(d.dayNumber);
    });
    return map;
  }, [itinerary]);

  const activeCity = CITIES[activeCityKey] || CITIES.tokyo;
  const currentModeConfig = TRAVEL_MODES.find(m => m.id === travelMode) || TRAVEL_MODES[0];

  // ---------------------------------------------------------------------------
  // 1. Initialize Leaflet Map with Hardcoded High-Resolution Satellite View
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map centered over Japan
    const map = L.map(mapContainerRef.current, {
      center: [36.2, 138.25],
      zoom: 5.6,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false, // Custom high-contrast satellite HUD zoom controls
    });

    // Layer groups for clean, decoupled updates
    const tileGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    tileLayerGroupRef.current = tileGroup;
    routeLayerGroupRef.current = routeGroup;
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Hardcode High-Resolution Satellite Base Layer (Esri World Imagery)
    const satelliteBase = L.tileLayer(SATELLITE_BASE_URL, {
      maxZoom: 19,
      attribution: SATELLITE_ATTRIBUTION,
    });
    tileGroup.addLayer(satelliteBase);

    // Hardcode Hybrid Vector Overlay Layer (Roads, Boundaries & City Names)
    const satelliteOverlay = L.tileLayer(SATELLITE_OVERLAY_URL, {
      maxZoom: 19,
      opacity: 0.9,
    });
    tileGroup.addLayer(satelliteOverlay);

    // Force map size invalidation on render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. Fetch True Street-Level Snapped Route Geometry (OSRM Directions API)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    async function fetchRoadSnappedRoute() {
      const validCities = itineraryCities
        .map(key => CITIES[key])
        .filter(c => c && c.coordinates);

      if (validCities.length < 2) {
        setRouteState({
          coordinates: validCities.map(c => [c.coordinates.lat, c.coordinates.lng]),
          distanceKm: 0,
          durationText: '0 min',
          waypointsCount: validCities.length,
          isFallback: false,
          loading: false,
          error: null,
        });
        return;
      }

      const osrmProfile = travelMode === 'walking' ? 'walking' : 'driving';
      const coordsString = validCities.map(c => `${c.coordinates.lng},${c.coordinates.lat}`).join(';');
      const cacheKey = `${osrmProfile}:${coordsString}`;

      // Check in-memory cache for instant switching
      if (routeCache.has(cacheKey)) {
        const cached = routeCache.get(cacheKey);
        setRouteState({
          ...cached,
          loading: false,
          error: null,
        });
        return;
      }

      setRouteState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000); // 7s timeout

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/${osrmProfile}/${coordsString}?overview=full&geometries=geojson`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Routing HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          const route = data.routes[0];
          // GeoJSON gives [longitude, latitude] -> convert to Leaflet [latitude, longitude]
          const latLngs = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          const distanceKm = Math.round(route.distance / 1000);

          let durationText = '';
          if (travelMode === 'transit') {
            // High-speed transit / Shinkansen corridor estimate (~190 km/h average including station dwells)
            const transitHours = Math.max(0.4, distanceKm / 190);
            const hrs = Math.floor(transitHours);
            const mins = Math.round((transitHours - hrs) * 60);
            durationText = hrs > 0 ? `${hrs}h ${mins}m rail` : `${mins}m rail`;
          } else if (route.duration) {
            const totalMinutes = Math.round(route.duration / 60);
            const hrs = Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            durationText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
          }

          const result = {
            coordinates: latLngs,
            distanceKm,
            durationText,
            waypointsCount: latLngs.length,
            isFallback: false,
          };

          routeCache.set(cacheKey, result);

          if (!isCancelled) {
            setRouteState({
              ...result,
              loading: false,
              error: null,
            });
          }
          return;
        }

        throw new Error(data.message || 'Route geometry not returned');
      } catch (err) {
        console.warn('Primary multi-point OSRM call failed, attempting leg-by-leg pairwise snapping:', err);

        // Fallback: Attempt pairwise leg queries (e.g. Tokyo -> Kyoto, Kyoto -> Osaka)
        try {
          let combinedLatLngs = [];
          let totalMeters = 0;
          let totalSecs = 0;
          let hasFallbackLeg = false;

          for (let i = 0; i < validCities.length - 1; i++) {
            const cA = validCities[i];
            const cB = validCities[i + 1];
            const pairParam = `${cA.coordinates.lng},${cA.coordinates.lat};${cB.coordinates.lng},${cB.coordinates.lat}`;

            try {
              const pairRes = await fetch(
                `https://router.project-osrm.org/route/v1/${osrmProfile}/${pairParam}?overview=full&geometries=geojson`
              );
              const pairData = await pairRes.json();
              if (pairData.code === 'Ok' && pairData.routes && pairData.routes[0]) {
                const r = pairData.routes[0];
                const legPoints = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                combinedLatLngs = combinedLatLngs.concat(legPoints);
                totalMeters += r.distance;
                totalSecs += r.duration;
                continue;
              }
            } catch {
              // Pair leg failed
            }

            // Leg fallback to straight connecting line
            hasFallbackLeg = true;
            combinedLatLngs.push([cA.coordinates.lat, cA.coordinates.lng]);
            combinedLatLngs.push([cB.coordinates.lat, cB.coordinates.lng]);
          }

          const distKm = Math.round(totalMeters / 1000);
          const totalMins = Math.round(totalSecs / 60);
          const hrs = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          const durText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

          const result = {
            coordinates: combinedLatLngs,
            distanceKm: distKm > 0 ? distKm : null,
            durationText: distKm > 0 ? durText : 'Estimated',
            waypointsCount: combinedLatLngs.length,
            isFallback: hasFallbackLeg,
          };

          routeCache.set(cacheKey, result);

          if (!isCancelled) {
            setRouteState({
              ...result,
              loading: false,
              error: null,
            });
          }
        } catch (pairErr) {
          console.warn('Pairwise routing also failed, falling back to direct itinerary waypoints:', pairErr);
          const directCoords = validCities.map(c => [c.coordinates.lat, c.coordinates.lng]);
          if (!isCancelled) {
            setRouteState({
              coordinates: directCoords,
              distanceKm: null,
              durationText: null,
              waypointsCount: directCoords.length,
              isFallback: true,
              loading: false,
              error: 'Real-world road network temporarily unreachable. Showing direct connections.',
            });
          }
        }
      }
    }

    fetchRoadSnappedRoute();

    return () => {
      isCancelled = true;
    };
  }, [itineraryCities, travelMode]);

  // ---------------------------------------------------------------------------
  // 3. Render High-Contrast Street-Snapped Polyline & Markers on Satellite Map
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeGroup = routeLayerGroupRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !routeGroup || !markersGroup) return;

    routeGroup.clearLayers();
    markersGroup.clearLayers();

    // -------------------------------------------------------------------------
    // A. Render 3-Layer Vibrant High-Contrast Road-Snapped Polyline
    // -------------------------------------------------------------------------
    if (routeState.coordinates.length > 1) {
      const isWalking = travelMode === 'walking';
      const isTransit = travelMode === 'transit';

      // 1. Outer Glow Underlay (Vibrant Electric Cyan / Emerald glow for contrast against satellite dark terrain)
      const glowColor = isWalking ? '#00f5d4' : isTransit ? '#00f0ff' : '#00f0ff';
      const glowLine = L.polyline(routeState.coordinates, {
        color: glowColor,
        weight: 10,
        opacity: 0.65,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeGroup.addLayer(glowLine);

      // 2. Middle Main Line (Vivid Neon Crimson / Jade)
      const middleColor = isWalking ? '#059669' : isTransit ? '#7928ca' : '#ff0055';
      const middleLine = L.polyline(routeState.coordinates, {
        color: middleColor,
        weight: 5.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeGroup.addLayer(middleLine);

      // 3. Inner Core High-Contrast Track (Pure Solid / Dashed White)
      const coreLine = L.polyline(routeState.coordinates, {
        color: '#ffffff',
        weight: 2.2,
        opacity: 1.0,
        dashArray: isTransit ? '7, 9' : isWalking ? '5, 7' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeGroup.addLayer(coreLine);
    }

    // -------------------------------------------------------------------------
    // B. Render High-Contrast Markers with Obsidian Glass & Popups
    // -------------------------------------------------------------------------
    Object.values(CITIES).forEach(city => {
      if (!city.coordinates) return;

      const isItineraryCity = itineraryCities.includes(city.id);
      const isSelected = activeCityKey === city.id;
      const days = cityDaysMap[city.id] || [];

      // Day Badge label
      let dayBadgeText = '';
      if (days.length === 1) {
        dayBadgeText = `Day ${days[0]}`;
      } else if (days.length > 1) {
        dayBadgeText = `Days ${days[0]}-${days[days.length - 1]}`;
      } else if (isItineraryCity) {
        dayBadgeText = 'In Route';
      }

      // Marker Visual Elements
      const markerHtml = `
        <div class="custom-leaflet-marker ${isSelected ? 'marker-selected' : ''}" style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          user-select: none;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.85));
        ">
          ${dayBadgeText ? `
            <div style="
              background: ${isSelected
                ? 'linear-gradient(135deg, #ff0055, #c1121f)'
                : 'linear-gradient(135deg, #00b4d8, #0077b6)'};
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
              padding: 2px 9px;
              border-radius: 9999px;
              border: 1.5px solid ${isSelected ? '#fbbf24' : '#ffffff'};
              box-shadow: 0 0 15px ${isSelected ? 'rgba(255, 0, 85, 0.7)' : 'rgba(0, 180, 216, 0.6)'};
              white-space: nowrap;
              margin-bottom: 4px;
              letter-spacing: 0.03em;
            ">
              ${dayBadgeText}
            </div>
          ` : ''}

          <!-- Outer High-Contrast Ring -->
          <div style="
            position: relative;
            width: ${isSelected ? '46px' : isItineraryCity ? '38px' : '32px'};
            height: ${isSelected ? '46px' : isItineraryCity ? '38px' : '32px'};
            border-radius: 50%;
            background: ${isSelected
              ? 'linear-gradient(135deg, #ff0055, #b91c1c)'
              : isItineraryCity
              ? 'linear-gradient(135deg, #0284c7, #0369a1)'
              : 'rgba(15, 23, 42, 0.92)'};
            border: ${isSelected ? '3px solid #ffffff' : '2.5px solid #ffffff'};
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: ${isSelected ? '17px' : isItineraryCity ? '14px' : '12px'};
            font-weight: 800;
            box-shadow: 0 0 20px ${isSelected ? 'rgba(255, 0, 85, 0.85)' : isItineraryCity ? 'rgba(0, 240, 255, 0.75)' : 'rgba(0, 0, 0, 0.65)'};
            transition: all 0.25s ease;
          ">
            <span>${city.kanji ? city.kanji.charAt(0) : '●'}</span>
          </div>

          <!-- City Name Label Below -->
          <div style="
            margin-top: 5px;
            background: rgba(5, 10, 25, 0.94);
            backdrop-filter: blur(8px);
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            white-space: nowrap;
            border: 1px solid ${isSelected ? '#ff0055' : isItineraryCity ? 'rgba(0, 240, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
            letter-spacing: 0.02em;
          ">
            ${city.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'leaflet-custom-div-icon',
        iconSize: [46, 75],
        iconAnchor: [23, 37],
      });

      const marker = L.marker([city.coordinates.lat, city.coordinates.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1200 : isItineraryCity ? 600 : 150,
      });

      // High-contrast satellite popup
      const popupContent = `
        <div class="satellite-popup-container" style="
          min-width: 200px;
          color: #ffffff;
          padding: 4px 2px;
          font-family: inherit;
        ">
          <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 4px;">
            <strong style="font-size: 1.1rem; color: #ffffff;">${city.name}</strong>
            <span style="font-size: 0.95rem; color: #fbbf24;">${city.kanji || ''}</span>
            <span style="font-size: 0.72rem; color: #94a3b8; margin-left: auto;">${city.region}</span>
          </div>
          ${dayBadgeText ? `
            <div style="
              display: inline-block;
              font-size: 0.75rem;
              font-weight: 700;
              color: #38bdf8;
              background: rgba(56, 189, 248, 0.15);
              padding: 2px 7px;
              border-radius: 6px;
              border: 1px solid rgba(56, 189, 248, 0.3);
              margin-bottom: 6px;
            ">
              Itinerary: ${dayBadgeText}
            </div>
          ` : ''}
          <p style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.4; margin: 4px 0 8px 0;">
            ${city.tagline || ''}
          </p>
          <div style="font-size: 0.72rem; color: #94a3b8;">
            Coordinates: ${city.coordinates.lat.toFixed(2)}°N, ${city.coordinates.lng.toFixed(2)}°E
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'satellite-leaflet-popup',
        offset: [0, -25],
        closeButton: false,
      });

      marker.on('click', () => {
        handleFocusCity(city.id);
      });

      markersGroup.addLayer(marker);
    });
  }, [itineraryCities, activeCityKey, cityDaysMap, routeState.coordinates, travelMode]);

  // Handle Focus City
  const handleFocusCity = useCallback((cityKey) => {
    setActiveCityKey(cityKey);
    if (onSelectCity) onSelectCity(cityKey);

    const city = CITIES[cityKey];
    const map = mapInstanceRef.current;
    if (city?.coordinates && map) {
      map.flyTo([city.coordinates.lat, city.coordinates.lng], 10, {
        duration: 1.4,
        easeLinearity: 0.25,
      });
    }
  }, [onSelectCity]);

  // Reset View to full Japan overview
  const handleResetView = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([36.2, 138.25], 5.6, {
        duration: 1.2,
      });
    }
  }, []);

  // Zoom Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <section id="map-section" style={{ padding: '2rem 0 5rem 0' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>

        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '1.25rem',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 0, 85, 0.15)',
              border: '1px solid rgba(255, 0, 85, 0.35)',
              color: '#ff4d88',
              fontSize: '0.78rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.45rem',
            }}>
              <Satellite size={13} />
              <span>Satellite Imagery • Real Road Routing</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', marginBottom: '0.2rem' }}>
              Japan Route Map
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              True street-level routing snapped to Japan's expressways, coastal bridges, and road networks over high-resolution satellite imagery.
            </p>
          </div>

          {/* Travel Method Selector (Replaced the removed layer toggles) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            alignItems: 'flex-end',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Routing Travel Method:
            </span>
            <div style={{
              display: 'flex',
              gap: '0.35rem',
              padding: '0.3rem',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
            }}>
              {TRAVEL_MODES.map(mode => {
                const Icon = mode.icon;
                const isActive = travelMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTravelMode(mode.id)}
                    title={mode.description}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '9px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? '800' : '600',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--accent-crimson)' : 'transparent',
                      boxShadow: isActive ? '0 4px 14px rgba(230, 57, 70, 0.45)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={15} />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Jump to City Pills Strip */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1rem',
          scrollbarWidth: 'none',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            whiteSpace: 'nowrap',
          }}>
            <MapPin size={14} /> Jump to City:
          </span>
          {Object.values(CITIES).map(city => {
            const isSelected = activeCityKey === city.id;
            const inTrip = itineraryCities.includes(city.id);
            return (
              <button
                key={city.id}
                onClick={() => handleFocusCity(city.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '800' : '500',
                  whiteSpace: 'nowrap',
                  backgroundColor: isSelected
                    ? 'var(--accent-crimson)'
                    : inTrip
                    ? 'rgba(0, 240, 255, 0.15)'
                    : 'var(--bg-surface-elevated)',
                  color: isSelected
                    ? '#ffffff'
                    : inTrip
                    ? '#38bdf8'
                    : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: isSelected
                    ? 'var(--accent-crimson)'
                    : inTrip
                    ? 'rgba(0, 240, 255, 0.4)'
                    : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{city.name}</span>
                <span className="kanji-text" style={{ fontSize: '0.72rem', opacity: 0.8 }}>{city.kanji}</span>
                {inTrip && !isSelected && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#00f0ff',
                    boxShadow: '0 0 6px #00f0ff',
                    display: 'inline-block',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* LEAFLET MAP VIEWPORT CONTAINER (SATELLITE BASE LAYER LOCKED)   */}
        {/* ============================================================== */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '640px',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65), 0 0 30px rgba(0, 240, 255, 0.15)',
          background: '#050b18',
        }}>
          {/* Leaflet DOM container */}
          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%' }}
          />

          {/* Floating Map Controls (Zoom In/Out + Reset Japan Overview) */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <button
              onClick={handleResetView}
              title="Reset View (Japan Overview)"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(5, 10, 25, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(0, 240, 255, 0.4)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                transition: 'all 0.2s ease',
              }}
            >
              <LocateFixed size={19} />
            </button>

            <button
              onClick={handleZoomIn}
              title="Zoom In"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(5, 10, 25, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                transition: 'all 0.2s ease',
              }}
            >
              +
            </button>

            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(5, 10, 25, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                transition: 'all 0.2s ease',
              }}
            >
              &minus;
            </button>
          </div>

          {/* Top-Left Live Route Telemetry & Road Snapping HUD */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            maxWidth: 'calc(100% - 100px)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(5, 10, 25, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(0, 240, 255, 0.4)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 240, 255, 0.2)',
            }}>
              {routeState.loading ? (
                <RefreshCw size={17} className="spin-animation" style={{ color: '#00f0ff' }} />
              ) : (
                <currentModeConfig.icon size={17} style={{ color: currentModeConfig.colorHex }} />
              )}

              <div style={{ fontSize: '0.82rem', color: '#ffffff', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', color: currentModeConfig.colorHex }}>
                  {currentModeConfig.badgeText}
                </span>

                {routeState.loading ? (
                  <span style={{ color: '#94a3b8' }}>• Calculating street-level geometry...</span>
                ) : (
                  <>
                    {routeState.distanceKm ? (
                      <span style={{ color: '#e2e8f0' }}>
                        • <strong>{routeState.distanceKm} km</strong> real-world route
                      </span>
                    ) : null}

                    {routeState.durationText ? (
                      <span style={{ color: '#38bdf8' }}>
                        ({routeState.durationText})
                      </span>
                    ) : null}

                    {routeState.waypointsCount > 10 ? (
                      <span style={{
                        fontSize: '0.72rem',
                        backgroundColor: 'rgba(0, 240, 255, 0.15)',
                        color: '#00f0ff',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                      }}>
                        {routeState.waypointsCount.toLocaleString()} GPS vertices
                      </span>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            {/* Sub-pill: Itinerary Hubs & Days info */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(5, 10, 25, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.75rem',
              color: '#cbd5e1',
              width: 'fit-content',
            }}>
              <CheckCircle2 size={13} style={{ color: '#10b981' }} />
              <span>
                <strong>{itineraryCities.length} Cities</strong> Connected in Sequence
                {itinerary?.summary?.durationDays ? ` • ${itinerary.summary.durationDays} Days Total` : ''}
              </span>
            </div>
          </div>

          {/* Bottom-Left Satellite View Watermark / Info Badge */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(5, 10, 25, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(0, 240, 255, 0.4)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            fontSize: '0.76rem',
            color: '#ffffff',
            fontWeight: '700',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00f0ff',
              boxShadow: '0 0 10px #00f0ff',
              display: 'inline-block',
            }} />
            <span>High-Res Satellite View (Esri Hybrid)</span>
          </div>
        </div>

        {/* Selected City Detail Card */}
        {activeCity && (
          <div className="glass-card" style={{
            marginTop: '1.75rem',
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.75rem',
            alignItems: 'center',
          }}>
            {/* Left: City Image Banner */}
            <div style={{
              height: '210px',
              borderRadius: '16px',
              backgroundImage: `url(${activeCity.heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10, 13, 20, 0.95) 0%, rgba(10, 13, 20, 0.25) 100%)',
              }} />

              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '18px',
                right: '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      {activeCity.name}
                    </h3>
                    <span className="kanji-text" style={{ fontSize: '1.3rem', color: 'var(--accent-gold)' }}>
                      {activeCity.kanji}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {activeCity.region} Region • {activeCity.coordinates.lat.toFixed(2)}°N, {activeCity.coordinates.lng.toFixed(2)}°E
                  </div>
                </div>

                {cityDaysMap[activeCity.id] && (
                  <span className="badge badge-crimson" style={{ fontSize: '0.78rem', fontWeight: '800' }}>
                    Days: {cityDaysMap[activeCity.id].join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Highlights & City Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  City Focus & Vibe
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {activeCity.tagline}
                </p>
              </div>

              {/* Highlights preview */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Top Highlights in Itinerary:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {activeCity.highlights?.slice(0, 4).map((h, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.3rem 0.7rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {h.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ paddingTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('itinerary-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Calendar size={14} />
                  <span>View in Day-by-Day Itinerary</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .leaflet-custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        .custom-leaflet-marker:hover > div:nth-child(2) {
          transform: scale(1.1);
        }
        /* Custom Leaflet popup for Satellite View */
        .satellite-leaflet-popup .leaflet-popup-content-wrapper {
          background: rgba(5, 10, 25, 0.95) !important;
          color: #ffffff !important;
          border: 1.5px solid rgba(0, 240, 255, 0.5) !important;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.85), 0 0 20px rgba(0, 240, 255, 0.25) !important;
          border-radius: 14px !important;
          backdrop-filter: blur(14px) !important;
        }
        .satellite-leaflet-popup .leaflet-popup-tip {
          background: rgba(5, 10, 25, 0.95) !important;
          border: 1px solid rgba(0, 240, 255, 0.5) !important;
        }
        /* Custom Leaflet attribution styling against Satellite Imagery */
        .leaflet-control-attribution {
          background: rgba(5, 10, 25, 0.85) !important;
          color: #94a3b8 !important;
          font-size: 10px !important;
          backdrop-filter: blur(4px) !important;
          border-radius: 6px 0 0 0 !important;
        }
        .leaflet-control-attribution a {
          color: #00f0ff !important;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spinSlow 1.5s linear infinite;
        }
      `}</style>
    </section>
  );
}
