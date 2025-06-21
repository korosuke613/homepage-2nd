#!/bin/bash
set -euo pipefail

# File utilities for Renovate AI Analysis workflow
# Provides secure file operations and cleanup functions

# Source logging utilities (use relative path to avoid SCRIPT_DIR conflicts)
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${CURRENT_DIR}/logging.sh"

# Create secure temporary directory using GitHub Actions runner.temp
create_temp_dir() {
    local subdir="${1:-ai-analysis}"
    local temp_dir="${RUNNER_TEMP:-/tmp}/${subdir}"
    
    log_process "Creating temporary directory: ${temp_dir}"
    mkdir -p "${temp_dir}"
    log_success "Created temp directory: ${temp_dir}"
    
    echo "${temp_dir}"
}

# Write content to file with logging
write_file() {
    local file_path="$1"
    local content="$2"
    local description="${3:-file}"
    
    echo "${content}" > "${file_path}"
    local char_count=${#content}
    log_success "${description} saved (${char_count} characters)"
}

# Read file with error handling
read_file() {
    local file_path="$1"
    local description="${2:-file}"
    
    if [[ ! -f "${file_path}" ]]; then
        log_error "${description} not found: ${file_path}"
        return 1
    fi
    
    if [[ ! -s "${file_path}" ]]; then
        log_warning "${description} is empty: ${file_path}"
        return 1
    fi
    
    cat "${file_path}"
}

# Check if file exists and is readable
file_exists() {
    local file_path="$1"
    [[ -f "${file_path}" && -r "${file_path}" ]]
}

# Get file size in characters
get_file_size() {
    local file_path="$1"
    if file_exists "${file_path}"; then
        wc -c < "${file_path}" | tr -d ' '
    else
        echo "0"
    fi
}

# Count lines in file
count_lines() {
    local file_path="$1"
    if file_exists "${file_path}"; then
        wc -l < "${file_path}" | tr -d ' '
    else
        echo "0"
    fi
}

# Safely escape content for sed
escape_for_sed() {
    local content="$1"
    echo "${content}" | sed 's/[[\.*^$()+?{|]/\\&/g'
}

# Replace placeholder in template file
replace_placeholder() {
    local file_path="$1"
    local placeholder="$2"
    local replacement="$3"
    
    local escaped_replacement
    escaped_replacement=$(escape_for_sed "${replacement}")
    
    sed -i "s|${placeholder}|${escaped_replacement}|g" "${file_path}"
}

# Create file from template with multiple replacements
create_from_template() {
    local template_content="$1"
    local output_file="$2"
    shift 2
    
    # Write template to file
    echo "${template_content}" > "${output_file}"
    
    # Apply replacements (pairs of placeholder and value)
    while [[ $# -gt 1 ]]; do
        local placeholder="$1"
        local value="$2"
        replace_placeholder "${output_file}" "${placeholder}" "${value}"
        shift 2
    done
}

# Validate required files exist
validate_required_files() {
    local files=("$@")
    local missing_files=()
    
    for file in "${files[@]}"; do
        if ! file_exists "${file}"; then
            missing_files+=("${file}")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "Missing required files: ${missing_files[*]}"
        return 1
    fi
    
    log_success "All required files found"
    return 0
}

# Clean up temporary files (called automatically if TEMP_DIR is set)
cleanup_temp_files() {
    if [[ -n "${TEMP_DIR:-}" && -d "${TEMP_DIR}" ]]; then
        log_process "Cleaning up temporary files in ${TEMP_DIR}"
        rm -rf "${TEMP_DIR}"
        log_success "Temporary files cleaned up"
    fi
}

# Set up cleanup trap
setup_cleanup_trap() {
    trap cleanup_temp_files EXIT
}