#!/bin/bash
set -euo pipefail

# Validation utilities for Renovate AI Analysis workflow
# Provides input validation and environment checks

# Source logging utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/logging.sh"

# Validate required environment variables
validate_env_vars() {
    local required_vars=("$@")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("${var}")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        return 1
    fi
    
    log_success "All required environment variables found"
    return 0
}

# Validate PR number
validate_pr_number() {
    local pr_number="$1"
    
    if [[ ! "${pr_number}" =~ ^[0-9]+$ ]]; then
        log_error "Invalid PR number: ${pr_number}"
        return 1
    fi
    
    log_success "Valid PR number: ${pr_number}"
    return 0
}

# Validate GitHub repository format
validate_repo_format() {
    local repo="$1"
    
    if [[ ! "${repo}" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
        log_error "Invalid repository format: ${repo}"
        return 1
    fi
    
    log_success "Valid repository format: ${repo}"
    return 0
}

# Check if string is empty or null
is_empty() {
    local value="$1"
    [[ -z "${value}" || "${value}" == "null" ]]
}

# Validate AI response has required sections
validate_ai_response() {
    local response="$1"
    local required_sections=("SUMMARY:" "IMPACT:" "ACTIONS:" "SECURITY:")
    local missing_sections=()
    
    if is_empty "${response}"; then
        log_error "AI response is empty or null"
        return 1
    fi
    
    for section in "${required_sections[@]}"; do
        if ! echo "${response}" | grep -q "^${section}"; then
            missing_sections+=("${section}")
        fi
    done
    
    if [[ ${#missing_sections[@]} -gt 0 ]]; then
        log_warning "Missing AI response sections: ${missing_sections[*]}"
        # Don't fail here, we have fallback handling
    else
        log_success "AI response has all required sections"
    fi
    
    return 0
}

# Validate update type
validate_update_type() {
    local update_type="$1"
    local valid_types=("major" "minor" "patch" "dev" "security")
    
    for valid_type in "${valid_types[@]}"; do
        if [[ "${update_type}" == "${valid_type}" ]]; then
            log_success "Valid update type: ${update_type}"
            return 0
        fi
    done
    
    log_warning "Unknown update type: ${update_type}, defaulting to patch"
    return 1
}

# Validate severity level
validate_severity() {
    local severity="$1"
    local valid_levels=("low" "medium" "high")
    
    for valid_level in "${valid_levels[@]}"; do
        if [[ "${severity}" == "${valid_level}" ]]; then
            log_success "Valid severity level: ${severity}"
            return 0
        fi
    done
    
    log_warning "Unknown severity level: ${severity}, defaulting to low"
    return 1
}

# Check if GitHub CLI is available
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not available"
        return 1
    fi
    
    log_success "GitHub CLI is available"
    return 0
}

# Check if jq is available (for Node.js projects)
check_jq() {
    if ! command -v jq &> /dev/null; then
        log_warning "jq is not available (Node.js dependency parsing will be skipped)"
        return 1
    fi
    
    log_success "jq is available"
    return 0
}

# Validate all prerequisites
validate_prerequisites() {
    local required_env_vars=("GH_TOKEN" "PR_NUMBER" "GITHUB_REPOSITORY")
    
    log_step "Validating prerequisites..."
    
    validate_env_vars "${required_env_vars[@]}" || return 1
    validate_pr_number "${PR_NUMBER}" || return 1
    validate_repo_format "${GITHUB_REPOSITORY}" || return 1
    check_gh_cli || return 1
    
    # jq is optional, don't fail if missing
    check_jq || true
    
    log_complete "Prerequisites validation completed"
    return 0
}

# Sanitize string for safe usage
sanitize_string() {
    local input="$1"
    local max_length="${2:-1000}"
    
    # Remove control characters and limit length
    echo "${input}" | tr -d '\000-\037' | head -c "${max_length}"
}

# Validate file content size
validate_file_size() {
    local file_path="$1"
    local max_size="${2:-10000}"  # 10KB default
    
    if [[ ! -f "${file_path}" ]]; then
        log_error "File does not exist: ${file_path}"
        return 1
    fi
    
    local file_size
    file_size=$(stat -f%z "${file_path}" 2>/dev/null || stat -c%s "${file_path}" 2>/dev/null || echo "0")
    
    if [[ "${file_size}" -gt "${max_size}" ]]; then
        log_warning "File size (${file_size} bytes) exceeds maximum (${max_size} bytes): ${file_path}"
        return 1
    fi
    
    log_success "File size validation passed: ${file_path} (${file_size} bytes)"
    return 0
}