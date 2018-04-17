#!/bin/bash

. ./script/util.sh

push_to_master_bridge() {
  # 当前分支
  CURRENT_BRANCH="$(get_current_branch)"
  echo_msg "current branch is: $CURRENT_BRANCH"

  check_if_branch_exists $origin_bridge_branch
  origin_bridge_branch_exists_code=$?

  if [ "$origin_bridge_branch_exists_code" != 0 ] ; then
    echo_err "$origin_bridge_branch does not exist"
  else
    # 先提交当前分支
    echo_msg "git push -u origin $CURRENT_BRANCH"
    git pull origin $CURRENT_BRANCH
    git push -u origin $CURRENT_BRANCH

    # checkout $bridge_branch

    echo_msg "git checkout $bridge_branch"
    git checkout $bridge_branch
    git pull origin $bridge_branch

    # merge 当前分支到 $bridge_branch

    echo_msg "git merge $CURRENT_BRANCH"
    git merge $CURRENT_BRANCH

    echo_msg "git push -u origin $bridge_branch"
    git push -u origin $bridge_branch

    # checkout 当前分支
    echo_msg "git checkout $CURRENT_BRANCH"
    git checkout $CURRENT_BRANCH
  fi
}

# check git status
git_is_clean
git_is_clean_code=$?
if [ "$git_is_clean_code" == 0 ] ; then
  push_to_master_bridge
fi
