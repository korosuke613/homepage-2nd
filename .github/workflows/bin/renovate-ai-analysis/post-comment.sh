#!/bin/bash
set -euo pipefail

# Post Comment Script for Renovate AI Analysis
# Posts or updates PR comment with AI analysis results

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils/logging.sh"
source "${SCRIPT_DIR}/utils/file-utils.sh"
source "${SCRIPT_DIR}/utils/validation.sh"

# Global variables
EXISTING_COMMENT_ID=""
UPDATE_EXISTING=false

# Main function
main() {
    local temp_dir="$1"
    
    log_comment "Starting comment posting process..."
    
    # Validate prerequisites
    validate_prerequisites
    
    # Validate inputs
    validate_inputs "${temp_dir}"
    
    # Check for existing comments
    check_existing_comments
    
    # Post or update comment
    post_or_update_comment "${temp_dir}"
    
    log_celebrate "AI analysis comment published successfully!"
}

# Validate input parameters and required files
validate_inputs() {
    local temp_dir="$1"
    
    if [[ ! -d "${temp_dir}" ]]; then
        log_error "Temporary directory not found: ${temp_dir}"
        exit 1
    fi
    
    local comment_file="${temp_dir}/comment.md"
    if [[ ! -f "${comment_file}" ]]; then
        log_error "Comment file not found: ${comment_file}"
        exit 1
    fi
    
    if [[ ! -s "${comment_file}" ]]; then
        log_error "Comment file is empty: ${comment_file}"
        exit 1
    fi
    
    log_success "Input validation completed"
}

# Check for existing AI analysis comments to prevent duplicates
check_existing_comments() {
    log_step "Checking for existing AI analysis comments..."
    
    # Search for existing comments containing the AI analysis marker
    EXISTING_COMMENT_ID=$(gh pr view "${PR_NUMBER}" --json comments \
        --jq '.comments[] | select(.body | contains("🤖 AI Analysis Summary")) | .id' \
        | head -1 || echo "")
    
    if [[ -n "${EXISTING_COMMENT_ID}" ]]; then
        log_success "Found existing AI analysis comment (ID: ${EXISTING_COMMENT_ID})"
        UPDATE_EXISTING=true
    else
        log_info "No existing AI analysis comment found"
        UPDATE_EXISTING=false
    fi
}

# Post new comment or update existing one
post_or_update_comment() {
    local temp_dir="$1"
    local comment_file="${temp_dir}/comment.md"
    
    log_comment "Publishing comment to PR..."
    
    if [[ "${UPDATE_EXISTING}" == "true" ]]; then
        update_existing_comment "${comment_file}"
    else
        create_new_comment "${comment_file}"
    fi
}

# Update existing comment
update_existing_comment() {
    local comment_file="$1"
    
    log_update "Updating existing comment (ID: ${EXISTING_COMMENT_ID})"
    
    # Read comment content
    local comment_body
    comment_body=$(cat "${comment_file}")
    
    # Update comment using GitHub API
    if gh api \
        --method PATCH \
        --header "Accept: application/vnd.github+json" \
        --header "X-GitHub-Api-Version: 2022-11-28" \
        "/repos/${GITHUB_REPOSITORY}/issues/comments/${EXISTING_COMMENT_ID}" \
        --field body="${comment_body}"; then
        log_success "Successfully updated existing comment"
    else
        log_error "Failed to update existing PR comment"
        exit 1
    fi
}

# Create new comment
create_new_comment() {
    local comment_file="$1"
    
    log_create "Creating new comment"
    
    # Post new comment using GitHub CLI
    if gh pr comment "${PR_NUMBER}" \
        --body-file "${comment_file}" \
        --repo "${GITHUB_REPOSITORY}"; then
        log_success "Successfully created new comment"
    else
        log_error "Failed to post PR comment"
        exit 1
    fi
}

# Get comment URL for reference
get_comment_url() {
    if [[ "${UPDATE_EXISTING}" == "true" && -n "${EXISTING_COMMENT_ID}" ]]; then
        echo "https://github.com/${GITHUB_REPOSITORY}/pull/${PR_NUMBER}#issuecomment-${EXISTING_COMMENT_ID}"
    else
        echo "https://github.com/${GITHUB_REPOSITORY}/pull/${PR_NUMBER}"
    fi
}

# Verify comment was posted successfully
verify_comment_posted() {
    log_step "Verifying comment was posted successfully..."
    
    # Wait a moment for GitHub API to update
    sleep 2
    
    # Check if comment exists
    local comment_count
    comment_count=$(gh pr view "${PR_NUMBER}" --json comments \
        --jq '.comments[] | select(.body | contains("🤖 AI Analysis Summary")) | .id' \
        | wc -l | tr -d ' ')
    
    if [[ "${comment_count}" -gt 0 ]]; then
        log_success "Comment verification successful (${comment_count} AI analysis comments found)"
        
        # Log comment URL for reference
        local comment_url
        comment_url=$(get_comment_url)
        log_info "Comment URL: ${comment_url}"
    else
        log_error "Comment verification failed - no AI analysis comments found"
        return 1
    fi
}

# Handle comment posting errors with retry logic
post_comment_with_retry() {
    local temp_dir="$1"
    local max_retries=3
    local retry_count=0
    
    while [[ ${retry_count} -lt ${max_retries} ]]; do
        if post_or_update_comment "${temp_dir}"; then
            log_success "Comment posted successfully"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [[ ${retry_count} -lt ${max_retries} ]]; then
                log_warning "Comment posting failed, retrying (${retry_count}/${max_retries})..."
                sleep 5
            else
                log_error "Comment posting failed after ${max_retries} attempts"
                return 1
            fi
        fi
    done
}

# Clean up comment content for posting
clean_comment_content() {
    local comment_file="$1"
    local temp_file="${comment_file}.tmp"
    
    log_process "Cleaning comment content..."
    
    # Remove any potential problematic characters
    # Ensure proper line endings
    sed 's/\r$//' "${comment_file}" > "${temp_file}"
    mv "${temp_file}" "${comment_file}"
    
    # Validate final content
    if ! validate_file_size "${comment_file}" 10000; then
        log_warning "Comment is quite large, may hit GitHub API limits"
    fi
    
    log_success "Comment content cleaned"
}

# Get posting statistics for logging
get_posting_stats() {
    local temp_dir="$1"
    local comment_file="${temp_dir}/comment.md"
    
    if [[ -f "${comment_file}" ]]; then
        local word_count line_count char_count
        word_count=$(wc -w < "${comment_file}" | tr -d ' ')
        line_count=$(wc -l < "${comment_file}" | tr -d ' ')
        char_count=$(wc -c < "${comment_file}" | tr -d ' ')
        
        log_info "Comment statistics:"
        log_info "  - Characters: ${char_count}"
        log_info "  - Words: ${word_count}"
        log_info "  - Lines: ${line_count}"
        log_info "  - Action: $(if [[ "${UPDATE_EXISTING}" == "true" ]]; then echo "Update"; else echo "Create"; fi)"
    fi
}

# Main execution with error handling
main_with_error_handling() {
    local temp_dir="$1"
    
    # Set up error handling
    set -e
    
    # Clean comment content before posting
    clean_comment_content "${temp_dir}/comment.md"
    
    # Get and log posting statistics
    get_posting_stats "${temp_dir}"
    
    # Execute main posting logic
    main "${temp_dir}"
    
    # Verify the comment was posted
    verify_comment_posted
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -lt 1 ]]; then
        log_error "Usage: $0 <temp_dir>"
        exit 1
    fi
    
    main_with_error_handling "$1"
fi