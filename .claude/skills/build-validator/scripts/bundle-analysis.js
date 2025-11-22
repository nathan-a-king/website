#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');
const buildDir = path.join(projectRoot, 'build');
const baselineFile = path.join(__dirname, 'baseline.json');

// Thresholds in KB (gzipped)
const THRESHOLDS = {
  vendor: { target: 150, max: 200 },
  router: { target: 50, max: 100 },
  markdown: { target: 100, max: 150 },
  syntax: { target: 250, max: 300 },
  icons: { target: 30, max: 50 },
  total: { target: 500, max: 800 }
};

function getFileSize(filepath) {
  const content = fs.readFileSync(filepath);
  const gzipped = gzipSync(content);
  return {
    raw: content.length,
    gzipped: gzipped.length
  };
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function analyzeChunks() {
  const assetsDir = path.join(buildDir, 'assets');

  if (!fs.existsSync(assetsDir)) {
    console.error('❌ Build directory not found. Run npm run build first.');
    process.exit(1);
  }

  const files = fs.readdirSync(assetsDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));

  const chunks = {
    vendor: null,
    router: null,
    markdown: null,
    syntax: null,
    icons: null,
    other: []
  };

  let totalSize = { raw: 0, gzipped: 0 };

  // Categorize files
  for (const file of jsFiles) {
    const filepath = path.join(assetsDir, file);
    const size = getFileSize(filepath);

    totalSize.raw += size.raw;
    totalSize.gzipped += size.gzipped;

    // Match chunk names from vite.config.js manualChunks
    if (file.includes('vendor-')) {
      chunks.vendor = { file, ...size };
    } else if (file.includes('router-')) {
      chunks.router = { file, ...size };
    } else if (file.includes('markdown-')) {
      chunks.markdown = { file, ...size };
    } else if (file.includes('syntax-')) {
      chunks.syntax = { file, ...size };
    } else if (file.includes('icons-')) {
      chunks.icons = { file, ...size };
    } else {
      chunks.other.push({ file, ...size });
    }
  }

  return { chunks, totalSize };
}

function checkThresholds(chunks, totalSize) {
  let warnings = [];
  let errors = [];

  // Check individual chunks
  for (const [name, threshold] of Object.entries(THRESHOLDS)) {
    if (name === 'total') continue;

    const chunk = chunks[name];
    if (!chunk) {
      warnings.push(`⚠️  ${name} chunk not found (may not have been created)`);
      continue;
    }

    const sizeKB = chunk.gzipped / 1024;

    if (sizeKB > threshold.max) {
      errors.push(`❌ ${name}: ${formatSize(chunk.gzipped)} exceeds max (${threshold.max} KB)`);
    } else if (sizeKB > threshold.target) {
      warnings.push(`⚠️  ${name}: ${formatSize(chunk.gzipped)} exceeds target (${threshold.target} KB)`);
    }
  }

  // Check total size
  const totalKB = totalSize.gzipped / 1024;
  if (totalKB > THRESHOLDS.total.max) {
    errors.push(`❌ Total bundle: ${formatSize(totalSize.gzipped)} exceeds max (${THRESHOLDS.total.max} KB)`);
  } else if (totalKB > THRESHOLDS.total.target) {
    warnings.push(`⚠️  Total bundle: ${formatSize(totalSize.gzipped)} exceeds target (${THRESHOLDS.total.target} KB)`);
  }

  return { warnings, errors };
}

