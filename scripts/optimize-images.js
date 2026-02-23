const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const keepOriginal = args.has("--keep-original");

const targets = [
  {
    dir: path.join("public", "profile"),
    maxWidth: 512,
    maxHeight: 512,
    quality: 82,
  },
  {
    dir: path.join("public", "img", "flagship"),
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 82,
  },
  {
    dir: path.join("public", "img", "workshops"),
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 82,
  },
];

const isImage = (name) => /\.(png|jpg|jpeg|webp)$/i.test(name);
const isTemp = (name) => /\.(lossless|q\d+)\.png$/i.test(name);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeOne(filePath, cfg) {
  const parsed = path.parse(filePath);
  const outPath = path.join(parsed.dir, `${parsed.name}.webp`);
  const tempOutPath = `${outPath}.tmp`;

  const inputSize = fs.statSync(filePath).size;

  const transformer = sharp(filePath)
    .rotate()
    .resize({
      width: cfg.maxWidth,
      height: cfg.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: cfg.quality,
      effort: 6,
      smartSubsample: true,
      alphaQuality: 100,
    });

  if (!dryRun) {
    await transformer.toFile(tempOutPath);
    if (fs.existsSync(outPath)) {
      try {
        fs.unlinkSync(outPath);
      } catch (err) {
        if (!err || err.code !== "EBUSY") throw err;
        fs.unlinkSync(tempOutPath);
        const lockedSize = fs.statSync(outPath).size;
        return {
          file: filePath,
          output: outPath,
          before: inputSize,
          after: lockedSize,
        };
      }
    }
    fs.renameSync(tempOutPath, outPath);
  }

  const outputSize = dryRun ? 0 : fs.statSync(outPath).size;

  if (!dryRun && !keepOriginal && path.extname(filePath).toLowerCase() !== ".webp") {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      if (err && err.code !== "EBUSY") throw err;
      console.warn(`Skipping delete (busy): ${filePath}`);
    }
  }

  return {
    file: filePath,
    output: outPath,
    before: inputSize,
    after: outputSize,
  };
}

async function run() {
  const results = [];

  for (const cfg of targets) {
    if (!fs.existsSync(cfg.dir)) continue;

    const files = fs
      .readdirSync(cfg.dir)
      .filter((name) => isImage(name) && !isTemp(name))
      .map((name) => path.join(cfg.dir, name));

    for (const filePath of files) {
      // eslint-disable-next-line no-await-in-loop
      const res = await optimizeOne(filePath, cfg);
      results.push(res);
    }
  }

  const beforeTotal = results.reduce((sum, r) => sum + r.before, 0);
  const afterTotal = results.reduce((sum, r) => sum + r.after, 0);
  const saved = beforeTotal - afterTotal;
  const savedPct = beforeTotal > 0 ? ((saved / beforeTotal) * 100).toFixed(2) : "0.00";

  console.log("\nImage optimization complete");
  console.log(`Files processed: ${results.length}`);
  if (!dryRun) {
    console.log(`Total before: ${formatBytes(beforeTotal)}`);
    console.log(`Total after:  ${formatBytes(afterTotal)}`);
    console.log(`Saved:        ${formatBytes(saved)} (${savedPct}%)`);
  }

  if (!dryRun) {
    const top = [...results]
      .sort((a, b) => (b.before - b.after) - (a.before - a.after))
      .slice(0, 10)
      .map((r) => ({
        file: r.output,
        before: formatBytes(r.before),
        after: formatBytes(r.after),
        saved: formatBytes(r.before - r.after),
      }));
    console.table(top);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
