import { useRef, useState, DragEvent } from "react";
import { useMultipartUpload } from "../hooks/useMultipartUpload";

export function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { status, progress, completedParts, totalParts, error, upload, reset } =
    useMultipartUpload();

  // 파일 선택 핸들러
  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      reset();
    }
  };

  // input 변경
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  // 드래그 앤 드롭
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0] || null;
    handleFileSelect(file);
  };

  // 업로드 시작
  const handleUpload = async () => {
    if (!selectedFile) return;
    await upload(selectedFile);
  };

  // 파일 크기 포맷
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="uploader">
      {/* 드래그 앤 드롭 영역 */}
      <div
        className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
        <div className="drop-zone-content">
          <span className="drop-icon">📁</span>
          <p>파일을 드래그하거나 클릭하여 선택</p>
        </div>
      </div>

      {/* 선택된 파일 정보 */}
      {selectedFile && (
        <div className="file-info">
          <p>
            <strong>파일명:</strong> {selectedFile.name}
          </p>
          <p>
            <strong>크기:</strong> {formatSize(selectedFile.size)}
          </p>
          <p>
            <strong>타입:</strong> {selectedFile.type || "알 수 없음"}
          </p>
        </div>
      )}

      {/* 업로드 진행 상태 */}
      {status === "uploading" && (
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-text">
            {progress}% - 파트 {completedParts} / {totalParts} 완료 (동시 5개 업로드)
          </p>
        </div>
      )}

      {/* 완료 메시지 */}
      {status === "completed" && (
        <div className="message success">✅ 업로드 완료!</div>
      )}

      {/* 에러 메시지 */}
      {status === "error" && <div className="message error">❌ {error}</div>}

      {/* 버튼 */}
      <div className="actions">
        <button
          className="btn primary"
          onClick={handleUpload}
          disabled={!selectedFile || status === "uploading"}
        >
          {status === "uploading" ? "업로드 중..." : "업로드"}
        </button>

        {(status === "completed" || status === "error") && (
          <button
            className="btn secondary"
            onClick={() => {
              setSelectedFile(null);
              reset();
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          >
            다시 선택
          </button>
        )}
      </div>
    </div>
  );
}
