import React, { useState } from 'react';
import Instructions from './components/Instructions';
import FileUpload from './components/FileUpload';
import PhotoDisplay from './components/PhotoDisplay';
import { fileToBase64, generatePassportPhoto } from './services/geminiService';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageB64, setOriginalImageB64] = useState<string | null>(null);
  const [processedImageB64, setProcessedImageB64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setOriginalImageFile(file);
    setError(null);
    setProcessedImageB64(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageB64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateClick = async () => {
    if (!originalImageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImageB64(null);

    try {
      const { base64, mimeType } = await fileToBase64(originalImageFile);
      const resultB64 = await generatePassportPhoto(base64, mimeType);
      setProcessedImageB64(resultB64);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!processedImageB64) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${processedImageB64}`;
    link.download = 'passport-photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImageFile(null);
    setOriginalImageB64(null);
    setProcessedImageB64(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            AI Passport Photo Generator
          </h1>
          <p className="mt-2 text-lg text-brand-text-secondary">
            Create compliant US passport, visa, or green card photos in seconds.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <Instructions />
            <FileUpload onImageSelect={handleImageSelect} disabled={isLoading} />
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerateClick}
                disabled={!originalImageFile || isLoading}
                className="w-full flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                    </>
                ) : (
                    "Generate Passport Photo"
                )}
              </button>
              {processedImageB64 && (
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-green-500 text-base font-medium rounded-md text-green-300 bg-green-900/30 hover:bg-green-800/50 transition-colors"
                >
                  Download Photo
                </button>
              )}
               {(originalImageFile || processedImageB64 || error) && !isLoading && (
                 <button onClick={handleReset} className="w-full sm:w-auto px-4 py-3 text-sm font-medium text-brand-text-secondary hover:bg-brand-surface rounded-md transition-colors">
                    Start Over
                 </button>
               )}
            </div>
          </div>
          
          <div className="lg:mt-0">
             <PhotoDisplay 
                originalPhoto={originalImageB64}
                processedPhoto={processedImageB64}
                isLoading={isLoading}
             />
          </div>
        </main>
        <footer className="text-center mt-12 text-sm text-brand-text-secondary/60">
            <p>&copy; {new Date().getFullYear()} AI Passport Photo Generator. All rights reserved.</p>
            <p className="mt-1">Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
