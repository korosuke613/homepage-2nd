#!/bin/bash
set -euo pipefail

# AI Analysis Script for Renovate AI Analysis
# Executes AI analysis using GitHub Models and parses structured response

# Source utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils/logging.sh"
source "${SCRIPT_DIR}/utils/file-utils.sh"
source "${SCRIPT_DIR}/utils/validation.sh"

# Global variables
AI_RESPONSE=""
SUMMARY=""
IMPACT=""
ACTIONS=""
SECURITY=""

# Main function
main() {
    local temp_dir="$1"
    
    log_ai "Starting AI analysis of PR changes..."
    
    # Validate inputs
    validate_inputs "${temp_dir}"
    
    # Load context information
    load_context_files "${temp_dir}"
    
    # Execute AI analysis (this would be called by GitHub Actions workflow)
    # For now, we'll just parse the AI response that's passed via environment
    if [[ -n "${AI_RESPONSE_INPUT:-}" ]]; then
        AI_RESPONSE="${AI_RESPONSE_INPUT}"
        log_ai "AI response received (${#AI_RESPONSE} characters)"
    else
        log_warning "No AI response provided, using fallback content"
        generate_fallback_response
    fi
    
    # Parse and validate AI response
    parse_ai_response
    
    # Save parsed sections to files
    save_parsed_sections "${temp_dir}"
    
    log_complete "AI analysis processing completed"
}

# Validate input parameters and required files
validate_inputs() {
    local temp_dir="$1"
    
    if [[ ! -d "${temp_dir}" ]]; then
        log_error "Temporary directory not found: ${temp_dir}"
        exit 1
    fi
    
    # Check that required context files exist
    local required_files=(
        "${temp_dir}/pr-title.txt"
        "${temp_dir}/pr-body.txt"
        "${temp_dir}/changed-files.txt"
        "${temp_dir}/project-type.txt"
        "${temp_dir}/update-type.txt"
    )
    
    validate_required_files "${required_files[@]}"
}

# Load context information from files
load_context_files() {
    local temp_dir="$1"
    
    log_process "Loading context information..."
    
    local pr_title pr_body changed_files package_changes project_type
    local main_dependencies readme_context update_type
    
    pr_title=$(read_file "${temp_dir}/pr-title.txt" "PR title")
    pr_body=$(read_file "${temp_dir}/pr-body.txt" "PR body")
    changed_files=$(read_file "${temp_dir}/changed-files.txt" "Changed files")
    package_changes=$(read_file "${temp_dir}/package-changes.txt" "Package changes" || echo "No package changes")
    project_type=$(read_file "${temp_dir}/project-type.txt" "Project type")
    main_dependencies=$(read_file "${temp_dir}/main-dependencies.txt" "Main dependencies" || echo "No dependencies info")
    readme_context=$(read_file "${temp_dir}/readme-context.txt" "README context" || echo "No README context")
    update_type=$(read_file "${temp_dir}/update-type.txt" "Update type")
    
    log_success "Context information loaded successfully"
    
    # Log context summary for debugging
    log_info "Context summary:"
    log_info "  - Project Type: ${project_type}"
    log_info "  - Update Type: ${update_type}"
    log_info "  - Changed Files: $(echo "${changed_files}" | wc -l | tr -d ' ') files"
    log_info "  - Has Package Changes: $(if [[ -n "${package_changes}" && "${package_changes}" != "No package changes" ]]; then echo "Yes"; else echo "No"; fi)"
}

# Generate fallback response when AI is not available
generate_fallback_response() {
    log_warning "Generating fallback AI response"
    
    AI_RESPONSE="SUMMARY: 依存関係の更新
IMPACT: AI分析が利用できませんでした
ACTIONS: 手動でPRの内容を確認してください
SECURITY: 手動でセキュリティ影響を確認してください"
    
    log_success "Fallback response generated"
}