function loadBaseline() {
  if (!fs.existsSync(baselineFile)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
}

function saveBaseline(chunks, totalSize) {
  const baseline = {
    date: new Date().toISOString(),
    chunks: {},
    totalSize
  };

  for (const [name, chunk] of Object.entries(chunks)) {
    if (chunk && chunk.gzipped) {
      baseline.chunks[name] = { gzipped: chunk.gzipped };
    }
  }

  fs.writeFileSync(baselineFile, JSON.stringify(baseline, null, 2));
  console.log(`\n💾 Baseline saved to ${baselineFile}`);
}

function compareToBaseline(chunks, totalSize, baseline) {
  console.log('\n📊 Comparison to Baseline:');
  console.log(`   Baseline date: ${new Date(baseline.date).toLocaleDateString()}\n`);

  for (const [name, chunk] of Object.entries(chunks)) {
    if (name === 'other') continue;
    if (!chunk) continue;

    const baselineChunk = baseline.chunks[name];
    if (!baselineChunk) {
      console.log(`   ${name}: NEW (no baseline)`);
      continue;
    }

    const diff = chunk.gzipped - baselineChunk.gzipped;
    const diffPercent = (diff / baselineChunk.gzipped) * 100;

    let emoji = '✅';
    if (diffPercent > 10) emoji = '❌';
    else if (diffPercent > 5) emoji = '⚠️';
    else if (diffPercent < -5) emoji = '📉';

    const sign = diff > 0 ? '+' : '';
    console.log(
      `   ${emoji} ${name}: ${formatSize(chunk.gzipped)} (${sign}${formatSize(diff)}, ${sign}${diffPercent.toFixed(1)}%)`
    );
  }

  // Total comparison
  const totalDiff = totalSize.gzipped - baseline.totalSize.gzipped;
  const totalDiffPercent = (totalDiff / baseline.totalSize.gzipped) * 100;
  const sign = totalDiff > 0 ? '+' : '';

  console.log(
    `\n   Total: ${formatSize(totalSize.gzipped)} (${sign}${formatSize(totalDiff)}, ${sign}${totalDiffPercent.toFixed(1)}%)`
  );
}

function printReport(chunks, totalSize) {
  console.log('\n📦 Bundle Analysis Report\n');

  console.log('JavaScript Chunks (gzipped):');
  for (const [name, chunk] of Object.entries(chunks)) {
    if (name === 'other') continue;
    if (!chunk) continue;

    const sizeKB = chunk.gzipped / 1024;
    const threshold = THRESHOLDS[name];

    let status = '✅';
    if (threshold) {
      if (sizeKB > threshold.max) status = '❌';
      else if (sizeKB > threshold.target) status = '⚠️';
    }

    console.log(`   ${status} ${name.padEnd(12)}: ${formatSize(chunk.gzipped).padStart(10)} / ${formatSize(chunk.raw).padStart(10)} (raw)`);
  }

  // Other chunks
  if (chunks.other.length > 0) {
    console.log('\n   Other chunks:');
    for (const chunk of chunks.other) {
      console.log(`      ${chunk.file}: ${formatSize(chunk.gzipped)}`);
    }
  }

  console.log(`\n   Total JS       : ${formatSize(totalSize.gzipped).padStart(10)} / ${formatSize(totalSize.raw).padStart(10)} (raw)`);

  // CSS Analysis
  const cssDir = path.join(buildDir, 'assets/css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    let totalCSS = { raw: 0, gzipped: 0 };

    console.log('\n   CSS Files:');
    for (const file of cssFiles) {
      const size = getFileSize(path.join(cssDir, file));
      totalCSS.raw += size.raw;
      totalCSS.gzipped += size.gzipped;
      console.log(`      ${file}: ${formatSize(size.gzipped)}`);
    }
    console.log(`   Total CSS      : ${formatSize(totalCSS.gzipped).padStart(10)}`);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const shouldSaveBaseline = args.includes('--save-baseline');

  const { chunks, totalSize } = analyzeChunks();
  printReport(chunks, totalSize);

  const { warnings, errors } = checkThresholds(chunks, totalSize);

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log(`   ${w}`));
  }

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(e => console.log(`   ${e}`));
  }

  // Baseline comparison
  const baseline = loadBaseline();
  if (baseline && !shouldSaveBaseline) {
    compareToBaseline(chunks, totalSize, baseline);
  }

  // Save baseline if requested
  if (shouldSaveBaseline) {
    saveBaseline(chunks, totalSize);
  } else if (!baseline) {
    console.log('\n💡 Tip: Save a baseline with --save-baseline to track size changes over time');
  }

  if (errors.length === 0) {
    console.log('\n✅ Bundle analysis complete!\n');
  } else {
    console.log('\n❌ Bundle analysis failed with errors\n');
    process.exit(1);
  }
}

export { analyzeChunks, checkThresholds, loadBaseline };
