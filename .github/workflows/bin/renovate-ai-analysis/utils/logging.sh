#!/bin/bash
set -euo pipefail

# Logging utilities for Renovate AI Analysis workflow
# Provides consistent emoji-based logging functions

# Color codes for terminal output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Log info message with emoji
log_info() {
    local message="$1"
    echo -e "${BLUE}ℹ️  ${message}${NC}"
}

# Log success message with emoji
log_success() {
    local message="$1"
    echo -e "${GREEN}✅ ${message}${NC}"
}

# Log warning message with emoji
log_warning() {
    local message="$1"
    echo -e "${YELLOW}⚠️  ${message}${NC}"
}

# Log error message with emoji
log_error() {
    local message="$1"
    echo -e "${RED}❌ ${message}${NC}" >&2
}

# Log step start with emoji
log_step() {
    local message="$1"
    echo -e "${BLUE}🔍 ${message}${NC}"
}

# Log completion with emoji
log_complete() {
    local message="$1"
    echo -e "${GREEN}🎯 ${message}${NC}"
}

# Log processing with emoji
log_process() {
    local message="$1"
    echo -e "${BLUE}💾 ${message}${NC}"
}

# Log detection/analysis with emoji
log_detect() {
    local message="$1"
    echo -e "${BLUE}🔍 ${message}${NC}"
}

# Log file operations with emoji
log_file() {
    local message="$1"
    echo -e "${BLUE}📁 ${message}${NC}"
}

# Log package operations with emoji
log_package() {
    local message="$1"
    echo -e "${BLUE}📦 ${message}${NC}"
}

# Log README operations with emoji
log_readme() {
    local message="$1"
    echo -e "${BLUE}📖 ${message}${NC}"
}

# Log comment operations with emoji
log_comment() {
    local message="$1"
    echo -e "${BLUE}💬 ${message}${NC}"
}

# Log AI operations with emoji
log_ai() {
    local message="$1"
    echo -e "${BLUE}🤖 ${message}${NC}"
}

# Log security-related messages with emoji
log_security() {
    local message="$1"
    echo -e "${RED}🔒 ${message}${NC}"
}

# Log major updates with emoji
log_major() {
    local message="$1"
    echo -e "${RED}🚨 ${message}${NC}"
}

# Log minor updates with emoji
log_minor() {
    local message="$1"
    echo -e "${YELLOW}⚠️  ${message}${NC}"
}

# Log patch updates with emoji
log_patch() {
    local message="$1"
    echo -e "${GREEN}✅ ${message}${NC}"
}

# Log dev dependency updates with emoji
log_dev() {
    local message="$1"
    echo -e "${BLUE}🔧 ${message}${NC}"
}

# Log unknown/questionable items with emoji
log_unknown() {
    local message="$1"
    echo -e "${YELLOW}❓ ${message}${NC}"
}

# Log celebration/completion with emoji
log_celebrate() {
    local message="$1"
    echo -e "${GREEN}🎉 ${message}${NC}"
}

# Log update operations with emoji
log_update() {
    local message="$1"
    echo -e "${BLUE}🔄 ${message}${NC}"
}

# Log creation operations with emoji
log_create() {
    local message="$1"
    echo -e "${BLUE}➕ ${message}${NC}"
}