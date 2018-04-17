#!/bin/bash

# 跨脚本变量

# 用于同步的分支的名字
bridge_branch="master-bridge"

# origin 对应的用于同步的分支的名字
origin_bridge_branch="origin/$bridge_branch"

# 用于同步的 remote
remote_for_sync="bridge"

# remote 对应的用于同步的分支的名字
remote_bridge_branch="bridge/$bridge_branch"

git_is_clean() {
  GIT_STATUS="$(git status --porcelain)"

  if [ ! -z "$GIT_STATUS" ]
  then
    echo_err "You have unstaged changes. Please commit or stash them."
    return "1"
  else
    return "0"
  fi
}

get_current_branch() {
  echo $(git symbolic-ref --short HEAD)
}

check_if_branch_exists() {
  # return 0 if exists, 1 if not
  git rev-parse --verify --quiet $1 > /dev/null
  return "$?"
}

check_if_remote_exists() {
  # return 0 if exists, 2 if not
  git ls-remote --exit-code $1 master &> /dev/null
  return "$?"
}

echo_msg() {
  echo "\n\n$1\n\n"
}

echo_err() {
  echo "\n\n$1\n\n" >&2
}
