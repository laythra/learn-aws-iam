/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_GLOB = '**/*.{js,jsx,ts,tsx}';
const SHARED_LAYERS = ['lib', 'hooks', 'config', 'types'];

const readSubdirs = (relativePath, filter = () => true) =>
  readdirSync(path.join(__dirname, relativePath), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && filter(entry))
    .map(entry => entry.name.toLowerCase());

const featureDirs = readSubdirs('src/features');
const levelDirs = readSubdirs('src/levels', entry => /^level\d+$/.test(entry.name));

// Both @/ alias and relative variants so neither form bypasses the rule
const aliasAndRelative = layer => [
  `@/${layer}`,
  `@/${layer}/*`,
  `../**/` + layer,
  `../**/` + layer + `/**`,
];

// Covers alias, direct sibling (../foo), one-level-deep sibling (../../foo),
// and deep relative paths that include the parent dir name
const siblingPatterns = (parentLayer, siblingName) => [
  `@/${parentLayer}/${siblingName}`,
  `@/${parentLayer}/${siblingName}/*`,
  `../${siblingName}`,
  `../${siblingName}/*`,
  `../../${siblingName}`,
  `../../${siblingName}/*`,
  `../**/` + `${parentLayer}/${siblingName}`,
  `../**/` + `${parentLayer}/${siblingName}/**`,
];

const restrictImports = (srcPath, patterns) => ({
  files: [`${srcPath}/${SOURCE_GLOB}`],
  rules: {
    'no-restricted-imports': ['error', { patterns }],
  },
});

// Zones for import/no-restricted-paths (filesystem-level, resolver-based)
const crossLayerRestrictedZones = [
  // domain/ cannot reach into features, levels, app_shell, or runtime
  { target: './src/domain', from: './src/features', message: 'domain cannot import from features' },
  { target: './src/domain', from: './src/levels', message: 'domain cannot import from levels' },
  {
    target: './src/domain',
    from: './src/app_shell',
    message: 'domain cannot import from app_shell',
  },
  { target: './src/domain', from: './src/runtime', message: 'domain cannot import from runtime' },

  // runtime/ cannot reach into features or app_shell
  {
    target: './src/runtime',
    from: './src/features',
    message: 'runtime cannot import from features',
  },
  {
    target: './src/runtime',
    from: './src/app_shell',
    message: 'runtime cannot import from app_shell',
  },

  // levels/ cannot reach into runtime
  {
    target: './src/levels',
    from: './src/runtime',
    message: 'levels cannot import from runtime — emit a LevelEventBus event instead',
  },

  // features/ and levels/ are siblings — cannot reach into each other or app_shell
  { target: './src/features', from: './src/levels', message: 'features cannot import from levels' },
  {
    target: './src/features',
    from: './src/app_shell',
    message: 'features cannot import from app_shell',
  },
  { target: './src/levels', from: './src/features', message: 'levels cannot import from features' },
  {
    target: './src/levels',
    from: './src/app_shell',
    message: 'levels cannot import from app_shell',
  },

  // app_shell/ cannot reach into levels
  {
    target: './src/app_shell',
    from: './src/levels',
    message: 'app_shell cannot import from levels',
  },

  // shared layers cannot import from any upper layer
  ...SHARED_LAYERS.flatMap(shared =>
    ['domain', 'runtime', 'features', 'levels', 'app_shell'].map(upper => ({
      target: `./src/${shared}`,
      from: `./src/${upper}`,
      message: `${shared} cannot import from ${upper}`,
    }))
  ),
];

export const restrictedImportZones = [
  ...crossLayerRestrictedZones,
  ...featureDirs.map(feature => ({
    target: `./src/features/${feature}`,
    from: './src/features',
    except: [`./${feature}`],
  })),
  ...levelDirs.map(level => ({
    target: `./src/levels/${level}`,
    from: './src/levels',
    except: [`./${level}`, './types', './utils'],
  })),
];

// no-restricted-imports overrides — catches both @/ alias and relative paths
export const featureRestrictedImportConfigs = featureDirs.map(feature =>
  restrictImports(`src/features/${feature}`, [
    // cross-feature isolation
    ...featureDirs
      .filter(other => other !== feature)
      .flatMap(other => siblingPatterns('features', other)),
    // cross-layer
    ...['levels', 'app_shell'].flatMap(aliasAndRelative),
  ])
);

export const levelRestrictedImportConfigs = levelDirs.map(level =>
  restrictImports(`src/levels/${level}`, [
    // cross-level isolation
    ...levelDirs
      .filter(other => other !== level)
      .flatMap(other => siblingPatterns('levels', other)),
    // cross-layer
    ...['features', 'runtime', 'app_shell'].flatMap(aliasAndRelative),
  ])
);

export const crossLayerAliasConfigs = [
  // domain/ cannot import from features, levels, app_shell, runtime
  restrictImports('src/domain', [
    ...['features', 'levels', 'app_shell', 'runtime'].flatMap(aliasAndRelative),
  ]),

  // runtime/ cannot import from features, app_shell
  restrictImports('src/runtime', [...['features', 'app_shell'].flatMap(aliasAndRelative)]),

  // app_shell/ cannot import from levels
  restrictImports('src/app_shell', aliasAndRelative('levels')),

  // shared layers cannot import from upper layers
  ...SHARED_LAYERS.map(shared =>
    restrictImports(`src/${shared}`, [
      ...['domain', 'runtime', 'features', 'levels', 'app_shell'].flatMap(aliasAndRelative),
    ])
  ),
];
