#!/bin/bash
set -euo pipefail

# Collect PR Details Script for Renovate AI Analysis
# Gathers PR information, project context, and determines update type

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils/logging.sh"
source "${SCRIPT_DIR}/utils/file-utils.sh"
source "${SCRIPT_DIR}/utils/validation.sh"

# Main function
main() {
    log_step "Starting PR details collection for PR #${PR_NUMBER}"
    log_info "PR Title: ${PR_TITLE}"
    
    # Validate prerequisites
    validate_prerequisites
    
    # Create temporary directory
    TEMP_DIR=$(create_temp_dir)
    setup_cleanup_trap
    
    # Collect PR information
    collect_pr_info
    
    # Collect project context
    collect_project_context
    
    # Determine update type and severity
    determine_update_type
    
    # Save all information to files
    save_context_files
    
    # Output results for next step
    echo "TEMP_DIR=${TEMP_DIR}" >> "${GITHUB_OUTPUT}"
    
    log_complete "PR details collection completed successfully"
}

# Collect basic PR information
collect_pr_info() {
    # Get PR title if not provided (e.g., for workflow_dispatch)
    if [[ -z "${PR_TITLE:-}" ]]; then
        log_info "Fetching PR title..."
        PR_TITLE=$(gh pr view "${PR_NUMBER}" --json title --jq '.title')
        log_success "PR title fetched: ${PR_TITLE}"
    fi
    
    log_info "Fetching PR body..."
    PR_BODY=$(gh pr view "${PR_NUMBER}" --json body --jq '.body')
    log_success "PR body fetched (${#PR_BODY} characters)"
    
    log_file "Fetching changed files..."
    CHANGED_FILES=$(gh pr diff "${PR_NUMBER}" --name-only)
    local file_count
    file_count=$(echo "${CHANGED_FILES}" | wc -l | tr -d ' ')
    log_success "Found ${file_count} changed files"
}

# Collect project context information
collect_project_context() {
    log_detect "Detecting project type..."
    MAIN_DEPENDENCIES=""

    # Get README snippet for project context
    log_readme "Reading project context from README..."
    README_CONTEXT=""
    if [[ -f "README.md" ]]; then
        README_CONTEXT=$(head -c 500 README.md | tr '\n' ' ')
        log_success "README context captured (${#README_CONTEXT} characters)"
    else
        log_info "No README.md found"
    fi
}

# Determine update type and severity with improved logic
determine_update_type() {
    log_detect "Analyzing update type from PR title..."
    UPDATE_TYPE="patch"
    SEVERITY="low"
    
    # Check for major updates (comprehensive patterns)
    if [[ "${PR_TITLE}" =~ (major|breaking|v[0-9]+\.0\.0|major\ version|breaking\ change) ]]; then
        UPDATE_TYPE="major"
        SEVERITY="high"
        log_major "Detected MAJOR update (high severity)"
    # Check for minor updates (improved patterns)
    elif [[ "${PR_TITLE}" =~ (minor|feature|v[0-9]+\.[1-9][0-9]*\.0|minor\ version) ]]; then
        UPDATE_TYPE="minor"
        SEVERITY="medium"
        log_minor "Detected MINOR update (medium severity)"
    # Check for patch updates (specific patterns)
    elif [[ "${PR_TITLE}" =~ (patch|fix|bug|security|v[0-9]+\.[0-9]+\.[1-9][0-9]*|patch\ version) ]]; then
        UPDATE_TYPE="patch"
        SEVERITY="low"
        log_patch "Detected PATCH update (low severity)"
    # Additional checks for dev dependencies (lower severity)
    elif [[ "${PR_TITLE}" =~ (devDependencies|dev-dependencies|@types/) ]]; then
        UPDATE_TYPE="dev"
        SEVERITY="low"
        log_dev "Detected DEV DEPENDENCY update (low severity)"
    # Check for security updates (higher priority)
    elif [[ "${PR_TITLE}" =~ (security|vulnerability|CVE-|GHSA-) ]]; then
        UPDATE_TYPE="security"
        SEVERITY="high"
        log_security "Detected SECURITY update (high severity)"
    else
        log_unknown "Could not determine specific update type, defaulting to PATCH (low severity)"
    fi
    
    # Validate the determined values
    validate_update_type "${UPDATE_TYPE}" || UPDATE_TYPE="patch"
    validate_severity "${SEVERITY}" || SEVERITY="low"
}

# Save all context information to files
save_context_files() {
    log_process "Saving context files to temporary directory..."
    
    write_file "${TEMP_DIR}/pr-title.txt" "${PR_TITLE}" "PR title"
    write_file "${TEMP_DIR}/pr-body.txt" "${PR_BODY}" "PR body"
    write_file "${TEMP_DIR}/changed-files.txt" "${CHANGED_FILES}" "Changed files list"
    write_file "${TEMP_DIR}/main-dependencies.txt" "${MAIN_DEPENDENCIES}" "Main dependencies"
    write_file "${TEMP_DIR}/readme-context.txt" "${README_CONTEXT}" "README context"
    write_file "${TEMP_DIR}/update-type.txt" "${UPDATE_TYPE}" "Update type"
    write_file "${TEMP_DIR}/severity.txt" "${SEVERITY}" "Severity level"
    
    log_success "All context files saved to temp directory"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi