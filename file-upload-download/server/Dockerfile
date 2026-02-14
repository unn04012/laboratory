FROM public.ecr.aws/lambda/nodejs:18

WORKDIR ${LAMBDA_TASK_ROOT}

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 빌드된 파일 복사
COPY dist/ ./dist/

# Lambda 핸들러 지정
CMD ["dist/main.handler"]
