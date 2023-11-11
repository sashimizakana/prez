# PREZ

自分の動画用 Cloudflare Pages において Functions 経由で D1 にアクセスするやつ。  
一応自分だけ Auth0 ログインして、書き込めるのは自分だけになっている。

# 設定

## .dev.vars

AUTH0_SECRET={APIs で作った API の secret}

## .env

VITE_AUTH0_DOMAIN={Auth0 の自ドメイン}
VITE_AUTH0_CLIENT_ID={Auth0 の Application の ID}
VITE_AUTH0_AUDIENCE={Auth0 の API の aud}

# 開発

npm run dev

# デプロイ

master にプッシュするとデプロイされる
