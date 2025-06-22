#!/bin/bash

cd inputs
git add .

if git diff --staged --quiet; then
    echo "No changes to commit in submodule"
else
    git commit -m "chore: update inputs"
    git push
    echo "Inputs changes pushed successfully"
fi

cd ..

git add inputs
git commit -m "chore: update inputs submodule reference" || echo "No changes to submodule reference"
git push

echo "Successfully updated and pushed submodule and main repository"