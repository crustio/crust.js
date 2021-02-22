import {types as crustTypes} from "../index";
import versioned from '../types-known/versioned';
import fs from 'fs';

const types = {
  ...crustTypes,
  ...versioned[0].types
}

fs.writeFileSync('./src/json/types.json', JSON.stringify(types, null, 4));