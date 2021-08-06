import {mainnet, maxwell} from '../index';
import fs from 'fs';

fs.writeFileSync(
  './src/json/mainnetTypes.json',
  JSON.stringify(mainnet, null, 4)
);
fs.writeFileSync(
  './src/json/maxwellTypes.json',
  JSON.stringify(maxwell, null, 4)
);
