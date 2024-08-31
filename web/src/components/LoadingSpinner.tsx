import { useTranslations } from "next-intl";

export default function LoadingSpinner() {
  const translate = useTranslations("Common");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-xl font-semibold">{translate("loading")}</p>
    </div>
  );
}
