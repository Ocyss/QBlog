FROM node:23-alpine AS base

RUN apk --no-cache add ca-certificates \
  && apk --no-cache add curl \
  && rm -rf /var/cache/apk/* \
  && update-ca-certificates

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app


COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

# RUN pnpm config -g set registry https://mirrors.huaweicloud.com/repository/npm/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile 

COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096
RUN pnpm run build


FROM base

COPY --from=base /app/.output /app/web

WORKDIR /app/web

EXPOSE 3000

CMD ["node", "server/index.mjs"]