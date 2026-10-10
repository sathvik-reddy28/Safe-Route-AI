// Registry of emergency datasets and the area each one covers.
// A dataset is only shown when the selected location lies inside its coverage circle.
// The only dataset is the SIMULATED Chennai extreme-rainfall demo scenario.
import {hv} from '../utils/distance';
export const DEMO_DATASET={
  id:'chennai-demo',
  label:'Chennai extreme-rainfall scenario',
  kind:'simulated',
  center:[13.0827,80.2707],
  radiusM:20000,
  updated:'2026-10-10 09:45 (invented)'
};
export const DATASETS=[DEMO_DATASET];
/** Returns the dataset covering this location, or null if none is configured. */
export function datasetFor(ll){
  if(!Array.isArray(ll)||ll.length!==2||!ll.every(Number.isFinite))return null;
  return DATASETS.find(d=>hv(ll,d.center)<=d.radiusM)||null;
}
export const distanceToDataset=(ll,d=DEMO_DATASET)=>hv(ll,d.center);
