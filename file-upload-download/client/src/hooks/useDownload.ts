import { useState, useCallback } from 'react';

interface DownloadState {
  status: 'idle' | 'loading' | 'downloading' | 'completed' | 'error';
  error: string | null;
}

interface DownloadUrlResponse {
  downloadUrl: string;
}

export function useDownload() {
  const [state, setState] = useState<DownloadState>({
    status: 'idle',
    error: null,
  });

  const download = useCallback(async (fileKey: string) => {
    setState({ status: 'loading', error: null });

    try {
      // 1. Presigned Download URL 요청
      const res = await fetch(`/api/files/download-url/${encodeURIComponent(fileKey)}`);

      if (!res.ok) {
        throw new Error('다운로드 URL 요청 실패');
      }

      const { downloadUrl }: DownloadUrlResponse = await res.json();

      setState({ status: 'downloading', error: null });

      // 2. 파일 다운로드 (브라우저가 처리)
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileKey.split('/').pop() || 'download'; // 파일명 추출
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setState({ status: 'completed', error: null });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';

      setState({ status: 'error', error: errorMessage });

      return { success: false, error: errorMessage };
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', error: null });
  }, []);

  return { ...state, download, reset };
}
