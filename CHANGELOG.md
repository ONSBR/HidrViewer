# Changelog

Todas as mudanças notáveis neste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2026-07-15

Primeira versão estável. Consolida o aplicativo lançado na 0.0.1 e adiciona
endurecimento de segurança, auditoria de dependências e publicação automatizada
dos instaladores Windows.

### Adicionado

- Build de release automatizado para Windows via GitHub Actions: ao publicar um
  release no GitHub, os instaladores NSIS (`-setup.exe`) e MSI são gerados em um
  runner Windows e anexados automaticamente ao release.
- Verificação de consistência de versão no CI: o build de release falha caso a
  tag do release divirja da versão declarada em `tauri.conf.json`,
  `package.json` e `Cargo.toml`.
- Auditoria de segurança contínua no CI com `cargo-deny` (gate bloqueante sobre
  o binário Windows distribuído) e `cargo-audit` (varredura informativa da
  árvore completa de dependências).
- Documentação completa das licenças de terceiros em `THIRD_PARTY_LICENSES.md` e
  `THIRD_PARTY_RUST.md`.

### Alterado

- Adoção da edição 2024 do Rust — o projeto passa a exigir Rust 1.85 ou superior.
- Atualização de dependências e melhorias no empacotamento e nos metadados do
  projeto.
- Referências de repositório atualizadas para `github.com/ONSBR/HidrViewer` e
  correção dos pré-requisitos de compilação na documentação.

### Segurança

- Endurecimento da Content Security Policy (CSP) da aplicação.
- Resolução de advisories do RustSec por meio da atualização das dependências
  afetadas.

## [0.0.1] - 2026-07-02

### Adicionado

- Primeira versão pública do HidrViewer.
- Visualização do conteúdo do arquivo binário `hidr.dat` de forma legível.
- Detecção automática do formato do arquivo (NEWAVE, DECOMP, DESSEM).
- Conversão entre formatos.
- Edição dos dados de cadastro das usinas hidrelétricas.
- Distribuição para Windows 64-bit com instaladores NSIS e MSI.

[1.0.0]: https://github.com/ONSBR/HidrViewer/compare/v0.0.1...v1.0.0
[0.0.1]: https://github.com/ONSBR/HidrViewer/releases/tag/v0.0.1
