#!/usr/bin/env bash
# Print the bin directory of a Node that can run this repo's checks and tests.
# Needs: the major version in .nvmrc (the one CI uses) or newer, built with TypeScript
# stripping, because some tests import .ts modules. Distro builds (Debian/Ubuntu nodejs)
# ship without it and fail with ERR_UNKNOWN_FILE_EXTENSION.
# Order: the active node, then fnm and nvm installs of the .nvmrc major, then newer majors.
# Usage: export PATH="$(scripts/find-node.sh):$PATH"
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
want="$(tr -d ' \t\r\nv' < "$root/.nvmrc")"
want="${want%%.*}"
[[ "$want" =~ ^[0-9]+$ ]] || { echo "find-node: .nvmrc must start with a major version, got '$want'" >&2; exit 2; }

# "<version> <typescript feature>" of one node binary, e.g. "24.21.0 strip" or "22.22.1 false".
probe() { "$1" -p 'process.versions.node + " " + (process.features.typescript || false)' 2>/dev/null || true; }

fits() {
  local version ts
  read -r version ts <<< "$(probe "$1")"
  [ -n "${version:-}" ] && [ "${version%%.*}" -ge "$want" ] && [ "${ts:-false}" != false ]
}

active="$(command -v node || true)"
if [ -n "$active" ] && fits "$active"; then
  dirname "$active"
  exit 0
fi

# Installed versions, newest first; the .nvmrc major goes before newer majors.
installed=()
for dir in \
  "${FNM_DIR:-$HOME/.local/share/fnm}"/node-versions/v*/installation/bin \
  "$HOME/Library/Application Support/fnm"/node-versions/v*/installation/bin \
  "${NVM_DIR:-$HOME/.nvm}"/versions/node/v*/bin; do
  [ -x "$dir/node" ] && installed+=("$dir")
done
if [ "${#installed[@]}" -gt 0 ]; then
  ordered="$(for dir in "${installed[@]}"; do
    v="$(grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' <<< "$dir" | tail -1)"
    v="${v#v}"
    [ "${v%%.*}" = "$want" ] && rank=0 || rank=1
    printf '%s\t%s\t%s\n' "$rank" "$v" "$dir"
  done | sort -t "$(printf '\t')" -k1,1n -k2,2Vr | cut -f3)"
  while IFS= read -r dir; do
    if fits "$dir/node"; then
      echo "$dir"
      exit 0
    fi
  done <<< "$ordered"
fi

have="none"
[ -n "$active" ] && have="$(probe "$active")"
cat >&2 <<EOF
find-node: this repo needs Node $want or newer with TypeScript stripping (see .nvmrc, same as CI).
  active node: ${active:-not on PATH} (${have:-unknown}; second field is TypeScript support)
  no fnm or nvm install fits either.
  fix: fnm install $want   (or: nvm install $want)
EOF
exit 1
