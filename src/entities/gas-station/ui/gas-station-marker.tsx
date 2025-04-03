import React, { useState } from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import Image from 'next/image'
import classNames from 'classnames'
import { GasStation } from '../model/gas-station'
import { CustomPin } from './custom-pin'
import { getLogoUrl } from '../lib/getLogoUrl'

interface Props {
  gasStation: GasStation
}

export const GasStationMarker: React.FC<Props> = ({ gasStation }) => {
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <AdvancedMarker
      position={gasStation.position}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      className={classNames('gas-station-marker', { clicked, hovered })}
      zIndex={clicked ? 1000 : 1}>
      {clicked ? (
        CustomPin(setClicked, gasStation)
      ) : (
        <div className="bg-white rounded-md shadow-md p-1 border border-gray-300">
          <Image
            alt="gas-station"
            src={getLogoUrl(gasStation.name)}
            width={32}
            height={32}
            className="mx-auto"
          />
          <div>{gasStation.fuelPrice?.finalPrice}</div>
        </div>
      )}
    </AdvancedMarker>
  )
}
