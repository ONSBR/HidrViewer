# Third-Party Licenses and Notices — HidrViewer

HidrViewer is a free-of-charge desktop application built with the
[Tauri](https://tauri.app) framework. It bundles a hand-written HTML/CSS/JavaScript
frontend and is packaged for Windows with an NSIS installer, running on top of the
Microsoft Edge WebView2 runtime.

This document lists the third-party software distributed with, or required by,
HidrViewer, together with the licenses under which that software is provided.

> **Scope note.** HidrViewer's own frontend code is original and contains no
> bundled third-party JavaScript libraries. The third-party surface is therefore:
> (1) the Tauri framework and its Rust crate dependency tree, (2) the Microsoft
> Edge WebView2 runtime, and (3) the NSIS installer toolkit used to package the app.

---

## 1. Licensing posture (read this first)

All of the framework components below are distributed under **permissive** licenses
(MIT, Apache-2.0, BSD, zlib/libpng, ISC, etc.). None of them forbids
non-commercial or commercial use, and none imposes a copyleft obligation on
HidrViewer's own source code. The obligations they _do_ impose are limited to
**attribution** — reproducing the copyright notice and license text — which is the
purpose of this file.

Points that deserve attention for a redistributed desktop app:

- **Microsoft Edge WebView2 Runtime** is **not** an open-source MIT component. It is
  governed by Microsoft's own license terms (see §3). If your installer bootstraps
  or bundles the runtime, review those terms — they permit redistribution but have
  their own conditions.
- **Five Rust crates in the Tauri tree are MPL-2.0** (file-level copyleft):
  `cssparser`, `cssparser-macros`, `dtoa-short`, `option-ext`, and `selectors`.
  MPL-2.0 permits as-is redistribution and only requires publishing the source of
  any _modified_ MPL files — HidrViewer ships them unmodified, so the obligation is
  satisfied. A further 19 crates use the Unicode-3.0 license and 3 use BSD-3-Clause
  (full breakdown in §4). All are permissive. HidrViewer pulls in **no** TLS or
  networking stack, so licenses such as OpenSSL or `ring`'s do not appear in the tree.
- Nothing here conflicts with distributing HidrViewer free of charge, including use
  and redistribution by companies and public institutions. HidrViewer is provided at
  no cost for free use; the terms governing HidrViewer's own code are a separate
  choice (its own license) and are independent of these dependencies.

---

## 2. Tauri framework

**License:** MIT OR Apache-2.0
**Copyright:** © Tauri Programme within The Commons Conservancy
**Project:** https://github.com/tauri-apps/tauri

Includes the family of crates published by the Tauri project, e.g. `tauri`,
`tauri-build`, `tauri-runtime`, `tauri-runtime-wry`, `tauri-utils`, `tauri-macros`,
`tauri-codegen`, and the sibling projects:

- **WRY** — cross-platform webview rendering library — MIT OR Apache-2.0 —
  https://github.com/tauri-apps/wry
- **TAO** — cross-platform windowing library (fork of `winit`) — MIT / Apache-2.0 —
  https://github.com/tauri-apps/tao

The exact license text for each is reproduced in §4 (auto-generated) or can be
found in each crate's repository.

<details>
<summary>MIT License (Tauri)</summary>

```
MIT License

Copyright (c) 2017 - Present Tauri Programme within The Commons Conservancy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

(Apache-2.0 text: https://www.apache.org/licenses/LICENSE-2.0)
</details>

---

## 3. Microsoft Edge WebView2 Runtime

**Component:** Microsoft Edge WebView2 Runtime and `WebView2Loader.dll`
**License:** Microsoft Software License Terms (proprietary, redistributable)
**Reference:** https://developer.microsoft.com/microsoft-edge/webview2/

HidrViewer renders its UI using the WebView2 runtime provided by Microsoft. This is
a proprietary Microsoft component, not open source. Distribution of the runtime and
of the `WebView2Loader` component is permitted under Microsoft's license terms;
consult the current terms at the link above and reproduce Microsoft's required
notice if you bundle the runtime (fixed-version or bootstrapper) with the installer.

---

## 4. Rust crate dependency tree (auto-generated)

The authoritative, machine-generated attribution list for every third-party Rust
crate linked into HidrViewer lives in
**[`THIRD_PARTY_RUST.md`](THIRD_PARTY_RUST.md)**. It is produced from
`src-tauri/Cargo.lock` — the only authoritative record of the exact crates and
versions bundled into the release binary — with
[`cargo-about`](https://github.com/EmbarkStudios/cargo-about), and reproduces the
full license text and per-crate attribution those licenses require. **Do not
hand-maintain it**; regenerate it (see below).

As of the last regeneration it covers **408 crates**, every one under a permissive
license:

| Crates | License      | Notes                                                                                                              |
| -----: | ------------ | ------------------------------------------------------------------------------------------------------------------ |
|    378 | MIT          |                                                                                                                    |
|     19 | Unicode-3.0  | ICU / Unicode data crates (pulled via `idna` / `url`)                                                              |
|      5 | Apache-2.0   | dual "MIT OR Apache-2.0" crates resolved to Apache (`dpi`, `dunce`, `sync_wrapper`, `tao`, `target-lexicon`)       |
|      5 | MPL-2.0      | `cssparser`, `cssparser-macros`, `dtoa-short`, `option-ext`, `selectors` — file-level copyleft, shipped unmodified |
|      3 | BSD-3-Clause | the `brotli` compression stack (`brotli`, `alloc-no-stdlib`, `alloc-stdlib`)                                       |
|      1 | Zlib         | `foldhash`                                                                                                         |

Every license above is on the accepted allow-list. No copyleft-of-the-whole-work
license (GPL / LGPL / AGPL) or otherwise incompatible license is present.

### Regenerating

The generator config (`about.toml`) and the Markdown template (`about.hbs`) are
committed under `src-tauri/`. From inside `src-tauri/`:

```bash
cargo install cargo-about          # once
cargo about generate --config about.toml about.hbs > ../THIRD_PARTY_RUST.md
```

`about.toml`'s `accepted` array is the allow-list of licenses this tree may
legitimately use. If `cargo-about` reports a license **not** in that list, review it
before shipping — that is exactly the pitfall this document exists to catch. The same
allow-list is enforced automatically by `cargo deny check licenses` (see §7).

Alternative machine-readable manifest:
[`cargo-bundle-licenses`](https://github.com/sstadick/cargo-bundle-licenses)
(`cargo bundle-licenses --format yaml --output THIRD_PARTY.yaml`).

---

## 5. NSIS installer

**Component:** Nullsoft Scriptable Install System (NSIS) 3.11
**License:** zlib/libpng license (with Common Public License for a few components)
**Project:** https://nsis.sourceforge.io

The Windows installer (`HidrViewer_1.0.0_x64-setup.exe`) is produced by Tauri's NSIS
bundler. The NSIS license is permissive and does not require attribution inside the
installed application, but NSIS is credited here for completeness. If you customize
the installer with additional NSIS plugins, check each plugin's license.

---

## 6. Application icons and assets

The HidrViewer icon set (`icon.ico`, `icon.icns`, `icon.png`, the `Square*Logo.png`
tiles, etc.) is generated by `tauri icon` from an original source image and is the
property of the HidrViewer author (© Jhulia Ferraz — see [`LICENSE`](LICENSE)). No
third-party icon library is bundled.

---

## 7. Dependency security and auditing

Third-party crate vulnerabilities are tracked against the
[RustSec Advisory Database](https://rustsec.org) with a **two-tier** setup, run
automatically by [`.github/workflows/security-audit.yml`](.github/workflows/security-audit.yml)
on dependency changes, on every PR, and weekly:

- **`cargo deny check`** — the **blocking gate**, scoped to the shipped Windows
  binary (`x86_64-pc-windows-msvc`). Enforces the advisory triage, the license
  allow-list (§4), and that every crate comes from crates.io. Configured by
  [`src-tauri/deny.toml`](src-tauri/deny.toml).
- **`cargo audit`** — a **non-blocking, full cross-platform** scan of
  `src-tauri/Cargo.lock`, for dev-platform awareness (it surfaces Linux-only
  advisories that never reach the shipped binary).

```bash
cargo install cargo-audit cargo-deny   # once
cd src-tauri
cargo deny check   # blocking gate (Windows scope)
cargo audit        # full-tree, informational
```

**Current status (2026-07-07): 0 known vulnerabilities.** Two high-severity
`quick-xml` advisories (RUSTSEC-2026-0194 / -0195, XML-parsing denial of service) and
an `anyhow` unsoundness (RUSTSEC-2026-0190) were resolved by bumping `plist`
(→ `quick-xml` 0.41) and `anyhow` (→ 1.0.103) in `Cargo.lock`. The dependency tree is
otherwise kept current with `cargo update` (latest Tauri 2.x), which is how
semver-compatible security fixes are picked up.

The full-tree `cargo audit` still reports a number of **informational**
`unmaintained` / `unsound` advisories for transitive dependencies of Tauri that have
no fixed version available:

- **13 are Linux-only** (`gtk-rs` GTK3 bindings, `glib`, `proc-macro-error`) — Tauri's
  Linux webview backend uses GTK3, for which no maintained replacement exists yet.
  They are **not compiled into the shipped Windows binary**, so the Windows-scoped
  `cargo deny` gate never sees them.
- **5 are cross-platform** (`unic-*`, via `urlpattern` in `tauri-utils`) and _are_ in
  the Windows binary; they carry **no known vulnerability** and are triaged with a
  documented reason in `src-tauri/deny.toml`, so the gate passes clean.

Both groups are upstream-only: they clear when Tauri migrates off GTK3 / drops
`urlpattern`. Re-check the triage list on each Tauri upgrade.

---

## How to keep this file current

1. Re-run the `cargo about generate` step in §4 whenever you bump the Tauri version
   or add Rust dependencies, and replace [`THIRD_PARTY_RUST.md`](THIRD_PARTY_RUST.md)
   and the §4 summary table.
2. Re-run `cargo audit` and `cargo deny check` (§7) whenever `Cargo.lock` changes;
   update the triage list in `src-tauri/deny.toml` as advisories are fixed upstream.
3. Re-check the WebView2 terms (§3) at each Tauri major upgrade.
4. Update the NSIS version in §5 if the bundler updates it.

_Last updated: 2026-07-07._
