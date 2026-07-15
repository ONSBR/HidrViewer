# HidrViewer

O **HidrViewer** é um aplicativo desktop para **visualização, detecção de formato, conversão e edição** do arquivo binário de cadastro das usinas hidrelétricas (`hidr.dat`), utilizado pelos três modelos da cadeia de planejamento energético (NEWAVE, DECOMP e DESSEM).

Desenvolvido com o framework [**Tauri**](https://tauri.app), combina um backend em **Rust** — responsável pela leitura e escrita eficiente do arquivo binário — com uma interface construída em **HTML, CSS e JavaScript**.

## Recursos

- **Visualização** do conteúdo do arquivo `hidr.dat` de forma legível.
- **Detecção de formato** do arquivo binário.
- **Conversão** entre formatos.
- **Edição** dos dados de cadastro das usinas hidrelétricas.

## Instalação

O HidrViewer é distribuído para **Windows 64-bit**. Baixe o instalador na página de
[**Releases**](https://github.com/ONSBR/HidrViewer/releases/latest):

- **`HidrViewer_1.0.0_x64-setup.exe`** — instalador NSIS.
- **`HidrViewer_1.0.0_x64_en-US.msi`** — pacote MSI.

1. Baixe um dos instaladores acima.
2. Execute-o e siga as instruções na tela.
3. O aplicativo utiliza o runtime **Microsoft Edge WebView2**; caso não esteja presente, o instalador o disponibilizará.

## Tecnologia

| Camada        | Tecnologia                            |
| ------------- | ------------------------------------- |
| Framework     | [Tauri](https://tauri.app)            |
| Backend       | Rust                                  |
| Interface     | HTML, CSS e JavaScript                |
| Empacotamento | Instaladores NSIS e MSI (Windows x64) |

## Desenvolvimento

Instruções para compilar e executar o HidrViewer a partir do código-fonte.

### Pré-requisitos

- [**Node.js**](https://nodejs.org) 18 ou superior (fornece o `npm`, usado apenas para o Tauri CLI).
- [**Rust**](https://www.rust-lang.org/tools/install) 1.85 ou superior (o projeto usa a edição 2024), instalado via `rustup`.
- No **Linux**, as bibliotecas de sistema do WebKitGTK (abaixo). Windows e macOS não exigem pacotes adicionais além do toolchain.

#### Dependências de sistema (Linux)

O Tauri renderiza a interface com o WebKitGTK (linha **4.1**). Instale os pacotes de
desenvolvimento correspondentes à sua distribuição.

**Fedora / RHEL (`dnf`):**

```bash
sudo dnf install \
  webkit2gtk4.1-devel \
  javascriptcoregtk4.1-devel \
  libsoup3-devel \
  gtk3-devel \
  librsvg2-devel \
  libappindicator-gtk3-devel \
  openssl-devel \
  dbus-devel \
  libxdo-devel \
  pkgconf-pkg-config \
  curl wget file
sudo dnf group install "c-development"   # gcc, make e afins
```

**Debian / Ubuntu (`apt`):**

```bash
sudo apt update
sudo apt install \
  libwebkit2gtk-4.1-dev \
  libjavascriptcoregtk-4.1-dev \
  libsoup-3.0-dev \
  libgtk-3-dev \
  librsvg2-dev \
  libayatana-appindicator3-dev \
  libssl-dev \
  libxdo-dev \
  pkg-config \
  build-essential \
  curl wget file
```

> **Nota.** Muitos desses pacotes são puxados como dependência do pacote `webkit2gtk`,
> mas estão listados explicitamente para instalações mínimas. Em distribuições mais
> antigas o pacote do WebKitGTK pode se chamar `webkit2gtk4.0-devel` /
> `libwebkit2gtk-4.0-dev`; o HidrViewer usa a linha **4.1**.

### Compilar e executar

```bash
npm install     # instala o Tauri CLI declarado em devDependencies
npm run dev     # executa em modo de desenvolvimento
npm run build   # gera os instaladores em src-tauri/target/release/bundle/
```

## Histórico de mudanças

As mudanças de cada versão estão documentadas em [`CHANGELOG.md`](CHANGELOG.md).

## Licença

O HidrViewer é distribuído sob a licença [MIT](LICENSE) — um aplicativo gratuito, de
uso, modificação e redistribuição livres, inclusive para fins comerciais, bastando
manter o aviso de copyright.

## Licenças de terceiros

Os componentes de terceiros distribuídos com o aplicativo e suas respectivas licenças
estão documentados em [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md).
