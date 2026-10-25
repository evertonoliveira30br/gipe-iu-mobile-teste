# Murel · app mobile (teste)

*Seu pátio sob controle.*

PWA da Murel para o manobrista: login, entrada com leitura automática de placa, pátio e saída com leitura de QR Code.

| Caminho | O que é |
|---|---|
| `/` | Redireciona para o app |
| `/app/` | App (instalável como PWA) |
| `/c/?t=TOKEN` | Comprovante de entrada no celular do cliente |
| `/r/?t=TOKEN` | Recibo de saída no celular do cliente |
| `/contrato/?t=TOKEN` | Contrato do mensalista: leitura, PDF e aceite (`?id=N` abre pelo login do app) |

Publicado pelo GitHub Pages a partir da branch `main`.

Identidade visual: cores e fontes da marca Murel (asfalto `#0E1729`, faixa `#FFC20E`, giz `#F4F1E8`; Plus Jakarta Sans e JetBrains Mono para placas). O endereço da API (`api.gipepark.com.br`) e as chaves salvas no aparelho (`gipe-*`) continuam com o nome antigo para não deslogar ninguém.

OCR de placas: modelo `cct_s_v2_global` do [fast-plate-ocr](https://github.com/ankandrew/fast-plate-ocr) (licença MIT).
