import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  loading: boolean;
  editingProperty?: boolean;
}

const PropertyFormActions = ({ onCancel, onSubmit, loading, editingProperty }) => {
  const { t } = useLanguage();
  return (
    <div className="flex justify-end items-center gap-3 mt-8">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border rounded hover:bg-gray-100 text-gray-700 bg-white"
        disabled={loading}
      >
        {t('cancel')}
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90 transition"
        disabled={loading}
      >
        {editingProperty ? t('editProperty') : t('addProperty')}
      </button>
    </div>
  );
};
export default PropertyFormActions;
