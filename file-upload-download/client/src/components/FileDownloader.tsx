import { useState } from 'react';
import { useDownload } from '../hooks/useDownload';

export function FileDownloader() {
  const [fileKey, setFileKey] = useState('');
  const { status, error, download, reset } = useDownload();

  const handleDownload = async () => {
    if (!fileKey.trim()) return;
    await download(fileKey.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDownload();
    }
  };

  return (
    <div className="downloader">
      <div className="input-group">
        <input
          type="text"
          placeholder="파일 키를 입력하세요 (예: uploads/abc123.pdf)"
          value={fileKey}
          onChange={(e) => {
            setFileKey(e.target.value);
            if (status !== 'idle') reset();
          }}
          onKeyDown={handleKeyDown}
          disabled={status === 'loading' || status === 'downloading'}
        />
        <button
          className="btn primary"
          onClick={handleDownload}
          disabled={!fileKey.trim() || status === 'loading' || status === 'downloading'}
        >
          {status === 'loading' || status === 'downloading' ? '다운로드 중...' : '다운로드'}
        </button>
      </div>

      {status === 'completed' && (
        <div className="message success">다운로드가 시작되었습니다!</div>
      )}

      {status === 'error' && <div className="message error">{error}</div>}
    </div>
  );
}
