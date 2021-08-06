import {crustTypes, maxwellTypes} from '../index';
import fs from 'fs';

fs.writeFileSync(
  './src/json/mainnetTypes.json',
  JSON.stringify(crustTypes, null, 4)
);
fs.writeFileSync(
  './src/json/maxwellTypes.json',
  JSON.stringify(maxwellTypes, null, 4)
);