# Parse AI response into structured sections
parse_ai_response() {
    log_ai "Parsing AI response sections..."
    
    # Validate AI response format
    validate_ai_response "${AI_RESPONSE}"
    
    # Extract each section using grep and sed with error handling
    SUMMARY=$(echo "${AI_RESPONSE}" | grep "^SUMMARY:" | sed 's/^SUMMARY: *//' | head -1 | tr -d '\r' || echo "")
    IMPACT=$(echo "${AI_RESPONSE}" | grep "^IMPACT:" | sed 's/^IMPACT: *//' | head -1 | tr -d '\r' || echo "")
    ACTIONS=$(echo "${AI_RESPONSE}" | grep "^ACTIONS:" | sed 's/^ACTIONS: *//' | head -1 | tr -d '\r' || echo "")
    SECURITY=$(echo "${AI_RESPONSE}" | grep "^SECURITY:" | sed 's/^SECURITY: *//' | head -1 | tr -d '\r' || echo "")
    
    # Trim whitespace from all sections
    SUMMARY=$(echo "${SUMMARY}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    IMPACT=$(echo "${IMPACT}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    ACTIONS=$(echo "${ACTIONS}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    SECURITY=$(echo "${SECURITY}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Set default values if sections are empty
    SUMMARY=${SUMMARY:-"依存関係の更新"}
    IMPACT=${IMPACT:-"影響の詳細は不明"}
    ACTIONS=${ACTIONS:-"通常のテストを実行して確認"}
    SECURITY=${SECURITY:-"特別なセキュリティ考慮事項はありません"}
    
    # Sanitize content for safe usage
    SUMMARY=$(sanitize_string "${SUMMARY}" 500)
    IMPACT=$(sanitize_string "${IMPACT}" 800)
    ACTIONS=$(sanitize_string "${ACTIONS}" 600)
    SECURITY=$(sanitize_string "${SECURITY}" 600)
    
    log_info "Extracted sections:"
    log_info "  - Summary: ${#SUMMARY} chars"
    log_info "  - Impact: ${#IMPACT} chars"
    log_info "  - Actions: ${#ACTIONS} chars"
    log_info "  - Security: ${#SECURITY} chars"
}

# Save parsed sections to files for use by next script
save_parsed_sections() {
    local temp_dir="$1"
    
    log_process "Saving parsed AI analysis sections..."
    
    write_file "${temp_dir}/ai-summary.txt" "${SUMMARY}" "AI summary"
    write_file "${temp_dir}/ai-impact.txt" "${IMPACT}" "AI impact analysis"
    write_file "${temp_dir}/ai-actions.txt" "${ACTIONS}" "AI recommended actions"
    write_file "${temp_dir}/ai-security.txt" "${SECURITY}" "AI security considerations"
    
    # Also save the original response for debugging
    write_file "${temp_dir}/ai-response-raw.txt" "${AI_RESPONSE}" "Raw AI response"
    
    log_success "All AI analysis sections saved"
}

# Function to construct AI prompt (for documentation/testing)
construct_ai_prompt() {
    local temp_dir="$1"
    
    local pr_title pr_body changed_files package_changes project_type
    local main_dependencies readme_context update_type
    
    pr_title=$(read_file "${temp_dir}/pr-title.txt")
    pr_body=$(read_file "${temp_dir}/pr-body.txt")
    changed_files=$(read_file "${temp_dir}/changed-files.txt")
    package_changes=$(read_file "${temp_dir}/package-changes.txt")
    project_type=$(read_file "${temp_dir}/project-type.txt")
    main_dependencies=$(read_file "${temp_dir}/main-dependencies.txt")
    readme_context=$(read_file "${temp_dir}/readme-context.txt")
    update_type=$(read_file "${temp_dir}/update-type.txt")
    
    cat << EOF
You are a senior software engineer reviewing a dependency update PR created by Renovate.

Analyze the following PR details and provide a structured response:

**PR Title:** ${pr_title}

**PR Description:** ${pr_body}

**Changed Files:** ${changed_files}

**Package Changes:** ${package_changes}

**Project Type:** ${project_type}

**Main Dependencies:** ${main_dependencies}

**Project Context:** ${readme_context}

**Update Type:** ${update_type}

Please provide your analysis in the following structured format (use plain text without markdown formatting):

SUMMARY: [Brief summary of what packages are being updated]
IMPACT: [Potential impact and risks, especially for major updates]
ACTIONS: [Recommended actions before merging]
SECURITY: [Any security considerations]

Keep each section concise and actionable. Use plain text only without any markdown formatting.
EOF
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $# -lt 1 ]]; then
        log_error "Usage: $0 <temp_dir>"
        exit 1
    fi
    main "$@"
fi