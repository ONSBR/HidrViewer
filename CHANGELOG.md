# Changelog

Todas as mudanças notáveis neste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado

- Confirmação ao clicar em "Novo arquivo" quando há alterações no hidr.dat
  ainda não exportadas.
- Importar CSV avisa, antes de aplicar, sobre colunas não reconhecidas (que
  seriam ignoradas), códigos de usina repetidos e linhas sem código válido,
  permitindo cancelar.

### Corrigido

- Números com separador de milhar ou separadores ambíguos (ex.: `1.234,56`,
  `1,5,7`) eram gravados truncados (`1,234`, `1,5`) sem aviso. Agora são
  recusados, com mensagem na edição da célula e na importação de CSV.
- Valores de CSV que não podem ser lidos eram descartados em silêncio (mantendo
  o valor anterior). Agora a importação lista usina, coluna e valor recusados.
- Valores que corrompiam o hidr.dat sem aviso agora são recusados, na edição da
  célula e na importação de CSV, com o motivo: inteiro fora da faixa de 32 bits
  (`3e9` virava `-1294967296`), real fora da faixa do REAL*4/REAL*8 (virava
  `Infinity`), texto maior que o campo (era cortado) e caracteres fora do ASCII
  (acentos, `ç`, `–`).
- Tipo de perda 3 (coeficiente K), já previsto no cabeçalho do CSV
  (`1=%/2=M/3=K`), era recusado como erro e bloqueava a exportação. Agora é
  aceito.

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
- Instalador MSI passa a ser gerado em português do Brasil (`pt-BR`), em vez de
  `en-US`.

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
