#!/usr/bin/env node
// One version, the server's: `server.json` in the Layerz code repo is the
// source, published to the official MCP registry as io.github.layerzlabs/layerz.
// Every directory manifest here mirrors that number. This script fails when
// the manifests disagree with each other or run behind the registry; it only
// warns when they are ahead (a publish is pending).
import { readFileSync } from 'node:fs';

const NAME = 'io.github.layerzlabs/layerz';
const MANIFESTS = ['lhm.plugin.json', '.cursor-plugin/plugin.json'];

const local = MANIFESTS.map((file) => [file, JSON.parse(readFileSync(file, 'utf8')).version]);
for (const [file, version] of local) console.log(`${file}: ${version}`);

const versions = new Set(local.map(([, v]) => v));
if (versions.size !== 1) {
  console.error('✗ the manifests disagree; set them all to the server version');
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
  console.warn(`! registry unreachable (${error.message}); checked the manifests only`);
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
