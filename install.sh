#!/usr/bin/env sh
# mdloomをグローバルコマンドとしてインストール/アップグレードするスクリプト。
#
#   curl -fsSL https://raw.githubusercontent.com/backpaper0/mdloom/main/install.sh | sh
#
# 既にcloneされている場合はgit pullで更新してから再ビルド・再リンクします。
set -eu

REPO_URL="https://github.com/backpaper0/mdloom.git"
INSTALL_DIR="${MDLOOM_INSTALL_DIR:-$HOME/.mdloom}"

for cmd in git node npm; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: $cmd is required." >&2
    exit 1
  fi
done

if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating existing installation at $INSTALL_DIR"
  git -C "$INSTALL_DIR" pull --ff-only
else
  echo "Cloning mdloom into $INSTALL_DIR"
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"
npm ci
npm link

echo "mdloom installed. Run 'mdloom --help' to get started."
