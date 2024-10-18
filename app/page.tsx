'use client'

import React, { FunctionComponent, useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react'
import { GoogleMapsProvider } from '@ubilabs/google-maps-react-hooks'

import { Gather } from '~/types/gather'
import MapCanvas from '~/components/MapCanvas'
import PlaceFinder from '~/components/PlaceFinder'
import { GatherGallery } from '~/components/GatherGallery'
import { Toolbar } from '~/components/Toolbar'
import { Markers } from '~/components/Markers'
import { DashboardContext } from '~/context/DashboardContext'
import { useClient } from '~/apiClient'
import { Header } from '~/components/Header'

const mapOptions = {
  center: { lat: 53.5582447, lng: 9.647645 },
  zoom: 6,
  disableDefaultUI: true,
  zoomControl: false,
}

const EventsMap: FunctionComponent<{}> = () => {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null)
  const mapRef = useCallback((node: React.SetStateAction<HTMLDivElement | null>) => {
    node && setMapContainer(node)
  }, [])
  const [gatherList, setGatherList] = useState<Gather[]>([])
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
  const [selectedGather, setSelectedGather] = useState<Gather | null>(null)
  const [placeModalOpen, setStatePlaceModalOpen] = useState<boolean>(false)
  const [availableGathers, setAvailableGathers] = useState<Gather[]>([])
  const { getGathers } = useClient()

  const setPlaceModalOpen = (open: boolean) => {
    setStatePlaceModalOpen(open)
    if (!open) {
      setAvailableGathers([])
      setSelectedGather(null)
    }
  }

  useEffect(() => {
    const fetchGathers = async () => {
      const gathers = await getGathers()
      gathers && setGatherList(gathers)
    }
    fetchGathers()
  }, [getGathers])

  return (
    <GoogleMapsProvider
      googleMapsAPIKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      mapContainer={mapContainer}
      mapOptions={mapOptions}
      // Add the places library
      libraries={['places']}
    >
      <DashboardContext.Provider
        value={{
          gatherList,
          setGatherList,
          selectedPlace,
          setSelectedPlace,
          selectedGather,
          setSelectedGather,
          placeModalOpen,
          setPlaceModalOpen,
          availableGathers,
          setAvailableGathers,
        }}
      >
        <div id="container" className="relative">
          <MapCanvas ref={mapRef} />
          <Markers />
          <PlaceFinder />
          <GatherGallery gatherList={gatherList} />
          <Toolbar />
        </div>
      </DashboardContext.Provider>
    </GoogleMapsProvider>
  )
}

export default EventsMap
