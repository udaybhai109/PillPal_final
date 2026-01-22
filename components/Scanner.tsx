import React, { useRef, useState, useEffect } from 'react';

interface ScannerProps {
  onScan: (base64: string) => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        setIsProcessing(true);
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
        
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        onScan(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        onScan(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    startCamera();
    const videoElement = videoRef.current;
    return () => {
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#061111] z-[150] flex flex-col animate-in fade-in duration-300">
      <div className="p-6 flex justify-between items-center bg-[#061111]/80 backdrop-blur-md text-white border-b border-teal-900/50">
        <button onClick={onCancel} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
        <h2 className="text-sm font-black brand-font uppercase tracking-widest text-teal-400">Prescription Scan</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover transition-opacity duration-500 ${!streamActive ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {streamActive && <div className="scan-line"></div>}
        
        <div className="absolute inset-0 border-[30px] border-[#061111]/40 pointer-events-none">
          <div className="w-full h-full border-2 border-teal-500/30 rounded-3xl relative">
             <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-teal-400 rounded-tl-xl"></div>
             <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-teal-400 rounded-tr-xl"></div>
             <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-teal-400 rounded-bl-xl"></div>
             <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-teal-400 rounded-br-xl"></div>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-[#061111]/90 flex flex-col items-center justify-center text-white z-50">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-black brand-font tracking-tight">Processing Matrix</p>
            <p className="text-teal-600 text-[10px] font-bold uppercase tracking-widest mt-2">Extracting Clinical Data</p>
          </div>
        )}
      </div>

      <div className="p-10 bg-[#061111] flex flex-col items-center gap-8">
        <button 
          onClick={captureImage}
          disabled={!streamActive || isProcessing}
          className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center active:scale-90 transition-all disabled:opacity-20 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <div className="w-16 h-16 border-4 border-[#061111] rounded-[1.5rem] flex items-center justify-center">
             <i className="fa-solid fa-camera text-[#061111] text-xl"></i>
          </div>
        </button>
        
        <label className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer flex items-center gap-3 hover:text-white transition-colors">
          <i className="fa-solid fa-cloud-arrow-up text-sm"></i>
          Upload from Archives
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default Scanner;
