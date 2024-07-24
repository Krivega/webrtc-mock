import type { MediaStreamUnionTrack } from '../types';
import resolveParseArray from './resolveParseArray';

const parseTracks = resolveParseArray<MediaStreamUnionTrack>('id');

export default parseTracks;
