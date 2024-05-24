# ベースイメージ
FROM node:22

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ts-node-devをグローバルインストール
RUN npm install -g ts-node-dev

# コンテナ起動時に実行されるコマンド
CMD ["ts-node-dev", "--respawn", "src/index.ts"]
