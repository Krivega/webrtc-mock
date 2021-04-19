import type mediaStreamTrackMock from '../mediaStreamTrackMock';
import resolveParseArray from './resolveParseArray';

const parseTracks = resolveParseArray<mediaStreamTrackMock>('id');

export default parseTracks;
