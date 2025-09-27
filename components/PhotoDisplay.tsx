import React from 'react';
import Spinner from './Spinner';

interface PhotoDisplayProps {
  originalPhoto: string | null;
  processedPhoto: string | null;
  isLoading: boolean;
}

const PhotoBox: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <div className="flex-1 flex flex-col items-center bg-brand-surface p-4 rounded-lg border border-brand-border min-w-0">
    <h3 className="text-lg font-semibold text-brand-text-secondary mb-4">{title}</h3>
    <div className="w-full aspect-square bg-brand-dark rounded-md flex items-center justify-center overflow-hidden">
        {children}
    </div>
  </div>
);

const PhotoDisplay: React.FC<PhotoDisplayProps> = ({ originalPhoto, processedPhoto, isLoading }) => {
  const handleDownload = () => {
    if (!processedPhoto) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${processedPhoto}`;
    link.download = 'passport-photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      <PhotoBox title="Original Photo">
        {originalPhoto ? (
            <img src={originalPhoto} alt="Original upload" className="object-contain w-full h-full" />
        ) : (
            <div className="text-center text-brand-text-secondary p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">Upload a photo to begin</p>
            </div>
        )}
      </PhotoBox>
      <PhotoBox title="Passport Photo">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Spinner />
            <p className="mt-4 text-brand-text-secondary">Generating your photo...</p>
            <p className="text-sm text-brand-text-secondary/70">This may take a moment.</p>
          </div>
        ) : processedPhoto ? (
          <img src={`data:image/jpeg;base64,${processedPhoto}`} alt="Generated passport" className="object-contain w-full h-full" />
        ) : (
          <div className="text-center text-brand-text-secondary p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.789-2.75 9.565M12 11c-3.517 0-6.789-1.009-9.565-2.75M12 11v9.565m0-9.565c3.517 0 6.789 1.009 9.565 2.75M12 11c-3.517 0-6.789-1.009-9.565-2.75M5.25 4.75A2.25 2.25 0 017.5 2.5h9A2.25 2.25 0 0118.75 4.75v9A2.25 2.25 0 0116.5 16h-3.75m-3.75 0H7.5A2.25 2.25 0 015.25 14.25v-9.75z" />
            </svg>
            <p className="mt-2 text-sm">Your AI-generated photo will appear here</p>
          </div>
        )}
      </PhotoBox>
    </div>
  );
};

export default PhotoDisplay;
