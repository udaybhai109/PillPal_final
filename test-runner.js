#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * PillPal Test Runner - Quick validation script
 * This script runs all tests and provides a summary
 */

const { execSync } = require('child_process');

const tests = [
  {
    name: 'Type Check',
    cmd: 'npm run type-check',
    critical: true
  },
  {
    name: 'Lint',
    cmd: 'npm run lint',
    critical: false
  },
  {
    name: 'Unit Tests',
    cmd: 'npm run test -- --run',
    critical: true
  },
  {
    name: 'Build',
    cmd: 'npm run build',
    critical: true
  }
];

console.log('\n🧪 PillPal Test Suite\n');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    console.log(`\n▶ ${test.name}...`);
    execSync(test.cmd, { stdio: 'inherit' });
    console.log(`✅ ${test.name} passed`);
    passed++;
  } catch (error) {
    console.error(`❌ ${test.name} failed`);
    if (test.critical) {
      console.error(`⚠️  This is a critical test. Build cannot continue.`);
      failed++;
    } else {
      console.warn(`⚠️  Warning: Non-critical test failed`);
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('❌ Some tests failed. Please fix before deployment.');
  process.exit(1);
} else {
  console.log('✅ All tests passed! Ready for deployment.');
  process.exit(0);
}
