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
HidrViewer's own source code. The obligations they *do* impose are limited to
**attribution** — reproducing the copyright notice and license text — which is the
purpose of this file.

Points that deserve attention for a redistributed desktop app:

- **Microsoft Edge WebView2 Runtime** is **not** an open-source MIT component. It is
  governed by Microsoft's own license terms (see §3). If your installer bootstraps
  or bundles the runtime, review those terms — they permit redistribution but have
  their own conditions.
- **A small number of Rust crates in the Tauri tree may use MPL-2.0** (file-level
  copyleft) or other non-MIT licenses (e.g. Unicode license, BSD variants, `ring`'s
  own license). MPL-2.0 is fine for as-is redistribution but requires you to make
  the source of any *modified* MPL files available. The generated crate list in §4
  will surface any such crates so you can confirm none were modified.
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

## 4. Rust crate dependency tree (auto-generated — TO BE FILLED)

> This section must be generated from the Tauri project's `Cargo.lock`, which is the
> only authoritative list of the exact crates and versions bundled into the release
> binary. **Do not hand-maintain it.**

Recommended tool: [`cargo-about`](https://github.com/EmbarkStudios/cargo-about).

From inside the Tauri project (the folder containing `src-tauri/Cargo.toml`):

```bash
# 1. Install the generator
cargo install cargo-about

# 2. Create a config that clears all licenses the project may legitimately use
cargo about init            # creates about.toml + about.hbs template

# 3. Generate a full third-party license report
cargo about generate about.hbs > THIRD_PARTY_RUST.md
#    (or emit HTML with the built-in template:)
cargo about generate --format html about.hbs > THIRD_PARTY_RUST.html
```

A minimal `about.toml` that accepts the licenses normally present in a Tauri tree:

```toml
accepted = [
    "MIT",
    "Apache-2.0",
    "Apache-2.0 WITH LLVM-exception",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "ISC",
    "Zlib",
    "MPL-2.0",
    "Unicode-DFS-2016",
    "Unicode-3.0",
    "CC0-1.0",
    "0BSD",
    "OpenSSL",
]
```

Paste the resulting crate list (or link `THIRD_PARTY_RUST.md`) here. If any crate
reports a license **not** in the list above, review it before shipping — that is
exactly the kind of pitfall this document exists to catch.

Alternative tool: [`cargo-bundle-licenses`](https://github.com/sstadick/cargo-bundle-licenses)
(`cargo bundle-licenses --format yaml --output THIRD_PARTY.yaml`) if you prefer a
machine-readable manifest.

---

## 5. NSIS installer

**Component:** Nullsoft Scriptable Install System (NSIS) 3.11
**License:** zlib/libpng license (with Common Public License for a few components)
**Project:** https://nsis.sourceforge.io

The Windows installer (`HidrViewer_0.0.1_x64-setup.exe`) is produced by Tauri's NSIS
bundler. The NSIS license is permissive and does not require attribution inside the
installed application, but NSIS is credited here for completeness. If you customize
the installer with additional NSIS plugins, check each plugin's license.

---

## 6. Application icons and assets

The HidrViewer icon set (`icon.ico`, `icon.icns`, `icon.png`, the `Square*Logo.png`
tiles, etc.) is generated by `tauri icon` from an original source image and is the
property of the HidrViewer authors / ONS. No third-party icon library is bundled.

---

## How to keep this file current

1. Re-run the `cargo about generate` step in §4 whenever you bump the Tauri version
   or add Rust dependencies, and replace the §4 contents.
2. Re-check the WebView2 terms (§3) at each Tauri major upgrade.
3. Update the NSIS version in §5 if the bundler updates it.

_Last updated: 2026-07-01._
