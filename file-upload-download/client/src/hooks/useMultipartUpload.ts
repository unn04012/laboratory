import { useState, useCallback, useRef } from 'react';

const PART_SIZE = 5 * 1024 * 1024; // 5MB (S3 최소 파트 크기)
const CONCURRENT_UPLOADS = 5; // 동시 업로드 개수

interface UploadPart {
  partNumber: number;
  etag: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'completed' | 'error';
  progress: number; // 0 ~ 100
  completedParts: number;
  totalParts: number;
  error: string | null;
}

interface InitiateResponse {
  uploadId: string;
  fileKey: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  partNumber: number;
}

// 단일 파트 업로드 함수
async function uploadSinglePart(
  file: File,
  partNumber: number,
  fileKey: string,
  uploadId: string,
): Promise<UploadPart> {
  const start = (partNumber - 1) * PART_SIZE;
  const end = Math.min(start + PART_SIZE, file.size);
  const chunk = file.slice(start, end);

  // Presigned URL 요청
  const urlRes = await fetch(
    `/api/files/multipart/upload-url?fileKey=${encodeURIComponent(fileKey)}&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`,
  );

  if (!urlRes.ok) {
    throw new Error(`파트 ${partNumber} URL 요청 실패`);
  }

  const { uploadUrl }: UploadUrlResponse = await urlRes.json();

  // S3에 직접 업로드
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    body: chunk,
  });

  if (!uploadRes.ok) {
    throw new Error(`파트 ${partNumber} 업로드 실패`);
  }

  const etag = uploadRes.headers.get('ETag');
  if (!etag) {
    throw new Error(`파트 ${partNumber} ETag 없음`);
  }

  return { partNumber, etag: etag.replace(/"/g, '') };
}

export function useMultipartUpload() {
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    completedParts: 0,
    totalParts: 0,
    error: null,
  });

  const completedCountRef = useRef(0);

  const upload = useCallback(async (file: File) => {
    const totalParts = Math.ceil(file.size / PART_SIZE);
    completedCountRef.current = 0;

    setState({
      status: 'uploading',
      progress: 0,
      completedParts: 0,
      totalParts,
      error: null,
    });

    try {
      // 1. Initiate - 업로드 시작
      const initiateRes = await fetch('/api/files/multipart/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
        }),
      });

      if (!initiateRes.ok) {
        throw new Error('업로드 시작 실패');
      }

      const { uploadId, fileKey }: InitiateResponse = await initiateRes.json();

      // 2-3. 병렬 업로드 (CONCURRENT_UPLOADS 개씩)
      const parts: UploadPart[] = [];
      const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1);

      // 동시성 제한을 위한 청크 분할
      for (let i = 0; i < partNumbers.length; i += CONCURRENT_UPLOADS) {
        const batch = partNumbers.slice(i, i + CONCURRENT_UPLOADS);

        const batchResults = await Promise.all(
          batch.map(async (partNumber) => {
            const result = await uploadSinglePart(file, partNumber, fileKey, uploadId);

            // 진행률 업데이트
            completedCountRef.current += 1;
            setState((prev) => ({
              ...prev,
              completedParts: completedCountRef.current,
              progress: Math.round((completedCountRef.current / totalParts) * 100),
            }));

            return result;
          }),
        );

        parts.push(...batchResults);
      }

      // partNumber 순서대로 정렬 (S3 Complete 요청 시 필요)
      parts.sort((a, b) => a.partNumber - b.partNumber);

      // 4. Complete - 업로드 완료
      const completeRes = await fetch('/api/files/multipart/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey, uploadId, parts }),
      });

      if (!completeRes.ok) {
        throw new Error('업로드 완료 요청 실패');
      }

      setState({
        status: 'completed',
        progress: 100,
        completedParts: totalParts,
        totalParts,
        error: null,
      });

      return { success: true, fileKey };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';

      setState((prev) => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  const reset = useCallback(() => {
    completedCountRef.current = 0;
    setState({
      status: 'idle',
      progress: 0,
      completedParts: 0,
      totalParts: 0,
      error: null,
    });
  }, []);

  return { ...state, upload, reset };
}
