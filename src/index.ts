import { Address } from './address';
import { Animal } from './animal';
import { Commerce } from './commerce';
import { Company } from './company';
import { Database } from './database';
import { Datatype } from './datatype';
import { _Date } from './date';
import type {
  AddressDefinitions,
  AnimalDefinitions,
  CompanyDefinition,
  Definitions,
  DefinitionTypes,
  NameDefinitions,
} from './definitions';
import { definitions } from './definitions';
import { Fake } from './fake';
import { Finance } from './finance';
import { Git } from './git';
import { Hacker } from './hacker';
import { Helpers } from './helpers';
import { Image } from './image';
import { Internet } from './internet';
import type { KnownLocale } from './locales';
import allLocales from './locales';
import { Lorem } from './lorem';
import { Mersenne } from './mersenne';
import { Music } from './music';
import { Name } from './name';
import { Phone } from './phone';
import { Random } from './random';
import { System } from './system';
import { Time } from './time';
import { Unique } from './unique';
import { Vehicle } from './vehicle';
import { Word } from './word';

// https://github.com/microsoft/TypeScript/issues/29729#issuecomment-471566609
type LiteralUnion<T extends U, U = string> = T | (U & { zz_IGNORE_ME?: never });

export interface LocaleDefinition {
  title: string;
  separator?: string;

  address?: Partial<AddressDefinitions>;
  animal?: Partial<AnimalDefinitions>;
  app?: Partial<{
    author: any[];
    name: any[];
    version: any[];
  }>;
  business?: Partial<{
    credit_card_expiry_dates: any[];
    credit_card_numbers: any[];
    credit_card_types: any[];
  }>;
  cell_phone?: Partial<{
    formats: any[];
  }>;
  commerce?: Partial<{
    color: any[];
    department: any[];
    product_description: any[];
    product_name: any[];
  }>;
  company?: Partial<CompanyDefinition>;
  database?: Partial<{
    collation: any[];
    column: any[];
    engine: any[];
    type: any[];
  }>;
  date?: Partial<{
    month: any[];
    weekday: any[];
  }>;
  finance?: Partial<{
    account_type: any[];
    credit_card: any[];
    currency: any[];
    transaction_type: any[];
  }>;
  hacker?: Partial<{
    abbreviation: any[];
    adjective: any[];
    ingverb: any[];
    noun: any[];
    phrase: any[];
    verb: any[];
  }>;
  internet?: Partial<{
    avatar_uri: any[];
    domain_suffix: any[];
    example_email: any[];
    free_email: any[];
  }>;
  lorem?: Partial<{
    supplemental: any[];
    words: any[];
  }>;
  music?: Partial<{
    genre: any[];
  }>;
  name?: Partial<NameDefinitions>;
  phone_number?: Partial<{
    formats: any[];
  }>;
  system?: Partial<{
    directoryPaths: any[];
    mimeTypes: any[];
  }>;
  team?: Partial<{
    creature: any[];
    name: any[];
  }>;
  vehicle?: Partial<{
    bicycle: any[];
    fuel: any[];
    manufacturer: any[];
    model: any[];
    type: any[];
  }>;
  word?: Partial<{
    adjective: any[];
    adverb: any[];
    conjunction: any[];
    interjection: any[];
    noun: any[];
    preposition: any[];
    verb: any[];
  }>;
  [group: string]: any;
}

export type UsableLocale = LiteralUnion<KnownLocale>;
export type UsedLocales = Partial<Record<UsableLocale, LocaleDefinition>>;

export type { Definitions };

export interface FakerOptions {
  locales?: UsedLocales;
  locale?: UsableLocale;
  localeFallback?: UsableLocale;
}

export class Faker {
  locales: UsedLocales;
  locale: UsableLocale;
  localeFallback: UsableLocale;

  // @ts-expect-error: will be lazy filled by constructor
  readonly definitions: Definitions = {};
  // This will eventually be replaced by just the imported definitions
  private readonly definitionTypes: DefinitionTypes = definitions;

  seedValue?: any[] | any;

  readonly fake: Fake['fake'] = new Fake(this).fake;
  readonly unique: Unique['unique'] = new Unique().unique;

  readonly mersenne: Mersenne = new Mersenne();
  random: Random = new Random(this);

  readonly helpers: Helpers = new Helpers(this);

  datatype: Datatype = new Datatype(this);

  readonly address: Address = new Address(this);
  readonly animal: Animal = new Animal(this);
  readonly commerce: Commerce = new Commerce(this);
  readonly company: Company = new Company(this);
  readonly database: Database = new Database(this);
  readonly date: _Date = new _Date(this);
  readonly finance = new Finance(this);
  readonly git: Git = new Git(this);
  readonly hacker: Hacker = new Hacker(this);
  // TODO @Shinigami92 2022-01-12: iban was not used
  // readonly iban = new (require('./iban'))(this);
  readonly image: Image = new Image(this);
  readonly internet: Internet = new Internet(this);
  readonly lorem: Lorem = new Lorem(this);
  readonly music: Music = new Music(this);
  readonly name: Name = new Name(this);
  readonly phone: Phone = new Phone(this);
  readonly system: System = new System(this);
  readonly time: Time = new Time();
  readonly vehicle: Vehicle = new Vehicle(this);
  readonly word: Word = new Word(this);

  constructor(opts: FakerOptions = {}) {
    this.locales = this.locales || opts.locales || {};
    this.locale = this.locale || opts.locale || 'en';
    this.localeFallback = this.localeFallback || opts.localeFallback || 'en';

    this.loadDefinitions(this.definitionTypes);
  }

  /**
   * Load the definitions contained in the locales file for the given types
   *
   * @param types
   */
  private loadDefinitions(types: DefinitionTypes): void {
    // TODO @Shinigami92 2022-01-11: Find a way to load this even more dynamically
    // In a way so that we don't accidentally miss a definition
    Object.keys(types).forEach((t: keyof DefinitionTypes) => {
      if (typeof this.definitions[t] === 'undefined') {
        this.definitions[t] = {};
      }

      if (typeof types[t] === 'string') {
        this.definitions[t] = types[t];
        return;
      }

      // TODO @Shinigami92 2022-01-11: We may have a bug here for the keys 'title' and 'separator'
      // @ts-expect-error
      types[t].forEach((p) => {
        Object.defineProperty(this.definitions[t], p, {
          get: () => {
            if (
              typeof this.locales[this.locale][t] === 'undefined' ||
              typeof this.locales[this.locale][t][p] === 'undefined'
            ) {
              // certain localization sets contain less data then others.
              // in the case of a missing definition, use the default localeFallback
              // to substitute the missing set data
              // throw new Error('unknown property ' + d + p)
              return this.locales[this.localeFallback][t][p];
            } else {
              // return localized data
              return this.locales[this.locale][t][p];
            }
          },
        });
      });
    });
  }

  seed(value?: any[] | any): void {
    this.seedValue = value;
    this.random = new Random(this, this.seedValue);
    this.datatype = new Datatype(this, this.seedValue);
  }

  /**
   * Set Faker's locale
   *
   * @param locale
   */
  setLocale(locale: UsableLocale): void {
    this.locale = locale;
  }
}

// since we are requiring the top level of faker, load all locales by default
export const faker: Faker = new Faker({
  locales: allLocales,
});

export default faker;
