import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PARTNER_NAME, PROPOSAL_QUESTION, QUESTIONS, DATE_DISPLAY, TIME_DISPLAY, LOCATION_DISPLAY, SUCCESS_MESSAGE, SUB_SUCCESS_MESSAGE, NO_BUTTON_PHRASES, LOVE_LETTER_CONTENT } from './constants';
import { AppStep, Question } from './types';
import { Heart, ArrowRight, Sparkles, Calendar, MapPin, Clock, Volume2, VolumeX } from './components/Icons';
import { Button } from './components/Button';

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

const IntroStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-6"
  >
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="p-4 bg-rose-50 rounded-full text-rose-500"
    >
      <Heart className="w-8 h-8 fill-rose-500/20" />
    </motion.div>
    
    <div className="space-y-2">
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-neutral-400 text-sm font-medium tracking-wide uppercase"
      >
        Para ti
      </motion.p>
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-4xl md:text-5xl font-semibold text-neutral-900 tracking-tight"
      >
        Hola, {PARTNER_NAME}
      </motion.h1>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      <Button onClick={onNext} icon={<ArrowRight className="w-4 h-4" />}>
        Abrir
      </Button>
    </motion.div>
  </motion.div>
);

const QuizStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shaking, setShaking] = useState<number | null>(null);

  const currentQuestion = QUESTIONS[currentIndex];

  const handleAnswer = (selectedOption: string) => {
    // Basic validation
    const isCorrect = currentQuestion.options 
      ? selectedOption === currentQuestion.answer
      : true;

    if (!isCorrect) {
      setShaking(Date.now());
      return;
    }

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 max-w-lg mx-auto w-full"
    >
      <div className="w-full flex justify-center gap-1.5 mb-12">
        {QUESTIONS.map((_, idx) => (
          <motion.div 
            key={idx}
            initial={false}
            animate={{ 
              backgroundColor: idx <= currentIndex ? '#F43F5E' : '#E5E5E5',
              scale: idx === currentIndex ? 1.2 : 1
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center space-y-10 w-full"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-500 text-xl font-bold">
              ?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="w-full max-w-sm space-y-3">
            {currentQuestion.options ? (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <motion.div
                    key={idx}
                    animate={shaking && option !== currentQuestion.answer ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Button 
                      onClick={() => handleAnswer(option)}
                      variant="secondary"
                      className={`w-full py-4 text-lg border-neutral-200 hover:border-rose-200 hover:text-rose-600 ${
                         shaking && option !== currentQuestion.answer ? 'bg-red-50 text-red-500 border-red-200' : ''
                      }`}
                    >
                      {option}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Button 
                onClick={() => handleAnswer(currentQuestion.answer)} 
                className="w-full py-4 text-lg"
              >
                {currentQuestion.answer}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const ProposalStep: React.FC<{ onYes: () => void }> = ({ onYes }) => {
  const [noCount, setNoCount] = useState(0);

  // Yes button grows with each "No" click - Increased limit to prevent excessive scaling
  const yesScale = Math.min(1 + (noCount * 0.12), 2.5); 
  
  // Show No button as long as there are phrases left
  const showNoButton = noCount < NO_BUTTON_PHRASES.length;
  
  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[90vh] p-4 text-center w-full max-w-2xl mx-auto overflow-hidden"
    >
      <div className="mb-8 space-y-4 z-0">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block p-4 bg-rose-100 rounded-full text-rose-500 mb-4"
        >
          <Heart className="w-10 h-10 fill-rose-500" />
        </motion.div>
        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
          {PROPOSAL_QUESTION}
        </h2>
        <p className="text-neutral-500">Tengo una pregunta para ti.</p>
      </div>

      <div className="relative w-full flex-1 min-h-[400px] flex flex-col items-center justify-start pt-6 gap-8">
        {/* YES BUTTON - Grows */}
        <motion.div
          animate={{ scale: yesScale }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="z-20 origin-center"
        >
          <Button 
            onClick={onYes} 
            className="text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 shadow-xl bg-rose-500 hover:bg-rose-600 text-white min-w-[160px] md:min-w-[200px]"
            icon={<Sparkles className="w-5 h-5 md:w-6 md:h-6" />}
          >
            ¡Sí, claro que sí!
          </Button>
        </motion.div>

        {/* NO BUTTON - Changes text then disappears */}
        <AnimatePresence>
          {showNoButton && (
            <motion.div
              key="no-button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <Button 
                variant="danger" 
                onClick={handleNoClick}
                className="whitespace-normal max-w-[200px] text-sm md:text-lg bg-neutral-200/80 hover:bg-neutral-300 text-neutral-600 px-4 py-2"
              >
                {NO_BUTTON_PHRASES[noCount]}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SuccessStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-8 max-w-md mx-auto"
  >
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <motion.div 
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             className="text-rose-500"
          >
             <Heart className="w-20 h-20 fill-rose-500 shadow-rose-200 drop-shadow-2xl" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </motion.div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-neutral-900">{SUCCESS_MESSAGE}</h2>
      <p className="text-neutral-500 text-lg">{SUB_SUCCESS_MESSAGE}</p>
    </div>

    <div className="w-full bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 space-y-4">
      <div className="flex items-center gap-4 text-left">
        <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-semibold uppercase">Fecha</p>
          <p className="text-neutral-900 font-medium">{DATE_DISPLAY}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-left">
        <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-semibold uppercase">Hora</p>
          <p className="text-neutral-900 font-medium">{TIME_DISPLAY}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-left">
        <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-semibold uppercase">Lugar</p>
          <p className="text-neutral-900 font-medium">{LOCATION_DISPLAY}</p>
        </div>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="pt-4"
    >
        <Button onClick={onNext} variant="secondary" className="w-full text-rose-500 border-rose-100">
            Leer carta <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
    </motion.div>
  </motion.div>
);

const LetterStep: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Initial setup for canvas resolution
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Get the display size
            const rect = canvas.getBoundingClientRect();
            // Set the resolution to match (for high DPI)
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            
            // Scale context
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                ctx.strokeStyle = '#F43F5E'; // Rose 500
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
            }
        }
    }, []);

    const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = (event as React.MouseEvent).clientX;
            clientY = (event as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent scrolling on touch
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;
        
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.stroke();
            if (!hasSigned) setHasSigned(true);
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };
    
    const handleClear = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setHasSigned(false);
            }
        }
    };

    const handleSendWhatsapp = () => {
        const text = `¡Hola mi amor! 💖\n\nSí quiero ser tu San Valentín.\n\nYa leí tu carta y firmé nuestra promesa. Te amo muchísimo. ✨`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const handleDownloadPdf = async () => {
        const originalElement = document.getElementById('letter-content');
        if (!originalElement) return;

        setIsDownloading(true);

        try {
            // 1. Create a container for the clone to ensure it renders fully off-screen
            // This bypasses mobile viewport limitations
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '0';
            // Set a fixed width for consistent high-quality PDF output (like a desktop view)
            container.style.width = '800px'; 
            document.body.appendChild(container);

            // 2. Clone the element
            const clone = originalElement.cloneNode(true) as HTMLElement;
            
            // 3. Apply specific styles for the PDF version
            clone.style.background = '#ffffff';
            clone.style.padding = '60px'; // More padding for document look
            clone.style.borderRadius = '0'; // Sharp corners for PDF
            clone.style.boxShadow = 'none';
            clone.style.width = '100%';
            clone.style.height = 'auto'; // Ensure full height is captured
            clone.style.overflow = 'visible';

            // 4. Handle Canvas (Signature) manually
            // Cloning a node DOES NOT clone the canvas drawing context/data
            const originalCanvas = canvasRef.current;
            const clonedCanvas = clone.querySelector('canvas');
            
            if (originalCanvas && clonedCanvas) {
                // Match dimensions and copy the image data
                clonedCanvas.width = originalCanvas.width;
                clonedCanvas.height = originalCanvas.height;
                const ctx = clonedCanvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(originalCanvas, 0, 0);
                }
            }

            container.appendChild(clone);

            // 5. Generate Image using html2canvas
            // Wait a moment for DOM to settle
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(clone, {
                scale: 2, // High resolution (2x)
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 800 // Trick html2canvas into thinking the window is wide
            });

            // 6. Cleanup
            document.body.removeChild(container);

            // 7. Generate PDF
            const imgData = canvas.toDataURL('image/png');
            
            // Calculate dimensions to fit width, but allow height to expand (custom PDF size)
            // or fit to A4. Let's make a custom size PDF that fits the content perfectly.
            const pdfWidth = 210; // A4 width in mm
            const imgProps = new jsPDF().getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Create PDF with dynamic height based on content
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: [pdfWidth, pdfHeight]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Nuestra_Promesa.pdf');

        } catch (error) {
            console.error('PDF generation failed', error);
            alert('No se pudo generar el PDF. Por favor intenta de nuevo.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mx-auto p-4 pb-32 space-y-6 text-left"
        >
            <div id="letter-content" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
                 {/* Decorative Header */}
                <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-4">
                    <div className="p-2 bg-rose-50 rounded-full">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    </div>
                    <h3 className="font-semibold text-neutral-800">Para mi amor</h3>
                </div>

                {/* Content */}
                <div className="space-y-4 text-neutral-600 leading-relaxed font-light text-sm md:text-base">
                    {LOVE_LETTER_CONTENT.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>

                {/* Signature Section */}
                <div className="pt-8 space-y-4 break-inside-avoid">
                    <p className="font-medium text-neutral-900 text-sm uppercase tracking-wide">Firma aquí abajo</p>
                    <div className="relative w-full h-40 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200 overflow-hidden touch-none">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        {!hasSigned && (
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-neutral-300">
                                 <span className="text-sm">Dibuja tu firma</span>
                             </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-xs text-neutral-400 italic">Desliza fuera del cuadro para bajar</span>
                         <button onClick={handleClear} className="text-xs text-neutral-400 hover:text-neutral-600 underline">Borrar firma</button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: hasSigned ? 1 : 0.5 }}
                className="fixed bottom-0 left-0 w-full p-4 pb-8 bg-white/90 backdrop-blur-md border-t border-neutral-100 flex flex-col gap-3 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
            >
                <Button 
                    onClick={handleSendWhatsapp}
                    disabled={!hasSigned}
                    className="w-full shadow-lg py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                   Confirmar por WhatsApp 💬
                </Button>
                
                <Button 
                    onClick={handleDownloadPdf}
                    disabled={!hasSigned || isDownloading}
                    variant="secondary"
                    className="w-full py-3.5 text-neutral-600"
                >
                   {isDownloading ? 'Generando PDF...' : 'Descargar Carta (PDF) 📄'}
                </Button>
            </motion.div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// Main App Component
// -----------------------------------------------------------------------------

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INTRO);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioSrc] = useState<string>(`${import.meta.env.BASE_URL}bg-music.mp3`);
  const [hasAudioError, setHasAudioError] = useState(false);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => {
            console.log("Audio play failed (user interaction needed or file missing)", e);
            // If it's not a missing file error (e.g. just autoplay block), we don't set hasAudioError yet
        });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleAudioError = () => {
      console.warn("Audio file not found or unsupported.");
      setHasAudioError(true);
      setIsMusicPlaying(false);
  };


  const handleNext = () => {
    if (step === AppStep.INTRO) {
      startMusic();
      setStep(AppStep.QUIZ);
    }
    else if (step === AppStep.QUIZ) setStep(AppStep.PROPOSAL);
    else if (step === AppStep.SUCCESS) setStep(AppStep.LETTER);
  };

  const handleYes = () => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    setStep(AppStep.SUCCESS);
  };

  return (
    // Updated container: uses h-[100dvh] for mobile browser compatibility and proper internal scrolling
    <div className="fixed inset-0 w-full bg-[#FAFAFA] text-neutral-900 flex flex-col items-center overflow-x-hidden overflow-y-auto supports-[height:100dvh]:h-dvh h-screen">
      
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        loop 
        src={audioSrc} 
        onError={handleAudioError}
      />
      
      {/* Music Control */}
      <button 
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 p-3 backdrop-blur-sm rounded-full shadow-sm transition-colors bg-white/80 text-neutral-400 hover:text-rose-500"
        title="Toggle Music"
      >
        {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Background decorations - Fixed position to stay in background while scrolling */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          {step === AppStep.INTRO && (
            <IntroStep key="intro" onNext={handleNext} />
          )}
          {step === AppStep.QUIZ && (
            <QuizStep key="quiz" onNext={handleNext} />
          )}
          {step === AppStep.PROPOSAL && (
            <ProposalStep key="proposal" onYes={handleYes} />
          )}
          {step === AppStep.SUCCESS && (
            <SuccessStep key="success" onNext={handleNext} />
          )}
          {step === AppStep.LETTER && (
            <LetterStep key="letter" />
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Progress indicators - Hide during letter step to avoid clutter */}
      {step !== AppStep.LETTER && (
        <div className="fixed bottom-6 left-0 w-full flex justify-center gap-2 pointer-events-none z-0 opacity-50">
          {[AppStep.INTRO, AppStep.QUIZ, AppStep.PROPOSAL, AppStep.SUCCESS, AppStep.LETTER].map((s, i) => (
              <div 
                  key={s}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    Object.values(AppStep).indexOf(step) >= i ? 'w-6 bg-rose-400' : 'w-2 bg-neutral-200'
                  }`} 
              />
          ))}
        </div>
      )}
    </div>
  );
}