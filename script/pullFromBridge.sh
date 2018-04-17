#!/bin/bash

. ./script/util.sh

pull_from_master_bridge() {
  CURRENT_BRANCH="$(get_current_branch)"
  echo_msg "current branch is: $CURRENT_BRANCH"

  check_if_remote_exists $remote_for_sync
  remote_exists_code=$?

  check_if_branch_exists $remote_bridge_branch
  remote_bridge_branch_exists_code=$?

  check_if_branch_exists $origin_bridge_branch
  bridge_branch_exists_code=$?

  if [ "$remote_exists_code" != 0 ] ; then
    echo_err "remote $remote_for_sync does not exist"
  elif [ "$remote_bridge_branch_exists_code" != 0 ] ; then
    echo_err "remote branch $remote_bridge_branch does not exist"
  elif [ "$bridge_branch_exists_code" != 0] ; then
    echo_err "branch $origin_bridge_branch does not exist"
  else
    # checkout $bridge_branch

    echo_msg "git checkout $bridge_branch"
    git checkout $bridge_branch

    # sync from remote bridge

    echo_msg "git merge $remote_bridge_branch"
    git fetch bridge $bridge_branch
    git merge $remote_bridge_branch

    echo_msg "git push -u origin $bridge_branch"
    git push -u origin $bridge_branch

    # checkout 当前分支
    echo_msg "git checkout $CURRENT_BRANCH"
    git checkout $CURRENT_BRANCH
    git pull origin $CURRENT_BRANCH

    # merge $bridge_branch 到当前分支

    echo_msg "git merge $bridge_branch"
    git merge $bridge_branch

    echo_msg "git push -u origin $CURRENT_BRANCH"
    git push -u origin $CURRENT_BRANCH
  fi

}

# check git status
git_is_clean
git_is_clean_code=$?
if [ "$git_is_clean_code" == 0 ] ; then
  pull_from_master_bridge
fi
