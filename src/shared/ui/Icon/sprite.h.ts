export interface SpritesMap {
  gasStations:
    | 'TA'
    | 'Petro'
    | 'Loves'
    | 'TA Express'
    | 'Compass Travel Center'
    | 'Sapp Bros'
    | 'Pilot'
    | 'Flying J'
    | 'Mr. Fuel'
    | 'Road Rangers'
    | 'Palmetto'
  common: 'logo' | 'fuel' | 'marker' | 'weight' | 'dollar'
}

export const SPRITES_META: {
  gasStations: Array<
    | 'TA'
    | 'Petro'
    | 'Loves'
    | 'TA Express'
    | 'Compass Travel Center'
    | 'Sapp Bros'
    | 'Pilot'
    | 'Flying J'
    | 'Mr. Fuel'
    | 'Road Rangers'
    | 'Palmetto'
  >
  common: Array<'logo' | 'fuel' | 'marker' | 'weight' | 'dollar'>
} = {
  gasStations: [
    'TA',
    'Petro',
    'Loves',
    'TA Express',
    'Compass Travel Center',
    'Sapp Bros',
    'Pilot',
    'Flying J',
    'Mr. Fuel',
    'Road Rangers',
    'Palmetto',
  ],
  common: ['logo', 'fuel', 'marker', 'weight', 'dollar'],
}
