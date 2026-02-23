import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const CONFIG_FILENAME = "killSwitch.json";

const DEFAULT_CONFIG = {
  registrationClosedAll: {
    events: false,
    workshops: false,
    papers: false,
  },
  registrationClosedIds: {
    events: [],
    workshops: [],
    papers: [],
  },
  paymentActionsDisabled: false,
  whatsappDisabledAll: false,
  whatsappDisabledIds: [],
};

function getConfigPath() {
  return path.join(process.cwd(), "data", CONFIG_FILENAME);
}

export async function readKillSwitchConfig() {
  try {
    const filePath = getConfigPath();
    const data = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export async function writeKillSwitchConfig(config) {
  const filePath = getConfigPath();
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
  const sanitized = {
    registrationClosedAll: config.registrationClosedAll ?? DEFAULT_CONFIG.registrationClosedAll,
    registrationClosedIds: config.registrationClosedIds ?? DEFAULT_CONFIG.registrationClosedIds,
    paymentActionsDisabled: Boolean(config.paymentActionsDisabled),
    whatsappDisabledAll: Boolean(config.whatsappDisabledAll),
    whatsappDisabledIds: Array.isArray(config.whatsappDisabledIds) ? config.whatsappDisabledIds : [],
  };
  await writeFile(filePath, JSON.stringify(sanitized, null, 2), "utf-8");
  return sanitized;
}

export { DEFAULT_CONFIG };
