const assert = require("node:assert/strict");
const { test } = require("node:test");

global.window = {};
require("../js/organic-flow-engine.js");
const OrganicFlow = global.window.OrganicFlow;

test("Showcase Random uses five equal default weights", () => {
  assert.deepEqual(OrganicFlow.SHOWCASE_DEFAULT_WEIGHTS, {
    contour: 20,
    ribbons: 20,
    currents: 20,
    atmosphere: 20,
    "hybrid-random": 20
  });
});

test("Showcase selection excludes the previous choice while retaining positive weights", () => {
  const weights = { contour: 25, ribbons: 25, currents: 25, atmosphere: 25, "hybrid-random": 0 };
  for (const sample of [0, 0.25, 0.5, 0.75, 0.999]) {
    assert.notEqual(OrganicFlow.chooseShowcaseVariant(weights, sample, "contour"), "contour");
    assert.notEqual(OrganicFlow.chooseShowcaseVariant(weights, sample, "ribbons"), "ribbons");
  }
});

test("Showcase selection falls back to the only active weight and handles all-zero weights", () => {
  assert.equal(
    OrganicFlow.chooseShowcaseVariant({ contour: 0, ribbons: 0, currents: 0, atmosphere: 0, "hybrid-random": 100 }, 0.9, "hybrid-random"),
    "hybrid-random"
  );
  assert.ok(OrganicFlow.SHOWCASE_KEYS.includes(
    OrganicFlow.chooseShowcaseVariant({ contour: 0, ribbons: 0, currents: 0, atmosphere: 0, "hybrid-random": 0 }, 0.5, null)
  ));
});

test("Hybrid Random contributions remain bounded and sum to 100", () => {
  for (let seed = 1; seed <= 500; seed += 1) {
    const contributions = OrganicFlow.randomizeHybridContributions(OrganicFlow.createSeededRandom(seed));
    assert.equal(Object.values(contributions).reduce((sum, value) => sum + value, 0), 100);
    for (const value of Object.values(contributions)) assert.ok(value >= 12 && value <= 38);
  }
});

test("schema v3 keeps user Showcase weights, Hybrid base and settings without randomizing the mode", () => {
  const imported = OrganicFlow.normalizeConfig({
    schemaVersion: 3,
    mode: "manual",
    selectedVariant: "ribbons",
    commonSettings: { speed: 0.31, lineCount: 18 },
    variantSettings: { ribbons: { speed: 0.27, lineCount: 16 } },
    showcaseRandom: { weights: { contour: 10, ribbons: 20, currents: 30, atmosphere: 15, "hybrid-random": 25 } },
    hybridContributions: { contour: 35, ribbons: 20, currents: 25, atmosphere: 20 },
    provenance: { kind: "user-tuned", userTunedValuesRecovered: true }
  }).config;

  assert.equal(imported.mode, "manual");
  assert.equal(imported.selectedVariant, "ribbons");
  assert.equal(imported.commonSettings.speed, 0.31);
  assert.equal(imported.variantSettings.ribbons.speed, 0.27);
  assert.deepEqual(imported.showcaseRandom.weights, { contour: 10, ribbons: 20, currents: 30, atmosphere: 15, "hybrid-random": 25 });
  assert.deepEqual(imported.hybridContributions, { contour: 35, ribbons: 20, currents: 25, atmosphere: 20 });
  assert.equal(imported.provenance.userTunedValuesRecovered, true);
});

test("schema v2 and legacy settings remain importable without claiming recovered user tuning", () => {
  const version2 = OrganicFlow.normalizeConfig({
    schemaVersion: 2,
    mode: "hybrid",
    hybridContributions: { contour: 40, ribbons: 25, currents: 15, atmosphere: 20 }
  }).config;
  assert.equal(version2.mode, "hybrid");
  assert.deepEqual(version2.showcaseRandom.weights, OrganicFlow.SHOWCASE_DEFAULT_WEIGHTS);
  assert.equal(version2.provenance.userTunedValuesRecovered, false);

  const legacy = OrganicFlow.normalizeConfig({ variant: "currents", settings: { speed: 0.2, lineCount: 12 } }).config;
  assert.equal(legacy.selectedVariant, "currents");
  assert.equal(legacy.variantSettings.currents.speed, 0.2);
  assert.equal(legacy.provenance.userTunedValuesRecovered, false);
});
