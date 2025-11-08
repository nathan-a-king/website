# Branch Protection Setup Guide

This document outlines how to configure GitHub branch protection rules to ensure code quality and prevent broken code from being merged into the `main` branch.

## Overview

With the CI workflow in place (`.github/workflows/ci.yml`), you can now enforce that all tests pass and code builds successfully before any pull request can be merged into `main`.

## Setting Up Branch Protection Rules

### Step 1: Navigate to Branch Protection Settings

1. Go to your GitHub repository
2. Click on **Settings** (top navigation)
3. Click on **Branches** (left sidebar under "Code and automation")
4. Under "Branch protection rules", click **Add rule** or **Add branch protection rule**

### Step 2: Configure Protection for `main` Branch

#### Basic Settings

1. **Branch name pattern:** `main`
   - This applies the rules to your main branch

#### Required Settings for CI Enforcement

Enable the following options:

1. **☑ Require a pull request before merging**
   - When enabled, this will show additional sub-options:
     - ✅ **Require approvals:** Set to at least 1 reviewer
     - ✅ **Dismiss stale pull request approvals when new commits are pushed**
     - ⬜ **Require review from Code Owners** (optional, only if you have a CODEOWNERS file)

2. **☑ Require status checks to pass before merging**
   - When enabled, this will show additional options:
     - ✅ **Require branches to be up to date before merging**
     - **Search for and select required status checks:**
       - `Test` (from the CI workflow)
       - `Build & Validate` (from the CI workflow)

   > **Important:** Status checks will only appear in the search list after the CI workflow has run at least once. Create a test PR first to trigger the workflow, then these checks will become available to select.

3. **☑ Require conversation resolution before merging**
   - Ensures all PR comments are resolved before merging

4. **☑ Do not allow bypassing the above settings**
   - Recommended: Enable this to apply rules to administrators too
   - Alternative: Leave unchecked if admins need emergency bypass ability

#### Additional Optional Settings

5. **⬜ Require signed commits**
   - Optional: Enable if you want to enforce GPG-signed commits
   - Most teams leave this unchecked

6. **⬜ Require linear history**
   - Optional: Enable to prevent merge commits and keep a linear git history
   - Recommended if your team prefers rebase workflow

7. **⬜ Require deployments to succeed before merging**
   - Leave unchecked (not applicable unless you have deployment workflows)

8. **⬜ Lock branch**
   - Leave unchecked (this makes the branch completely read-only)

### Step 3: Save Changes

Click **Create** or **Save changes** at the bottom of the page.

## Testing the Setup

1. Create a new branch: `git checkout -b test-ci-protection`
2. Make a small change (e.g., add a comment to a file)
3. Commit and push: `git add . && git commit -m "Test CI" && git push -u origin test-ci-protection`
4. Create a pull request targeting `main`
5. Verify that:
   - CI workflow runs automatically
   - Both "Test" and "Build & Validate" status checks appear
   - Merge button is disabled until checks pass
   - Once checks pass, merge button becomes enabled

## Setting Up Protection for `develop` Branch (Optional)

If you want to protect the `develop` branch as well, repeat the steps above with these adjustments:

1. **Branch name pattern:** `develop`
2. Use the same required status checks
3. Consider fewer required reviewers (e.g., 0 or 1) since `develop` is typically less strict than `main`

## What Happens When CI Fails

When a pull request fails CI checks:

1. The merge button will be disabled (greyed out)
2. GitHub will show which status checks failed
3. Click on "Details" next to the failed check to see the CI logs
4. Fix the issues in your branch
5. Push the fixes - CI will run again automatically
6. Once all checks pass, the PR can be merged

## CI Status Checks Explained

### Test
- Runs the full test suite with coverage requirements
- **Fails if:**
  - Any test fails
  - Code coverage drops below 70% (statements, branches, functions, lines)
- **Runtime:** ~1-2 minutes typically

### Build & Validate
- Builds the production bundle and validates output
- **Fails if:**
  - Build process fails
  - Validation script detects issues
  - Build artifacts are malformed
- **Runtime:** ~1-2 minutes typically

## Coverage Reports

After each CI run, coverage reports are uploaded as artifacts:

1. Go to the **Actions** tab in your repository
2. Click on a specific workflow run
3. Scroll to **Artifacts** section
4. Download `coverage-report` to view detailed HTML coverage reports locally

## Troubleshooting

### Status Checks Don't Appear in Branch Protection Settings

**Problem:** The "Test" and "Build & Validate" checks aren't available to select.

**Solution:** Status checks only appear after they've run at least once. Create a test PR to trigger the CI workflow, then the checks will be available.

### CI Passes Locally But Fails on GitHub

**Problem:** Tests pass on your machine but fail in CI.

**Possible causes:**
1. **Node version mismatch:** Ensure you're using Node 20.x locally
2. **Dependency differences:** Run `npm ci` instead of `npm install` locally to match CI
3. **Environment-specific issues:** Check the CI logs for specific error messages

### Need to Merge Urgently Despite Failed CI

**Options:**
1. **Recommended:** Fix the failing tests/build - this is usually quick
2. **If allowed:** Admins can bypass protection rules (if "Include administrators" is unchecked)
3. **Emergency only:** Temporarily disable branch protection (not recommended)

## Workflow File Location

The CI workflow is defined in: `.github/workflows/ci.yml`

## Updating CI Requirements

To modify what the CI checks:

1. Edit `.github/workflows/ci.yml`
2. Commit and push changes
3. The new CI configuration will apply to all subsequent runs

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Vitest Coverage Documentation](https://vitest.dev/guide/coverage.html)
