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
  common: 'logo' | 'arrows'
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
  common: Array<'logo' | 'arrows'>
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
  common: ['logo', 'arrows'],
}
