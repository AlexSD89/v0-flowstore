import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

// 读取 manifest.json
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { major, minor, patch } = manifest.version.split(".").map(Number);

// 增加补丁版本号
const newVersion = `${major}.${minor}.${patch + 1}`;

// 更新 manifest.json
manifest.version = newVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// 更新 versions.json
const versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[newVersion] = `版本 ${newVersion}`;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));

console.log(`版本已更新至 ${newVersion}`);