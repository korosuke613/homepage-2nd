FROM node:22@sha256:c8abd8da9cfddd2dfd2d5aa9ea2e54f9f70d3968ecf81bf5c2422594fa13fa83

ARG TZ
ENV TZ="$TZ"

# Fastly CDN のミラーに変更
RUN echo "deb http://cdn-fastly.deb.debian.org/debian stable main" > /etc/apt/sources.list && \
    echo "deb http://cdn-fastly.deb.debian.org/debian-security stable-security main" >> /etc/apt/sources.list && \
    echo "deb http://cdn-fastly.deb.debian.org/debian-security-debug stable-security-debug main" >> /etc/apt/sources.list

# Install basic development tools and Squid proxy
RUN apt update && apt install -y less \
  git \
  procps \
  sudo \
  fzf \
  zsh \
  man-db \
  unzip \
  gnupg2 \
  gh \
  squid \
  iptables \
  ipset \
  iproute2 \
  dnsutils \
  aggregate \
  jq \
  curl \
  wget

# Ensure default node user has access to /usr/local/share
RUN mkdir -p /usr/local/share/npm-global && \
  chown -R node:node /usr/local/share

ARG USERNAME=node

# Persist bash history.
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/node/.claude && \
  chown -R node:node /workspace /home/node/.claude

WORKDIR /workspace

RUN ARCH=$(dpkg --print-architecture) && \
  wget "https://github.com/dandavison/delta/releases/download/0.18.2/git-delta_0.18.2_${ARCH}.deb" && \
  sudo dpkg -i "git-delta_0.18.2_${ARCH}.deb" && \
  rm "git-delta_0.18.2_${ARCH}.deb"

# Set up non-root user
USER node

# Install global packages
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh

# Default powerline10k theme
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.2.0/zsh-in-docker.sh)" -- \
  -p git \
  -p fzf \
  -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
  -a "source /usr/share/doc/fzf/examples/completion.zsh" \
  -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  -a "[ -f /etc/proxy.conf ] && source /etc/proxy.conf" \
  -x

# Install Claude
RUN npm install -g @anthropic-ai/claude-code

# Set proxy environment variables (will be overwritten by init script)
ENV http_proxy=""
ENV https_proxy=""
ENV HTTP_PROXY=""
ENV HTTPS_PROXY=""
ENV no_proxy="localhost,127.0.0.1,::1"
ENV NO_PROXY="localhost,127.0.0.1,::1"

# Copy and set up Squid firewall scripts
COPY init-firewall-squid.sh /usr/local/bin/
COPY squid.conf /usr/local/bin/
USER root

# Set up Squid directories and permissions
RUN mkdir -p /var/log/squid /var/spool/squid && \
  chown -R proxy:proxy /var/log/squid /var/spool/squid && \
  chmod +x /usr/local/bin/init-firewall-squid.sh && \
  echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall-squid.sh" > /etc/sudoers.d/node-squid && \
  chmod 0440 /etc/sudoers.d/node-squid

USER node