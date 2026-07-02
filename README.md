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
[**Releases**](https://github.com/jhuliamacedo/HidrViewer/releases/latest):

- **`HidrViewer_0.0.1_x64-setup.exe`** — instalador NSIS, recomendado para uso final.
- **`HidrViewer_0.0.1_x64_en-US.msi`** — pacote MSI (em inglês), para implantação corporativa (Intune/SCCM/GPO).

1. Baixe um dos instaladores acima.
2. Execute-o e siga as instruções na tela.
3. O aplicativo utiliza o runtime **Microsoft Edge WebView2**; caso não esteja presente, o instalador o disponibilizará.

## Tecnologia

| Camada        | Tecnologia                    |
| ------------- | ----------------------------- |
| Framework     | [Tauri](https://tauri.app)    |
| Backend       | Rust                          |
| Interface     | HTML, CSS e JavaScript        |
| Empacotamento | Instalador NSIS (Windows x64) |

## Licença

O HidrViewer é distribuído sob a licença [MIT](LICENSE) — um aplicativo gratuito, de
uso, modificação e redistribuição livres, inclusive para fins comerciais, bastando
manter o aviso de copyright.

## Licenças de terceiros

Os componentes de terceiros distribuídos com o aplicativo e suas respectivas licenças
estão documentados em [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md).
