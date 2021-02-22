import {types} from "../index";
import fs from 'fs';

fs.writeFileSync('./src/json/types.json', JSON.stringify(types, null, 4));