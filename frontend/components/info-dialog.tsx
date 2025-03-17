'use client';
import { useState, useEffect } from 'react';
import { HelpCircle, BarChart2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export function InfoDialog() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setShowTooltip(true);
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  const t = useTranslations('infoDialog');
  const params = useParams();
  const locale = params.locale as string;

  const formatWithLink = (translationKey: string, linkHref: string, linkText: string) => {
    const text = t(translationKey);

    if (text.includes(linkText)) {
      const parts = text.split(linkText);
      return (
        <>
          {parts[0]}
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            {linkText}
          </a>
          {parts[1]}
        </>
      );
    }

    return text;
  };

  return (
    <Dialog>
      <div className="fixed bottom-6 right-6 flex items-center">
        {showTooltip && (
          <div className="mr-3 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-md text-sm animate-fade-in">
            <p className="text-slate-700 dark:text-slate-300">
              {t('needHelp')} <span className="text-blue-600 dark:text-blue-400">{t('clickHere')}</span>
            </p>
          </div>
        )}
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full h-10 pl-3 pr-4 flex items-center gap-1 bg-white dark:bg-slate-800 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 border-blue-200 dark:border-blue-900"
            aria-label="Help and Information"
          >
            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{t('help')}</span>
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="how-to-use" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="how-to-use" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>{t('howToUse')}</span>
            </TabsTrigger>
            <TabsTrigger value="data-explanation" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>{t('understandingData')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="how-to-use" className="mt-4 text-slate-700 dark:text-slate-300 space-y-3">
            <p>{t('introduction')}</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>{t('steps.selectSeason')}</strong>
              </li>
              <li>
                <strong>{t('steps.selectPlayer')}</strong>
              </li>
              <li>
                {formatWithLink(
                  'steps.similarPlayers',
                  locale === 'es'
                    ? 'https://es.wikipedia.org/wiki/K_vecinos_m%C3%A1s_pr%C3%B3ximos'
                    : 'https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm',
                  locale === 'es' ? 'K-vecinos más próximos' : 'K-nearest neighbors algorithm'
                )}
              </li>
              <li>{t('steps.toggleViews')}</li>
              <li>{t('steps.radarChart')}</li>
              <li>{t('steps.backToSelection')}</li>
            </ol>
            <p className="text-sm italic mt-2">{t('tip')}</p>
          </TabsContent>

          <TabsContent value="data-explanation" className="mt-4 text-slate-700 dark:text-slate-300 space-y-3">
            <p>{t('modelExplanation')}</p>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{t('radarCategories.title')}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t('radarCategories.scoring')}</li>
                  <li>{t('radarCategories.playmaking')}</li>
                  <li>{t('radarCategories.defense')}</li>
                  <li>{t('radarCategories.athleticism')}</li>
                  <li>{t('radarCategories.basketballIQ')}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">{t('statisticalMeasures.title')}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{t('statisticalMeasures.ppg')}</li>
                  <li>{t('statisticalMeasures.rpg')}</li>
                  <li>{t('statisticalMeasures.apg')}</li>
                  <li>{t('statisticalMeasures.spg')}</li>
                  <li>{t('statisticalMeasures.bpg')}</li>
                  <li>{t('statisticalMeasures.fg')}</li>
                </ul>
              </div>
            </div>
            <p className="text-sm mt-2">{t('algorithmExplanation')}</p>
            <p className="text-sm mt-2">{t('historicalContext')}</p>
            <p className="text-sm mt-2">
              {formatWithLink('dataSource', 'https://www.basketball-reference.com/', 'Basketball Reference')}
            </p>
            <p className="text-sm italic">{t('similiarityNote')}</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
