import { FileUploader } from './components/FileUploader';
import { FileDownloader } from './components/FileDownloader';

function App() {
  return (
    <div className="app">
      <header>
        <h1>File Upload / Download</h1>
        <p>대용량 파일을 청크 단위로 S3에 업로드/다운로드합니다</p>
      </header>

      <main>
        <section className="section">
          <h2>업로드</h2>
          <FileUploader />
        </section>

        <section className="section">
          <h2>다운로드</h2>
          <FileDownloader />
        </section>
      </main>
    </div>
  );
}

export default App;
