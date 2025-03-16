import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';

export function BasketballLoader() {
  const translations = useTranslations();
  const [messageIndex, setMessageIndex] = useState(0);

  // Define loading messages
  const messages = [
    translations('loading.findingSimilarPlayers'),
    translations('loading.analyzingStats'),
    translations('loading.calculatingSkills'),
    translations('loading.comparingStyles'),
    translations('loading.almostDone')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 sm:px-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-8 max-w-md w-full shadow-xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="relative h-20 sm:h-24 w-20 sm:w-24 mb-4 sm:mb-6">
            {/* Basketball */}
            <div className="absolute w-14 sm:w-16 h-14 sm:h-16 bg-orange-500 rounded-full left-3 sm:left-4 animate-basketball">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 border-b-2 border-black"></div>
                <div className="absolute top-1/2 left-0 w-full h-1/2 border-t-2 border-black"></div>
                <div className="absolute top-0 left-1/2 h-full w-0 border-l-2 border-black"></div>
              </div>
            </div>
            {/* Shadow */}
            <div className="absolute bottom-0 left-3 sm:left-4 w-14 sm:w-16 h-2 bg-black/20 rounded-full animate-shadow"></div>
          </div>

          <p className="text-base sm:text-lg font-medium text-center mb-3 sm:mb-4">{messages[messageIndex]}</p>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
            <div className="bg-primary h-2.5 rounded-full animate-progress"></div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            {translations('loading.pleaseWait')}
          </p>
        </div>
      </div>
    </div>
  );
}
