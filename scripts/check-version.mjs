#!/usr/bin/env node
// One version, the server's: `server.json` in the Layerz code repo is the
// source, published to the official MCP registry as io.github.layerzlabs/layerz.
// Every manifest here mirrors that number, so do the skills (their
// `metadata.layerz_version`) and the `X-Layerz-Client` header of the MCP
// entries. This script fails when they disagree with each other, when the
// three MCP entries point at different URLs, or when the manifests run behind
// the registry; it only warns when they are ahead (a publish is pending).
import { readFileSync, readdirSync } from 'node:fs';

const NAME = 'io.github.layerzlabs/layerz';
const MANIFESTS = ['plugin.json', '.claude-plugin/plugin.json', '.cursor-plugin/plugin.json', 'lhm.plugin.json'];
const MCP_FILES = ['mcp.json', '.mcp.json', '.cursor-plugin/mcp.json'];
const URL = 'https://layerz.cc/mcp';

const json = (file) => JSON.parse(readFileSync(file, 'utf8'));
const found = new Map();
for (const file of MANIFESTS) found.set(file, json(file).version);
for (const file of MCP_FILES) {
  const server = json(file).mcpServers?.layerz;
  if (server?.url !== URL) {
    console.error(`✗ ${file}: the layerz entry must point at ${URL}`);
    process.exit(1);
  }
  const via = server.headers?.['X-Layerz-Client'] ?? '';
  found.set(file, via.replace(/^plugin\//, '') || '(no X-Layerz-Client header)');
}
for (const dir of readdirSync('skills', { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const md = readFileSync(`skills/${dir.name}/SKILL.md`, 'utf8');
  const m = /^\s*layerz_version: "([^"]+)"/m.exec(md);
  found.set(`skills/${dir.name}`, m?.[1] ?? '(no layerz_version)');
}
for (const [file, version] of found) console.log(`${file}: ${version}`);

const versions = new Set(found.values());
if (versions.size !== 1) {
  console.error('✗ the manifests, MCP entries and skills disagree; set them all to the server version');
  process.exit(1);
}
const [mirrored] = versions;

let registry;
try {
  const res = await fetch(
    `https://registry.modelcontextprotocol.io/v0/servers?search=${encodeURIComponent(NAME)}`,
  );
  const { servers = [] } = await res.json();
  registry = servers.find((s) => s._meta?.['io.modelcontextprotocol.registry/official']?.isLatest)
    ?.server?.version;
} catch (error) {
  console.warn(`! registry unreachable (${error.message}); checked the local files only`);
  process.exit(0);
}
console.log(`registry (${NAME}, latest): ${registry ?? 'not found'}`);

const num = (v) => v.split('.').map(Number);
const cmp = (a, b) => num(a).reduce((r, x, i) => r || x - num(b)[i], 0);
if (!registry) process.exit(0);
if (cmp(mirrored, registry) < 0) {
  console.error('✗ the manifests run behind the registry; mirror the published version');
  process.exit(1);
}
if (cmp(mirrored, registry) > 0)
  console.warn('! the manifests are ahead of the registry: a `mcp-publisher publish` is pending');
else console.log('✓ aligned');
