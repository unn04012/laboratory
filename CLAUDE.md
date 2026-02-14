# Laboratory

다양한 기술 실험을 위한 모노레포

## 프로젝트 구조

```
laboratory/
├── pulumi-components/       # 공통 Pulumi 컴포넌트 (@lab/pulumi-components)
├── file-upload-download/    # 대용량 파일 업로드/다운로드
├── nestjs-laboratory/       # NestJS 실험
├── express-laboratory/      # Express 실험
├── nestjs-swagger/          # Swagger 관련 실험
├── grpc-http-benchmark/     # gRPC vs HTTP 벤치마크
├── mcp/                     # MCP (Model Context Protocol) 실험
├── class-validator/         # class-validator 실험
├── design-pattern/          # 디자인 패턴
└── event-driven-example-express/
```

## npm workspace

root package.json에서 workspace 관리:
- `pulumi-components`: 공통 인프라 컴포넌트
- `file-upload-download/*`: 대용량 파일 처리 (client, server, infra)

## 공통 인프라 (pulumi-components/)

재사용 가능한 Pulumi 컴포넌트:
- `S3Bucket`: S3 버킷 (CORS, Versioning, Lifecycle)
- `LambdaFunction`: Lambda 함수 (IAM Role 자동 생성)

사용법:
```typescript
import { S3Bucket, LambdaFunction } from "@lab/pulumi-components";
```

의존성 추가:
```json
"@lab/pulumi-components": "file:../../pulumi-components"
```

## 새 기능 추가 시 폴더 구조

```
feature-name/
├── client/     # 프론트엔드
├── server/     # 백엔드 API
└── infra/      # Pulumi 인프라 (pulumi-components 참조)
    ├── Pulumi.yaml
    ├── Pulumi.dev.yaml
    └── index.ts
```

## 명령어

```bash
# 전체 의존성 설치
npm install

# pulumi-components 빌드 (infra 사용 전 필수)
cd pulumi-components && npm run build

# 특정 프로젝트 인프라 배포
cd <project>/infra && pulumi up
```
