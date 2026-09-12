import { useApp } from '../context/AppContext';
import { languageNames } from '../i18n/translations';
import { Store, CreditCard, Receipt, Save, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { t, language, setLanguage } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl bg-[#F8F6F0] dark:bg-[#181512] min-h-screen text-[#1A1816] dark:text-[#F8F6F0]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1816] dark:text-[#F8F6F0]">{t('settings')}</h1>
          <p className="text-[#6B635B] dark:text-[#A89F95] text-sm mt-0.5">Configuration du système</p>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all self-start sm:self-auto ${
            saved 
              ? 'bg-[#FAF4ED] text-[#A87B43] border border-[#E8DEC8] dark:bg-[#2D241C] dark:text-[#C59E58]' 
              : 'bg-[#A87B43] hover:bg-[#906B33] text-white'
          }`}
        >
          <Save size={15} />
          {saved ? '✓ Sauvegardé' : t('save')}
        </button>
      </div>

      {/* Store Information */}
      <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center">
            <Store size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('storeInfo')}</h3>
            <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">Informations générales du commerce</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('storeName')}</label>
            <input
              type="text"
              defaultValue="CashMag Genève Centre"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('address')}</label>
            <input
              type="text"
              defaultValue="Rue du Mont-Blanc 15, 1201 Genève"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('phone')}</label>
            <input
              type="text"
              defaultValue="+41 22 700 77 07"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('email')}</label>
            <input
              type="email"
              defaultValue="geneve@cashmag.ch"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('general')}</h3>
            <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">Configuration générale du système</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('language')}</label>
            <div className="flex gap-2">
              {(['fr', 'en', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    language === lang
                      ? 'bg-[#A87B43] text-white shadow-xs'
                      : 'bg-[#F0EAE1] dark:bg-[#2D241C] text-[#6B635B] dark:text-[#A89F95] hover:text-[#1A1816]'
                  }`}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('currency')}</label>
            <select className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none">
              <option value="CHF">CHF - Franc suisse</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">{t('taxRate')}</label>
            <select className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none">
              <option value="7.7">7.7% (TVA Suisse normale)</option>
              <option value="3.7">3.7% (TVA Suisse réduite)</option>
              <option value="2.5">2.5% (TVA Suisse super réduite)</option>
              <option value="18">18% (TVA France)</option>
              <option value="20">20% (TVA France taux normal)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B635B] dark:text-[#A89F95] mb-1.5 block">Numéro IDE / TVA</label>
            <input
              type="text"
              defaultValue="CHE-123.456.789 TVA"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1E1B18] border border-[#EFECE6] dark:border-[#342D26] rounded-xl text-sm text-[#1A1816] dark:text-[#F8F6F0] focus:ring-2 focus:ring-[#A87B43]/20 focus:border-[#A87B43] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center">
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('paymentMethods')}</h3>
            <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">Modes de paiement acceptés</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Espèces', nameEn: 'Cash', nameDe: 'Bar', enabled: true },
            { name: 'Carte de débit/crédit', nameEn: 'Debit/Credit Card', nameDe: 'Debit-/Kreditkarte', enabled: true },
            { name: 'TWINT', nameEn: 'TWINT', nameDe: 'TWINT', enabled: true },
            { name: 'PostFinance', nameEn: 'PostFinance', nameDe: 'PostFinance', enabled: true },
            { name: 'Carte cadeau', nameEn: 'Gift Card', nameDe: 'Geschenkkarte', enabled: false },
            { name: 'Paiement mixte', nameEn: 'Split Payment', nameDe: 'Teilzahlung', enabled: true },
          ].map((method, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#EFECE6] dark:border-[#342D26] last:border-0">
              <span className="text-sm font-semibold text-[#1A1816] dark:text-[#F8F6F0]">
                {language === 'en' ? method.nameEn : language === 'de' ? method.nameDe : method.name}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-[#E5DDD2] dark:bg-[#342D26] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A87B43]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A87B43]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Settings */}
      <div className="warm-card bg-white dark:bg-[#221E1A] rounded-2xl border border-[#EFECE6] dark:border-[#342D26] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FAF4ED] dark:bg-[#2D241C] text-[#A87B43] border border-[#EFECE6] dark:border-[#342D26] rounded-xl flex items-center justify-center">
            <Receipt size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1A1816] dark:text-[#F8F6F0]">{t('receipts')}</h3>
            <p className="text-xs text-[#6B635B] dark:text-[#A89F95]">Configuration des reçus</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: language === 'en' ? 'Print receipt automatically' : language === 'de' ? 'Beleg automatisch drucken' : 'Imprimer le reçu automatiquement', enabled: true },
            { label: language === 'en' ? 'Send receipt by email' : language === 'de' ? 'Beleg per E-Mail senden' : 'Envoyer le reçu par email', enabled: false },
            { label: language === 'en' ? 'Include store logo' : language === 'de' ? 'Filiallogo einbeziehen' : 'Inclure le logo du magasin', enabled: true },
            { label: language === 'en' ? 'Show itemized receipt' : language === 'de' ? 'Detaillierten Beleg anzeigen' : 'Afficher le reçu détaillé', enabled: true },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#EFECE6] dark:border-[#342D26] last:border-0">
              <span className="text-sm font-semibold text-[#1A1816] dark:text-[#F8F6F0]">{setting.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-[#E5DDD2] dark:bg-[#342D26] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A87B43]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A87B43]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
