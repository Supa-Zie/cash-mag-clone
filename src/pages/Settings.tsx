import { useApp } from '../context/AppContext';
import { languageNames } from '../i18n/translations';
import { Store, Globe, CreditCard, Receipt, Save, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { t, language, setLanguage } = useApp();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-w-4xl" style={{ backgroundColor: '#f6f5fa' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('settings')}</h1>
          <p className="text-slate-500 text-sm">Configuration du système</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <Save size={16} />
          {saved ? '✓ Sauvegardé' : t('save')}
        </button>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Store size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{t('storeInfo')}</h3>
            <p className="text-sm text-slate-500">Informations générales du commerce</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">{t('storeName')}</label>
            <input
              type="text"
              defaultValue="CashMag Genève Centre"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">{t('address')}</label>
            <input
              type="text"
              defaultValue="Rue du Mont-Blanc 15, 1201 Genève"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">{t('phone')}</label>
            <input
              type="text"
              defaultValue="+41 22 700 77 07"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">{t('email')}</label>
            <input
              type="email"
              defaultValue="geneve@cashmag.ch"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Shield size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{t('general')}</h3>
            <p className="text-sm text-slate-500">Configuration générale du système</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">{t('language')}</label>
            <div className="flex gap-2">
              {(['fr', 'en', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {languageNames[lang]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">{t('currency')}</label>
            <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="CHF">CHF - Franc suisse</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">{t('taxRate')}</label>
            <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="7.7">7.7% (TVA Suisse normale)</option>
              <option value="3.7">3.7% (TVA Suisse réduite)</option>
              <option value="2.5">2.5% (TVA Suisse super réduite)</option>
              <option value="18">18% (TVA France)</option>
              <option value="20">20% (TVA France taux normal)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Numéro IDE / TVA</label>
            <input
              type="text"
              defaultValue="CHE-123.456.789 TVA"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <CreditCard size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{t('paymentMethods')}</h3>
            <p className="text-sm text-slate-500">Modes de paiement acceptés</p>
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
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <span className="text-sm font-medium text-slate-700">
                {language === 'en' ? method.nameEn : language === 'de' ? method.nameDe : method.name}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Receipt size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{t('receipts')}</h3>
            <p className="text-sm text-slate-500">Configuration des reçus</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: language === 'en' ? 'Print receipt automatically' : language === 'de' ? 'Beleg automatisch drucken' : 'Imprimer le reçu automatiquement', enabled: true },
            { label: language === 'en' ? 'Send receipt by email' : language === 'de' ? 'Beleg per E-Mail senden' : 'Envoyer le reçu par email', enabled: false },
            { label: language === 'en' ? 'Include store logo' : language === 'de' ? 'Filiallogo einbeziehen' : 'Inclure le logo du magasin', enabled: true },
            { label: language === 'en' ? 'Show itemized receipt' : language === 'de' ? 'Detaillierten Beleg anzeigen' : 'Afficher le reçu détaillé', enabled: true },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <span className="text-sm font-medium text-slate-700">{setting.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={setting.enabled} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
