# GIPE · app mobile (teste)

PWA do GIPE para o manobrista: login, entrada com leitura automática de placa, pátio e saída com leitura de QR Code.

| Caminho | O que é |
|---|---|
| `/` | Redireciona para o app |
| `/app/` | App (instalável como PWA) |
| `/c/?t=TOKEN` | Comprovante de entrada no celular do cliente |
| `/r/?t=TOKEN` | Recibo de saída no celular do cliente |
| `/contrato/?t=TOKEN` | Contrato do mensalista: leitura, PDF e aceite (`?id=N` abre pelo login do app) |

Publicado pelo GitHub Pages a partir da branch `main`.

OCR de placas: modelo `cct_s_v2_global` do [fast-plate-ocr](https://github.com/ankandrew/fast-plate-ocr) (licença MIT).
