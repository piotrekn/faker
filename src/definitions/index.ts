import type { AddressDefinitions } from './address';
import type { AnimalDefinitions } from './animal';
import type { CompanyDefinition } from './company';
import type { Definitions, DefinitionTypes } from './definitions';
import { definitions } from './definitions';
import type { NameDefinitions, NameTitleDefinitions } from './name';
import type { Format, Formats, Texts, Values } from './utils';

let a: CompanyDefinition;

export { definitions };
export type {
  Definitions,
  DefinitionTypes,
  Values,
  Texts,
  Format,
  Formats,
  AnimalDefinitions,
  AddressDefinitions,
  CompanyDefinition,
  NameDefinitions,
  NameTitleDefinitions,
};
