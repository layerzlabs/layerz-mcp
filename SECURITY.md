# Security

## Scope

This repository holds the public packaging of the Layerz MCP server: setup instructions, directory manifests and the plugin skills. It contains no server code and no credentials. The server itself (`https://layerz.cc/mcp`) is proprietary and hosted by Layerz.

## What the plugin does

Installing the plugin adds one MCP server connection to your agent, to `https://layerz.cc/mcp` over streamable HTTP, authenticated with OAuth 2.1 (PKCE, dynamic client registration) or a Layerz API key you create in the app. The connection sends a static header, `X-Layerz-Client: plugin/<version>`, so Layerz can tell a plugin session from a bare connection in its request log. Nothing else is sent, fetched or executed: the skills are plain Markdown the agent reads, with no script, no download and no credential.

What the agent reads from Layerz is either descriptive (what a tool does) or text written by you or your team in the app (your workspace Context and each model's FINANCE.md), returned as data in tool results. The server sends no behavioural instruction; the procedures live here, in `skills/`, where you can read them.

## Reporting a vulnerability

Email **contact@layerz.cc**. Please include the steps to reproduce, the account or model concerned when relevant, and whether the issue involves the web app, the API, the MCP server or this packaging. You will get an acknowledgement within two working days and a fix or a mitigation plan within thirty days for a confirmed issue. Please do not open a public issue for a security report.

## Supported versions

The hosted server is the only version in service; this repository always describes the current one (the `version check` workflow checks the manifests against the official MCP registry).
