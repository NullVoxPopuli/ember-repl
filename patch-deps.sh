#!/bin/bash
#
# Some packages need to be built and PRs have yet to be merged.
# This script clones the needed-to-be-built packages and builds them.

root=$(pwd)

function embroider() {
  local fork="https://github.com/NullVoxPopuli/embroider.git"
  local branch="ts-without-ember-cli-typescript"
  local dir=$(echo $fork | cut -d "/" -f 5 | cut -d "." -f 1)
  local prefix="$root/tmp/patched-deps"

  mkdir -p $prefix
  rm -rf "$prefix/$dir"
  cd $prefix
  git clone $fork
  cd "$prefix/$dir"
  git checkout $branch
  yarn
  yarn compile

  local compat="$prefix/$dir/packages/compat"

  # Use symlink to not interfere with system's yarn link
  cd $root
  rm -rf node_modules/@embroider/compat
  ln -s $compat node_modules/@embroider/compat
}


echo "Installing Patches..."
embroider
