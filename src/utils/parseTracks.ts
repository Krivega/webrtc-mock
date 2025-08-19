import resolveParseArray from './resolveParseArray';

import type { MediaStreamUnionTrack } from '../types';

const parseTracks = resolveParseArray<MediaStreamUnionTrack>('id');

export default parseTracks;
