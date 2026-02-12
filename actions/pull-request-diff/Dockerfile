FROM node:22-slim
LABEL org.opencontainers.image.source=https://github.com/jonparker/wing-github-action
LABEL org.opencontainers.image.description="Deploy Wing Apps with Github Actions"
LABEL org.opencontainers.image.licenses=MIT

RUN apt-get update -y && apt-get install -y unzip curl

ENV TF_PLUGIN_CACHE_DIR="/root/.terraform.d/plugin-cache"
# Upgraded to 1.7.7 (BUSL 1.1) for nodejs22.x Lambda runtime support
ENV TERRAFORM_VERSION="1.7.7"
RUN mkdir -p ${TF_PLUGIN_CACHE_DIR}

# Install Terraform
RUN curl -LOk https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
  mkdir -p /usr/local/bin/tf/versions/${TERRAFORM_VERSION} && \
  unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /usr/local/bin/tf/versions/${TERRAFORM_VERSION} && \
  ln -s /usr/local/bin/tf/versions/${TERRAFORM_VERSION}/terraform /usr/local/bin/terraform

RUN mkdir /action
COPY ./dist /action/dist
COPY ./platforms /action/platforms

ENTRYPOINT ["node", "/action/dist/index.js"]
