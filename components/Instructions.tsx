import React from 'react';

const PhotoIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Instructions: React.FC = () => {
  const tips = [
    "Use a recent, high-quality color photo.",
    "Ensure your head is centered and facing the camera directly.",
    "Use a neutral facial expression or a natural smile with both eyes open.",
    "Good, even lighting is crucial. Avoid shadows on your face or background.",
    "A plain, light-colored background works best for the AI.",
    "Do not wear glasses, hats, or headphones."
  ];

  return (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-border">
      <div className="flex items-center mb-4">
        <PhotoIcon />
        <h2 className="text-xl font-bold text-brand-text-primary">Photo Requirements & Tips</h2>
      </div>
      <ul className="space-y-3 text-brand-text-secondary">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 mr-2 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Instructions;
